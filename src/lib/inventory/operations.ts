'use server'

/**
 * src/lib/inventory/operations.ts
 *
 * Core server-side inventory operations with optimistic locking.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * CONCURRENCY STRATEGY
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Sanity does NOT provide a native atomic conditional decrement (i.e., "SET
 * stock = stock - 1 WHERE stock >= 1"). What it DOES provide is ifRevisionID
 * (optimistic locking / compare-and-swap).
 *
 * The algorithm is:
 *   1. Read the product document (fetch _id, _rev, and variants[])
 *   2. Validate stock client-side
 *   3. Patch the document using .ifRevisionID(doc._rev)
 *      → Sanity rejects the patch with HTTP 409 if _rev changed since step 1
 *
 * If two requests (Website + Instagram) simultaneously read stock = 1:
 *   - Request A patches with ifRevisionID("rev-A") → succeeds, stock → 0
 *   - Request B patches with ifRevisionID("rev-A") → FAILS (409), because
 *     the document's _rev has changed to "rev-B" after Request A committed.
 *
 * Result: exactly ONE request succeeds. The other receives CONCURRENCY_CONFLICT
 * and the caller must return a user-facing error.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * WHAT IS ATOMIC vs WHAT IS NOT
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ATOMIC (guaranteed by Sanity):
 *   - A single patch on one product document with ifRevisionID
 *
 * NOT ATOMIC:
 *   - An order with multiple items (requires multiple document patches)
 *   - The inventory audit log write (separate document creation)
 *   - The order document creation (separate document creation)
 *
 * PARTIAL FAILURE HANDLING:
 *   - If item 2 of 3 fails to decrement, items already decremented are
 *     restored via restoreStock() (compensating transaction)
 *   - If the order document creation fails AFTER all inventory decrements
 *     succeed, the order creation returns an error but inventory remains
 *     decremented. The audit log records this. Reconciliation can detect it.
 *   - The idempotency key prevents double-processing on retries.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { revalidatePath } from 'next/cache'
import { sanityWriteClient } from './sanityWriteClient'
import {
  InventoryItem,
  InventoryDecrementResult,
  InventoryRestoreResult,
  StockInfo,
  AdjustStockParams,
  AdjustStockResult,
  OrderChannel,
  InventoryOperation,
  deriveStockStatus,
} from './types'

// ── Internal product fetch query ───────────────────────────────────────────────

const PRODUCT_FOR_INVENTORY_QUERY = `
  *[_type == "product" && _id == $productId][0] {
    _id,
    _rev,
    name,
    variants[] {
      _key,
      size,
      color,
      colorHex,
      stock
    }
  }
`

type SanityProductDoc = {
  _id: string
  _rev: string
  name: string
  variants: Array<{
    _key: string
    size: string
    color: string
    colorHex?: string
    stock: number
  }>
}

// ── Inventory audit log ────────────────────────────────────────────────────────

interface LogInventoryChangeParams {
  operationType: InventoryOperation
  channel: OrderChannel | 'SYSTEM'
  productId: string
  productName: string
  variantKey: string
  size: string
  color: string
  quantityChange: number
  stockBefore?: number
  stockAfter?: number
  orderId?: string
  actorNote?: string
}

/**
 * Records an inventory change to the audit log.
 * Best-effort: errors are logged but do NOT fail the parent operation.
 */
