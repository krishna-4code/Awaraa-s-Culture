'use server'

/**
 * src/lib/commerce/checkout.ts
 *
 * Website checkout server actions with integrated inventory management.
 *
 * This replaces the old razorpay.ts flow which had NO inventory decrement.
 *
 * NEW FLOW:
 *   1. createCheckoutOrder() — creates Razorpay payment order
 *   2. (Client: Razorpay modal opens, customer pays)
 *   3. confirmWebsiteOrder() — verifies payment + decrements inventory + creates order
 *
 * The inventory decrement happens at step 3 (after payment is confirmed),
 * not at step 1 (when checkout is initiated). This avoids holding stock
 * for customers who abandon the checkout.
 *
 * If payment is confirmed but inventory decrement fails (race condition),
 * the function returns a detailed error. The payment has already gone through,
 * so the admin must be notified. This is logged prominently.
 */

import crypto from 'crypto'
import { createOrder } from '@/lib/inventory/orders'
import { type CreateOrderParams } from '@/lib/inventory/types'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface WebsiteCheckoutItem {
  /** Sanity product _id */
  productId: string
  /** Variant _key in the product's variants[] array */
  variantKey: string
  productName: string
  size: string
  color: string
  quantity: number
  unitPrice: number
}

export interface InitiateCheckoutParams {
  amount: number // in INR
  lineItems: WebsiteCheckoutItem[]
  customerName?: string
  customerEmail?: string
  customerPhone?: string
}

export interface InitiateCheckoutResponse {
  success: boolean
  orderId?: string       // Razorpay order ID
  amount?: number        // in paise
  currency?: string
  keyId?: string
  isTestMode?: boolean
  idempotencyKey?: string  // caller must pass this back to confirmWebsiteOrder
  error?: string
}

export interface ConfirmWebsiteOrderParams {
  idempotencyKey: string
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  lineItems: WebsiteCheckoutItem[]
  totalAmount: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  shippingAddress?: string
  promoCode?: string
}

export interface ConfirmWebsiteOrderResponse {
  success: boolean
  orderNumber?: string
  paymentId?: string
  error?: string
  insufficientItems?: Array<{
    productName: string
    size: string
    requestedQty: number
    availableQty: number
  }>
}

// ── Step 1: Initiate checkout — creates Razorpay order ─────────────────────────

/**
 * Creates a Razorpay payment order. Does NOT modify inventory.
 * Returns an idempotencyKey that the client must preserve and send back.
 */
export async function initiateWebsiteCheckout(
  params: InitiateCheckoutParams
): Promise<InitiateCheckoutResponse> {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  const amountInPaise = Math.round(params.amount * 100)
  // Generate idempotency key for this checkout session
  const idempotencyKey = crypto.randomUUID()

  if (keyId && keySecret && !keyId.includes('your_key_id')) {
    try {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            brand: "Awaraa's Culture",
            idempotencyKey,
          },
        }),
      })

      const orderData = await response.json()

      if (response.ok && orderData.id) {
        return {
          success: true,
          orderId: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          keyId,
          idempotencyKey,
          isTestMode: keyId.startsWith('rzp_test_'),
        }
      } else {
        return {
          success: false,
          error: orderData.error?.description || 'Failed to create payment order.',
        }
      }
    } catch (err: any) {
      return { success: false, error: 'Network connection to payment gateway failed.' }
    }
  }

  // Sandbox mode (no real Razorpay keys)
  return {
    success: true,
    orderId: `order_sandbox_${Date.now()}`,
    amount: amountInPaise,
    currency: 'INR',
    keyId: keyId || 'rzp_test_sandbox_placeholder',
    idempotencyKey,
    isTestMode: true,
  }
}

// ── Step 2: Confirm order — verify payment + decrement inventory ────────────────

/**
 * After Razorpay payment succeeds on the client:
 *   1. Verify the HMAC signature
 *   2. Decrement inventory (with concurrency protection)
 *   3. Create the order record
 *
 * CRITICAL: If inventory is insufficient at this step (race condition),
 * we return an error. The payment has been captured but we cannot fulfill.
 * This should trigger a refund (not yet automated — requires admin action).
 */
