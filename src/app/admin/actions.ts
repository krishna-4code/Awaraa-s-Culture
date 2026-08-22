'use server'

/**
 * src/app/admin/actions.ts
 *
 * Server actions for admin operations.
 * All actions enforce admin authorization before executing.
 */

import { requireAdmin } from '@/lib/admin/auth'
import { adjustStock } from '@/lib/inventory/operations'
import { createOrder } from '@/lib/inventory/orders'
import type { CreateOrderParams } from '@/lib/inventory/types'

// ── Instagram Order Creation ───────────────────────────────────────────────────

/**
 * Creates an Instagram DM order from the admin dashboard form.
 * Validates admin auth, then creates a CONFIRMED order with inventory decrement.
 */
export async function createInstagramOrder(
  formData: FormData
): Promise<{ success: boolean; orderId?: string; error?: string; insufficientItems?: any[] }> {
  // Auth check
  try {
    await requireAdmin()
  } catch (err: any) {
    return { success: false, error: 'Unauthorized: admin access required.' }
  }

  // Extract and validate form data
  const productId = formData.get('productId') as string
  const variantKey = formData.get('variantKey') as string
  const productName = formData.get('productName') as string
  const size = formData.get('size') as string
  const color = formData.get('color') as string
  const quantity = parseInt(formData.get('quantity') as string, 10)
  const unitPrice = parseFloat(formData.get('unitPrice') as string)
  const customerName = formData.get('customerName') as string
  const customerContact = (formData.get('customerContact') as string) || undefined
  const paymentMethod = (formData.get('paymentMethod') as string) || 'COD'
  const notes = (formData.get('notes') as string) || undefined

  if (!productId || !variantKey || !customerName || !quantity || quantity < 1) {
    return { success: false, error: 'Missing required fields.' }
  }

  if (!unitPrice || unitPrice <= 0) {
    return { success: false, error: 'Unit price must be a positive number.' }
  }

  const params: CreateOrderParams = {
    idempotencyKey: crypto.randomUUID(), // Admin orders don't re-submit; fresh key each time
    channel: 'INSTAGRAM',
    customer: {
      name: customerName,
      contact: customerContact,
    },
    items: [{
      productId,
      productName,
      variantKey,
      size,
      color,
      quantity,
      unitPrice,
    }],
    totalAmount: unitPrice * quantity,
    paymentMethod: paymentMethod as any,
    paymentStatus: 'PENDING',
    notes,
  }

  const result = await createOrder(params)

  return {
    success: result.success,
    orderId: result.orderId,
    error: result.error,
    insufficientItems: result.insufficientItems,
  }
}

// ── Stock Adjustment ───────────────────────────────────────────────────────────

/**
 * Admin stock adjustment action.
 * Sets stock to a specific value with an audit reason.
 */
export async function adjustStockAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; stockBefore?: number; stockAfter?: number }> {
  try {
    await requireAdmin()
  } catch (err: any) {
    return { success: false, error: 'Unauthorized.' }
  }

  const productId = formData.get('productId') as string
  const variantKey = formData.get('variantKey') as string
  const newStock = parseInt(formData.get('newStock') as string, 10)
  const reason = formData.get('reason') as string

  if (!productId || !variantKey || isNaN(newStock) || newStock < 0) {
    return { success: false, error: 'Invalid parameters.' }
  }

  if (!reason?.trim()) {
    return { success: false, error: 'Reason is required for stock adjustments.' }
  }

  const result = await adjustStock({
    productId,
    variantKey,
    newStock,
    reason,
    actorNote: `Admin adjustment: ${reason}`,
  })

  return result
}
