/**
 * src/lib/inventory/types.ts
 *
 * Canonical type definitions for the inventory system.
 * These types are shared between server-side inventory operations
 * and client-facing API response shapes.
 */

// ── Channel & Operation Enums ─────────────────────────────────────────────────

export type OrderChannel =
  | 'WEBSITE'
  | 'INSTAGRAM'
  | 'WHATSAPP'
  | 'OFFLINE'
  | 'OTHER'

export type InventoryOperation =
  | 'SALE'
  | 'RESTOCK'
  | 'CANCELLATION'
  | 'MANUAL_ADJUSTMENT'
  | 'RESERVATION'
  | 'RESERVATION_RELEASE'
  | 'IMPORT'

export type OrderStatus =
  | 'INQUIRY'
  | 'RESERVED'
  | 'CONFIRMED'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'FAILED'
  | 'REFUNDED'
  | 'RETURNED'

export type PaymentMethod = 'RAZORPAY' | 'COD' | 'UPI' | 'BANK' | 'OTHER'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

// ── Stock Status ───────────────────────────────────────────────────────────────

// LOW_STOCK threshold: 1-3 units
// Configurable via LOW_STOCK_THRESHOLD env var; defaults to 3.
export function getLowStockThreshold(): number {
  const val = parseInt(process.env.LOW_STOCK_THRESHOLD || '3', 10)
  return isNaN(val) || val < 1 ? 3 : val
}

export function deriveStockStatus(stock: number): 'IN_STOCK' | 'LOW_STOCK' | 'SOLD_OUT' {
  if (stock <= 0) return 'SOLD_OUT'
  if (stock <= getLowStockThreshold()) return 'LOW_STOCK'
  return 'IN_STOCK'
}

// ── Inventory Operation Input/Output ──────────────────────────────────────────

export interface InventoryItem {
  /** Sanity product _id */
  productId: string
  /** Variant _key within the product's variants[] array */
  variantKey: string
  quantity: number
}

export interface InventoryDecrementResult {
  success: boolean
  stockBefore?: number
  stockAfter?: number
  error?:
    | 'INSUFFICIENT_STOCK'
    | 'PRODUCT_NOT_FOUND'
    | 'VARIANT_NOT_FOUND'
    | 'CONCURRENCY_CONFLICT'
    | 'SANITY_ERROR'
    | 'INVALID_QUANTITY'
    | 'DUPLICATE_REQUEST'
    | 'CONFIG_ERROR'
  message?: string
  /** Current available stock (returned when INSUFFICIENT_STOCK) */
  availableStock?: number
}

export interface InventoryRestoreResult {
  success: boolean
  error?: string
  message?: string
}

// ── Stock Info ────────────────────────────────────────────────────────────────

export interface VariantStockInfo {
  key: string
  size: string
  color: string
  colorHex?: string
  stock: number
  available: boolean
  status: 'IN_STOCK' | 'LOW_STOCK' | 'SOLD_OUT'
}

export interface StockInfo {
  productId: string
  productName: string
  productRev: string
  variants: VariantStockInfo[]
}

// ── Order Creation ─────────────────────────────────────────────────────────────

export interface OrderLineItem {
  productId: string
  productName: string
  variantKey: string
  size: string
  color: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderParams {
  /** Must be unique per order attempt; used for idempotency */
  idempotencyKey: string
  channel: OrderChannel
  customer: {
    name: string
    contact?: string   // phone or email
    address?: string
  }
  items: OrderLineItem[]
  totalAmount: number
  paymentMethod: PaymentMethod
  paymentStatus?: PaymentStatus
  razorpayOrderId?: string
  razorpayPaymentId?: string
  notes?: string
}

export interface CreateOrderResult {
  success: boolean
  orderId?: string
  error?: string
  /** Populated when one or more items have insufficient stock */
  insufficientItems?: Array<{
    productName: string
    size: string
    color: string
    requestedQty: number
    availableQty: number
  }>
}

// ── Inventory Adjustment (admin use) ─────────────────────────────────────────

export interface AdjustStockParams {
  productId: string
  variantKey: string
  newStock: number
  reason: string
  channel?: OrderChannel
  actorNote?: string
}

export interface AdjustStockResult {
  success: boolean
  stockBefore?: number
  stockAfter?: number
  error?: string
}