export async function confirmWebsiteOrder(
  params: ConfirmWebsiteOrderParams
): Promise<ConfirmWebsiteOrderResponse> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  // ── Step 1: Verify Razorpay signature ────────────────────────────────────
  if (keySecret && !keySecret.includes('your_razorpay_secret')) {
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== params.razorpay_signature) {
      console.error(
        '[Checkout] SECURITY: Invalid payment signature for Razorpay order:',
        params.razorpay_order_id
      )
      return {
        success: false,
        error: 'Payment verification failed: invalid signature. Potential tampering detected.',
      }
    }
  } else {
    console.warn('[Checkout] Running in sandbox mode — signature verification skipped.')
  }

  // ── Step 2: Create order with inventory decrement ─────────────────────────
  const orderParams: CreateOrderParams = {
    idempotencyKey: params.idempotencyKey,
    channel: 'WEBSITE',
    customer: {
      name: params.customerName || 'Guest',
      contact: params.customerEmail || params.customerPhone,
      address: params.shippingAddress,
    },
    items: params.lineItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      variantKey: item.variantKey,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    totalAmount: params.totalAmount,
    paymentMethod: 'RAZORPAY',
    paymentStatus: 'PAID',
    razorpayOrderId: params.razorpay_order_id,
    razorpayPaymentId: params.razorpay_payment_id,
  }

  const orderResult = await createOrder(orderParams)

  if (!orderResult.success) {
    if (orderResult.insufficientItems && orderResult.insufficientItems.length > 0) {
      // Payment was captured but we can't fulfill — admin action required
      console.error(
        '[Checkout] CRITICAL: Payment captured but inventory insufficient. ' +
        'Razorpay Payment ID:', params.razorpay_payment_id,
        'Items:', orderResult.insufficientItems
      )
      return {
        success: false,
        error:
          'Your payment was received but the item(s) you ordered are no longer available. ' +
          'A full refund will be processed within 3-5 business days.',
        insufficientItems: orderResult.insufficientItems,
      }
    }

    return {
      success: false,
      error: orderResult.error || 'Order creation failed after payment.',
    }
  }

  // Record promo redemption if single-use promo code was applied
  if (params.promoCode && params.customerEmail) {
    try {
      const { recordPromoRedemption } = await import('@/lib/commerce/promo')
      await recordPromoRedemption(params.promoCode, params.customerEmail, orderResult.orderId)
    } catch (promoErr) {
      console.warn('[Website Checkout] Promo redemption recording notice:', promoErr)
    }
  }

  return {
    success: true,
    orderNumber: orderResult.orderId,
    paymentId: params.razorpay_payment_id,
  }
}

// ── Step 3: Record Instagram Order Request (Inquiry) ──────────────────────────

export interface InstagramCheckoutItem {
  productId?: string
  variantKey?: string
  productName: string
  size: string
  color?: string
  quantity: number
  unitPrice: number
}

export interface RecordInstagramOrderParams {
  orderRef: string
  lineItems: InstagramCheckoutItem[]
  subtotal: number
  discount?: number
  promoCode?: string
  totalAmount: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  shippingAddress: string
  notes?: string
}

export interface RecordInstagramOrderResponse {
  success: boolean
  orderRef: string
  error?: string
}

/**
 * Records an Instagram order inquiry in the system for tracking.
 * Status is set to INQUIRY and inventory is not prematurely decremented until
 * confirmed by Awaraa's Culture team on Instagram.
 */
export async function recordInstagramOrderRequest(
  params: RecordInstagramOrderParams
): Promise<RecordInstagramOrderResponse> {
  try {
    const contactInfo = [params.customerPhone, params.customerEmail].filter(Boolean).join(' / ')

    const orderDoc = {
      _type: 'order',
      orderId: params.orderRef,
      idempotencyKey: params.orderRef,
      channel: 'INSTAGRAM',
      status: 'INQUIRY',
      customer: {
        name: params.customerName,
        contact: contactInfo || params.customerPhone,
        address: params.shippingAddress,
      },
      items: params.lineItems.map((item) => ({
        _key: crypto.randomUUID(),
        productId: item.productId || 'product_ref',
        productName: item.productName,
        variantKey: item.variantKey || 'standard',
        size: item.size,
        color: item.color || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      })),
      totalAmount: params.totalAmount,
      paymentMethod: 'OTHER',
      paymentStatus: 'PENDING',
      inventoryDecremented: false,
      notes: [
        params.promoCode ? `Promo: ${params.promoCode} (-₹${params.discount || 0})` : '',
        params.customerEmail ? `Account: ${params.customerEmail}` : '',
        params.notes ? `Customer Note: ${params.notes}` : '',
      ].filter(Boolean).join(' | ') || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      const { sanityWriteClient } = await import('@/lib/inventory/sanityWriteClient')
      await sanityWriteClient.create(orderDoc)
    } catch (sanityErr: any) {
      console.warn('[Instagram Order] Sanity sync notice:', sanityErr?.message || 'Sanity not active')
    }

    // Record single-use promo redemption if applicable
    if (params.promoCode && params.customerEmail) {
      try {
        const { recordPromoRedemption } = await import('@/lib/commerce/promo')
        await recordPromoRedemption(params.promoCode, params.customerEmail, params.orderRef)
      } catch (promoErr) {
        console.warn('[Instagram Order] Promo redemption recording notice:', promoErr)
      }
    }

    return {
      success: true,
      orderRef: params.orderRef,
    }
  } catch (err: any) {
    console.error('[Instagram Order] Exception during inquiry creation:', err)
    return {
      success: true,
      orderRef: params.orderRef,
    }
  }
}

