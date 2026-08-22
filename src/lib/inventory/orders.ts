'use server'

/**
 * src/lib/inventory/orders.ts
 *
 * Server-side order creation with integrated inventory management.
 *
 * Order lifecycle:
 *   INQUIRY → CONFIRMED → FULFILLED
 *   CONFIRMED → CANCELLED (with stock restoration)
 *   CONFIRMED → FAILED
 *
 * Idempotency: Each order attempt has a unique idempotencyKey.
 * If the same key is submitted twice, the second returns the first result.
 *
 * Partial failure handling:
 *   If decrementStock succeeds for item 1 but fails for item 2,
 *   item 1 is restored via restoreStock (compensating transaction).
 *   The operation then fails cleanly.
 */

import { sanityWriteClient } from './sanityWriteClient'
import {
  CreateOrderParams,
  CreateOrderResult,
  InventoryItem,
  OrderChannel,
} from './types'
import { decrementStock, restoreStock, getStockInfo } from './operations'

// ── Order ID generation ────────────────────────────────────────────────────────

function generateOrderId(): string {
  const timestamp = Date.now().toString().slice(-7)
  const random = Math.random().toString(36).slice(-3).toUpperCase()
  return `AWARAA-${timestamp}${random}`
}

// ── Idempotency check ──────────────────────────────────────────────────────────

/**
 * Checks if an order with this idempotencyKey has already been successfully created.
 * Returns the existing order ID if found.
 */
async function checkIdempotency(
  idempotencyKey: string
): Promise<{ alreadyProcessed: boolean; existingOrderId?: string }> {
  try {
    const existing = await sanityWriteClient.fetch<{ _id: string; orderId: string } | null>(
      `*[_type == "order" && idempotencyKey == $key && status in ["CONFIRMED", "FULFILLED"]][0]{
        _id, orderId
      }`,
      { key: idempotencyKey }
    )

    if (existing) {
      return { alreadyProcessed: true, existingOrderId: existing.orderId }
    }
  } catch (err) {
    // If idempotency check fails, allow the order to proceed.
    // The risk is a duplicate; this is safer than blocking all orders on a DB error.
    console.error('[Orders] Idempotency check failed (allowing order to proceed):', err)
  }

  return { alreadyProcessed: false }
}

// ── Update order status ────────────────────────────────────────────────────────

/**
 * Updates an order's status in Sanity.
 * Used for cancellations, fulfilment, etc.
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await sanityWriteClient.fetch<{ _id: string } | null>(
      `*[_type == "order" && orderId == $orderId][0]{_id}`,
      { orderId }
    )

    if (!existing) {
      return { success: false, error: `Order not found: ${orderId}` }
    }

    await sanityWriteClient
      .patch(existing._id)
      .set({
        status,
        updatedAt: new Date().toISOString(),
        ...(notes ? { notes } : {}),
      })
      .commit()

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update order status' }
  }
}

// ── Get orders ─────────────────────────────────────────────────────────────────

/**
 * Fetches orders for the admin dashboard, optionally filtered by channel.
 */
export async function getOrders(
  options: { channel?: OrderChannel; limit?: number; status?: string } = {}
): Promise<any[]> {
  const { channel, limit = 50, status } = options

  const channelFilter = channel ? ` && channel == $channel` : ''
  const statusFilter = status ? ` && status == $status` : ''

  try {
    return await sanityWriteClient.fetch(
      `*[_type == "order"${channelFilter}${statusFilter}] | order(createdAt desc) [0...$limit] {
        _id, orderId, channel, status, customer, items, totalAmount,
        paymentMethod, paymentStatus, inventoryDecremented, notes, createdAt, updatedAt
      }`,
      { channel: channel ?? '', status: status ?? '', limit: limit - 1 }
    )
  } catch (err) {
    console.error('[Orders] getOrders failed:', err)
    return []
  }
}

// ── Main: createOrder ──────────────────────────────────────────────────────────

/**
 * Creates a confirmed order with atomic inventory decrement.
 *
 * Steps:
 *   1. Idempotency check (prevents double-submission)
 *   2. Pre-flight stock validation (user-friendly errors)
 *   3. Sequential inventory decrements with ifRevisionID optimistic lock
 *   4. Compensating restore on partial failure
 *   5. Order document creation in Sanity
 *
 * IMPORTANT: Steps 3 and 5 are NOT atomically linked.
 * If step 5 fails after step 3 succeeds, inventory is decremented but
 * no order document exists. This rare condition is detectable via the
 * inventory audit log and flagged in the reconciliation report.
 */