async function logInventoryChange(params: LogInventoryChangeParams): Promise<void> {
  try {
    const logId = crypto.randomUUID()
    await sanityWriteClient.create({
      _type: 'inventoryLog',
      logId,
      operationType: params.operationType,
      channel: params.channel,
      productId: params.productId,
      productName: params.productName,
      variantKey: params.variantKey,
      size: params.size,
      color: params.color,
      quantityChange: params.quantityChange,
      stockBefore: params.stockBefore,
      stockAfter: params.stockAfter,
      orderId: params.orderId,
      actorNote: params.actorNote,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    // Audit log failure must NEVER fail the inventory operation itself.
    console.error('[InventoryLog] Failed to write audit log:', err)
  }
}

// ── Core: getStockInfo ─────────────────────────────────────────────────────────

/**
 * Fetches current stock information for a product.
 * Uses useCdn: false for consistent, non-cached reads.
 */
export async function getStockInfo(productId: string): Promise<StockInfo | null> {
  try {
    const doc = await sanityWriteClient.fetch<SanityProductDoc | null>(
      PRODUCT_FOR_INVENTORY_QUERY,
      { productId }
    )

    if (!doc) return null

    return {
      productId: doc._id,
      productName: doc.name,
      productRev: doc._rev,
      variants: (doc.variants || []).map((v) => {
        const stock = typeof v.stock === 'number' ? v.stock : 0
        return {
          key: v._key,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stock,
          available: stock > 0,
          status: deriveStockStatus(stock),
        }
      }),
    }
  } catch (err) {
    console.error(`[Inventory] getStockInfo failed for productId=${productId}:`, err)
    return null
  }
}

// ── Core: decrementStock ───────────────────────────────────────────────────────

/**
 * Decrements stock for a single variant using optimistic locking.
 *
 * Safety guarantee: Only ONE of two concurrent requests for the same
 * last unit will succeed. The other receives CONCURRENCY_CONFLICT.
 *
 * @param item     - Product ID, variant key, and quantity to decrement
 * @param orderId  - Associated order ID for audit trail
 * @param channel  - Sales channel (WEBSITE, INSTAGRAM, etc.)
 * @param actorNote - Optional human-readable description of who/what triggered this
 */
export async function decrementStock(
  item: InventoryItem,
  orderId: string,
  channel: OrderChannel,
  actorNote?: string
): Promise<InventoryDecrementResult> {
  // 1. Validate quantity
  if (!Number.isInteger(item.quantity) || item.quantity < 1) {
    return {
      success: false,
      error: 'INVALID_QUANTITY',
      message: `Quantity must be a positive integer. Got: ${item.quantity}`,
    }
  }

  // 2. Fetch the product document (non-CDN for consistency)
  let doc: SanityProductDoc | null
  try {
    doc = await sanityWriteClient.fetch<SanityProductDoc | null>(
      PRODUCT_FOR_INVENTORY_QUERY,
      { productId: item.productId }
    )
  } catch (err: any) {
    return {
      success: false,
      error: 'SANITY_ERROR',
      message: `Failed to fetch product: ${err?.message || 'Unknown error'}`,
    }
  }

  // 3. Validate product exists
  if (!doc) {
    return {
      success: false,
      error: 'PRODUCT_NOT_FOUND',
      message: `Product not found: ${item.productId}`,
    }
  }

  // 4. Validate variant exists
  const variant = doc.variants?.find((v) => v._key === item.variantKey)
  if (!variant) {
    return {
      success: false,
      error: 'VARIANT_NOT_FOUND',
      message: `Variant not found: key="${item.variantKey}" in product "${doc.name}"`,
    }
  }

  const stockBefore = typeof variant.stock === 'number' ? variant.stock : 0

  // 5. Check sufficient stock
  if (stockBefore < item.quantity) {
    return {
      success: false,
      error: 'INSUFFICIENT_STOCK',
      availableStock: stockBefore,
      message: `Insufficient stock. Current available quantity: ${stockBefore}`,
    }
  }

  const newStock = stockBefore - item.quantity

  // 6. Optimistic-lock patch using ifRevisionID
  //
  // Sanity will REJECT this patch with HTTP 409 if another request has
  // already modified this document (changing its _rev) since we fetched it.
  // This is the key concurrency protection mechanism.
  try {
    await sanityWriteClient
      .patch(item.productId)
      .ifRevisionId(doc._rev)
      .set({ [`variants[_key=="${item.variantKey}"].stock`]: newStock })
      .commit({ visibility: 'sync' })
    // visibility: 'sync' ensures the write is durably committed and
    // immediately visible to subsequent reads before this function returns.

    // 7. Log the inventory change (best-effort, non-blocking)
    await logInventoryChange({
      operationType: 'SALE',
      channel,
      productId: doc._id,
      productName: doc.name,
      variantKey: item.variantKey,
      size: variant.size,
      color: variant.color,
      quantityChange: -item.quantity,
      stockBefore,
      stockAfter: newStock,
      orderId,
      actorNote: actorNote ?? `${channel} order`,
    })

    // 8. Invalidate Next.js cache so the storefront shows updated stock
    revalidatePath('/', 'layout')
    revalidatePath('/products')

    return {
      success: true,
      stockBefore,
      stockAfter: newStock,
    }
  } catch (err: any) {
    // Sanity returns 409 when ifRevisionID check fails (document was mutated by another request)
    const status = err?.statusCode ?? err?.response?.statusCode
    if (status === 409) {
      return {
        success: false,
        error: 'CONCURRENCY_CONFLICT',
        message:
          'This item was just purchased by another customer. Please try again or choose a different size.',
      }
    }

    return {
      success: false,
      error: 'SANITY_ERROR',
      message: `Sanity mutation failed: ${err?.message || 'Unknown error'}`,
    }
  }
}

// ── Core: restoreStock ─────────────────────────────────────────────────────────

/**
 * Restores (increments) stock when an order is cancelled or a decrement
 * needs to be rolled back.
 *
 * Unlike decrementStock, this does NOT use ifRevisionID — restoration
 * should succeed even if the document has been modified.
 * Uses Sanity's atomic inc() operation.
 */
export async function restoreStock(
  item: InventoryItem,
  orderId: string,
  channel: OrderChannel,
  reason: string
): Promise<InventoryRestoreResult> {
  try {
    // Fetch current state for audit log
    const doc = await sanityWriteClient.fetch<SanityProductDoc | null>(
      PRODUCT_FOR_INVENTORY_QUERY,
      { productId: item.productId }
    )

    const variant = doc?.variants?.find((v) => v._key === item.variantKey)
    const stockBefore = typeof variant?.stock === 'number' ? variant.stock : undefined

    // Use inc() for restoration — this is safer than set() as it doesn't
    // risk overwriting concurrent changes
    await sanityWriteClient
      .patch(item.productId)
      .inc({ [`variants[_key=="${item.variantKey}"].stock`]: item.quantity })
      .commit({ visibility: 'sync' })

    const stockAfter = stockBefore !== undefined ? stockBefore + item.quantity : undefined

    await logInventoryChange({
      operationType: 'CANCELLATION',
      channel,
      productId: item.productId,
      productName: doc?.name ?? 'Unknown',
      variantKey: item.variantKey,
      size: variant?.size ?? 'Unknown',
      color: variant?.color ?? 'Unknown',
      quantityChange: item.quantity,
      stockBefore,
      stockAfter,
      orderId,
      actorNote: reason,
    })

    revalidatePath('/', 'layout')
    revalidatePath('/products')

    return { success: true }
  } catch (err: any) {
    console.error('[Inventory] restoreStock failed:', err)
    return {
      success: false,
      error: `Stock restoration failed: ${err?.message || 'Unknown error'}`,
    }
  }
}

// ── Admin: adjustStock ─────────────────────────────────────────────────────────

/**
 * Admin-only direct stock adjustment.
 * Sets stock to an exact value. Used for:
 * - Restocking (newStock > current)
 * - Manual corrections
 * - Marking items unavailable (newStock = 0)
 *
 * This operation is NOT optimistically locked — admin adjustments
 * should always succeed. The audit log records the change.
 */
export async function adjustStock(params: AdjustStockParams): Promise<AdjustStockResult> {
  if (!Number.isInteger(params.newStock) || params.newStock < 0) {
    return {
      success: false,
      error: 'New stock must be a non-negative integer.',
    }
  }

  try {
    const doc = await sanityWriteClient.fetch<SanityProductDoc | null>(
      PRODUCT_FOR_INVENTORY_QUERY,
      { productId: params.productId }
    )

    if (!doc) {
      return { success: false, error: 'Product not found.' }
    }

    const variant = doc.variants?.find((v) => v._key === params.variantKey)
    if (!variant) {
      return { success: false, error: 'Variant not found.' }
    }

    const stockBefore = typeof variant.stock === 'number' ? variant.stock : 0

    await sanityWriteClient
      .patch(params.productId)
      .set({ [`variants[_key=="${params.variantKey}"].stock`]: params.newStock })
      .commit({ visibility: 'sync' })

    await logInventoryChange({
      operationType: 'MANUAL_ADJUSTMENT',
      channel: params.channel ?? 'WEBSITE',
      productId: params.productId,
      productName: doc.name,
      variantKey: params.variantKey,
      size: variant.size,
      color: variant.color,
      quantityChange: params.newStock - stockBefore,
      stockBefore,
      stockAfter: params.newStock,
      actorNote: params.actorNote ?? params.reason,
    })

    revalidatePath('/', 'layout')
    revalidatePath('/products')

    return {
      success: true,
      stockBefore,
      stockAfter: params.newStock,
    }
  } catch (err: any) {
    console.error('[Inventory] adjustStock failed:', err)
    return {
      success: false,
      error: `Adjustment failed: ${err?.message || 'Unknown error'}`,
    }
  }
}

// ── Admin: getInventoryLogs ────────────────────────────────────────────────────

/**
 * Fetches recent inventory log entries for the admin dashboard.
 */
export async function getInventoryLogs(limit = 50): Promise<any[]> {
  try {
    return await sanityWriteClient.fetch(
      `*[_type == "inventoryLog"] | order(timestamp desc) [0...$limit] {
        logId, operationType, channel, productId, productName,
        variantKey, size, color, quantityChange, stockBefore, stockAfter,
        orderId, actorNote, timestamp
      }`,
      { limit: limit - 1 }
    )
  } catch (err) {
    console.error('[Inventory] getInventoryLogs failed:', err)
    return []
  }
}

// ── Admin: getAllProductsWithStock ─────────────────────────────────────────────

/**
 * Fetches all products with their variant stock levels for the admin dashboard.
 */
export async function getAllProductsWithStock(): Promise<StockInfo[]> {
  try {
    const docs = await sanityWriteClient.fetch<SanityProductDoc[]>(
      `*[_type == "product" && !isPlaceholder] | order(name asc) {
        _id, _rev, name, variants[]{ _key, size, color, colorHex, stock }
      }`
    )

    return docs.map((doc) => ({
      productId: doc._id,
      productName: doc.name,
      productRev: doc._rev,
      variants: (doc.variants || []).map((v) => {
        const stock = typeof v.stock === 'number' ? v.stock : 0
        return {
          key: v._key,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stock,
          available: stock > 0,
          status: deriveStockStatus(stock),
        }
      }),
    }))
  } catch (err) {
    console.error('[Inventory] getAllProductsWithStock failed:', err)
    return []
  }
}