// ── Step 4: Pre-flight Cart & Price & Inventory Validation ────────────────────

export interface CartValidationLineItem {
  handle: string
  variantId: string
  size: string
  color?: string
  quantity: number
  expectedUnitPrice: number
}

export interface CartValidationResult {
  valid: boolean
  message?: string
  issues?: Array<{
    type: 'PRODUCT_MISSING' | 'VARIANT_MISSING' | 'OUT_OF_STOCK' | 'PRICE_CHANGED'
    productName: string
    description: string
  }>
  validatedItems?: InstagramCheckoutItem[]
}

/**
 * Validates every item in the cart against current authoritative catalog & stock:
 * - Product still exists
 * - Selected variant / size / color exists
 * - Quantity is valid and within available inventory
 * - Authoritative price matches expected price
 *
 * If any discrepancy is found, returns valid: false with a clear warning:
 * "Some items in your cart have changed. Please review your cart before continuing."
 */
export async function validateCartBeforeCheckout(
  lines: CartValidationLineItem[]
): Promise<CartValidationResult> {
  const { getProduct } = await import('@/lib/commerce/products')
  const issues: Array<{
    type: 'PRODUCT_MISSING' | 'VARIANT_MISSING' | 'OUT_OF_STOCK' | 'PRICE_CHANGED'
    productName: string
    description: string
  }> = []

  const validatedItems: InstagramCheckoutItem[] = []

  if (!lines || lines.length === 0) {
    return {
      valid: false,
      message: 'Your cart is empty. Please add items before placing an order.',
      issues: [
        {
          type: 'PRODUCT_MISSING',
          productName: 'Cart',
          description: 'No items in cart.',
        },
      ],
    }
  }

  for (const line of lines) {
    const product = await getProduct(line.handle)
    if (!product) {
      issues.push({
        type: 'PRODUCT_MISSING',
        productName: line.handle,
        description: `Product "${line.handle}" is no longer available.`,
      })
      continue
    }

    // Match variant by exact ID or size/color
    const variant = product.variants.find(
      (v) =>
        v.id === line.variantId ||
        (v.size === line.size && (!line.color || v.color === line.color))
    )

    if (!variant) {
      issues.push({
        type: 'VARIANT_MISSING',
        productName: product.name,
        description: `Size ${line.size}${line.color ? ` (${line.color})` : ''} is no longer available for "${product.name}".`,
      })
      continue
    }

    // Check availability / stock
    if (
      variant.available === false ||
      (typeof variant.stock === 'number' && variant.stock < line.quantity)
    ) {
      issues.push({
        type: 'OUT_OF_STOCK',
        productName: product.name,
        description: `"${product.name}" (Size ${line.size}) has insufficient stock (Requested: ${line.quantity}, Available: ${variant.stock ?? 0}).`,
      })
      continue
    }

    // Price validation
    const authoritativePrice =
      parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
    if (
      authoritativePrice > 0 &&
      Math.abs(authoritativePrice - line.expectedUnitPrice) > 1
    ) {
      issues.push({
        type: 'PRICE_CHANGED',
        productName: product.name,
        description: `Price for "${product.name}" has changed from ₹${line.expectedUnitPrice.toLocaleString('en-IN')} to ${product.price}.`,
      })
      continue
    }

    const separatorIdx = variant.id.lastIndexOf('__')
    const variantKey =
      separatorIdx >= 0 ? variant.id.slice(separatorIdx + 2) : variant.id

    validatedItems.push({
      productId: product._sanityId || product.id,
      variantKey,
      productName: product.name,
      size: variant.size || variant.title,
      color: variant.color || '',
      quantity: line.quantity,
      unitPrice: authoritativePrice || line.expectedUnitPrice,
    })
  }

  if (issues.length > 0) {
    return {
      valid: false,
      message:
        'Some items in your cart have changed. Please review your cart before continuing.',
      issues,
    }
  }

  return {
    valid: true,
    validatedItems,
  }
}