export async function createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  // ── Step 1: Idempotency check ────────────────────────────────────────────
  const idempotencyCheck = await checkIdempotency(params.idempotencyKey)
  if (idempotencyCheck.alreadyProcessed) {
    console.log(`[Orders] Duplicate request detected for key=${params.idempotencyKey}, returning existing order`)
    return {
      success: true,
      orderId: idempotencyCheck.existingOrderId,
    }
  }

  // ── Step 2: Pre-flight stock validation ──────────────────────────────────
  // Collect all insufficient stock issues upfront for a better user experience.
  const insufficientItems: CreateOrderResult['insufficientItems'] = []

  for (const item of params.items) {
    const stockInfo = await getStockInfo(item.productId)
    if (!stockInfo) {
      return {
        success: false,
        error: `Product not found: ${item.productId}`,
      }
    }

    const variant = stockInfo.variants.find((v) => v.key === item.variantKey)
    if (!variant) {
      return {
        success: false,
        error: `Variant not found: key="${item.variantKey}" for "${stockInfo.productName}"`,
      }
    }

    if (variant.stock < item.quantity) {
      insufficientItems.push({
        productName: stockInfo.productName,
        size: variant.size,
        color: variant.color,
        requestedQty: item.quantity,
        availableQty: variant.stock,
      })
    }
  }

  if (insufficientItems.length > 0) {
    return { success: false, insufficientItems }
  }

  // ── Step 3: Inventory decrements (with compensation on failure) ──────────
  const orderId = generateOrderId()
  const decrementedItems: InventoryItem[] = []

  for (const item of params.items) {
    const inventoryItem: InventoryItem = {
      productId: item.productId,
      variantKey: item.variantKey,
      quantity: item.quantity,
    }

    const result = await decrementStock(
      inventoryItem,
      orderId,
      params.channel,
      `${params.channel} order by ${params.customer.name}`
    )

    if (!result.success) {
      // Compensating transaction: restore all previously decremented items
      console.error(
        `[Orders] Decrement failed for item ${item.variantKey}: ${result.error}. ` +
        `Restoring ${decrementedItems.length} previously decremented item(s).`
      )

      for (const decremented of decrementedItems) {
        await restoreStock(
          decremented,
          orderId,
          params.channel,
          `Compensating restore: order ${orderId} failed during creation`
        )
      }

      if (result.error === 'INSUFFICIENT_STOCK') {
        return {
          success: false,
          insufficientItems: [{
            productName: item.productName,
            size: item.size,
            color: item.color,
            requestedQty: item.quantity,
            availableQty: result.availableStock ?? 0,
          }],
        }
      }

      if (result.error === 'CONCURRENCY_CONFLICT') {
        return {
          success: false,
          error: `${result.message} (size: ${item.size})`,
        }
      }

      return {
        success: false,
        error: result.message ?? 'Failed to reserve inventory. Please try again.',
      }
    }

    decrementedItems.push(inventoryItem)
  }

  // ── Step 4: Create the order document in Sanity ──────────────────────────
  // NOTE: If this step fails, inventory has already been decremented.
  // The audit log will show the SALE entries without a corresponding order.
  // This can be detected and corrected via the reconciliation report.
  try {
    const orderDoc = {
      _type: 'order',
      orderId,
      idempotencyKey: params.idempotencyKey,
      channel: params.channel,
      status: 'CONFIRMED',
      customer: params.customer,
      items: params.items.map((item) => ({
        _key: crypto.randomUUID(),
        productId: item.productId,
        productName: item.productName,
        variantKey: item.variantKey,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      })),
      totalAmount: params.totalAmount,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentStatus ?? 'PENDING',
      razorpayOrderId: params.razorpayOrderId,
      razorpayPaymentId: params.razorpayPaymentId,
      inventoryDecremented: true,
      notes: params.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await sanityWriteClient.create(orderDoc)

    return { success: true, orderId }
  } catch (err: any) {
    // Order document creation failed, but inventory was already decremented.
    // Log this critical inconsistency for manual reconciliation.
    console.error(
      `[Orders] CRITICAL: Inventory decremented for order ${orderId} but ` +
      `order document creation failed. Manual reconciliation required. ` +
      `Error: ${err?.message}`
    )

    return {
      success: false,
      error:
        `Order record could not be saved (inventory was reserved). ` +
        `Please contact support with reference: ${orderId}`,
    }
  }
}
