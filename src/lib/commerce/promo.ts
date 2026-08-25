'use server'

/**
 * src/lib/commerce/promo.ts
 *
 * Server-side promo code validation and single-use redemption tracking per account/email.
 *
 * Rules:
 *   - 'AWARAA10' provides a 10% discount and is strictly limited to 1 use per account/email.
 *   - 'SQUAD10' provides a 10% discount for general squad members.
 */

import { sanityWriteClient } from '@/lib/inventory/sanityWriteClient'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'

export interface PromoValidationResult {
  valid: boolean
  code?: string
  discountPercent?: number
  error?: string
}

export interface RecordPromoResult {
  success: boolean
  error?: string
}

/**
 * Validates a promo code against active discount policies and single-use account limits.
 *
 * @param code The promo code string submitted by the user.
 * @param userEmail The email of the logged-in customer (required for single-use account codes like AWARAA10).
 */
export async function validatePromoCode(
  code: string,
  userEmail?: string | null
): Promise<PromoValidationResult> {
  const cleanCode = (code || '').trim().toUpperCase()

  if (!cleanCode) {
    return { valid: false, error: 'Please enter a coupon code.' }
  }

  // ── Code: AWARAA10 (Single-use per account / email) ──────────────────────
  if (cleanCode === 'AWARAA10') {
    const cleanEmail = (userEmail || '').trim().toLowerCase()

    if (!cleanEmail) {
      return {
        valid: false,
        error: "Please sign in to redeem code 'AWARAA10' (1 use per account).",
      }
    }

    const alreadyRedeemed = await hasUserRedeemedPromo('AWARAA10', cleanEmail)
    if (alreadyRedeemed) {
      return {
        valid: false,
        error: "The code 'AWARAA10' has already been redeemed for your account.",
      }
    }

    return {
      valid: true,
      code: 'AWARAA10',
      discountPercent: 10,
    }
  }

  // ── Code: SQUAD10 (Standard Squad 10% discount) ──────────────────────────
  if (cleanCode === 'SQUAD10') {
    return {
      valid: true,
      code: 'SQUAD10',
      discountPercent: 10,
    }
  }

  return {
    valid: false,
    error: "Invalid discount code. Try 'AWARAA10'",
  }
}

/**
 * Checks whether an account/email has already redeemed a single-use code.
 */
export async function hasUserRedeemedPromo(
  code: string,
  email: string
): Promise<boolean> {
  const cleanCode = (code || '').trim().toUpperCase()
  const cleanEmail = (email || '').trim().toLowerCase()

  if (!cleanCode || !cleanEmail) return false

  // 1. Check Sanity for dedicated redemption records
  try {
    const sanityRedemption = await sanityWriteClient.fetch<{ _id: string } | null>(
      `*[_type == "promo_redemption" && code == $code && lower(email) == $email][0]{ _id }`,
      { code: cleanCode, email: cleanEmail }
    )
    if (sanityRedemption) {
      return true
    }

    // 2. Check Sanity past orders where promo was noted with this email/contact
    const sanityOrderWithPromo = await sanityWriteClient.fetch<{ _id: string } | null>(
      `*[_type == "order" && (lower(customer.contact) == $email || notes match $email) && (promoCode == $code || notes match $code)][0]{ _id }`,
      { code: cleanCode, email: cleanEmail }
    )
    if (sanityOrderWithPromo) {
      return true
    }
  } catch (sanityErr) {
    console.warn('[Promo] Sanity check warning:', sanityErr)
  }

  // 3. Check Supabase promo_redemptions table if available
  try {
    const supabase = await createSupabaseServerClient()
    const { data: supabaseRecord } = await supabase
      .from('promo_redemptions')
      .select('id')
      .eq('code', cleanCode)
      .ilike('email', cleanEmail)
      .maybeSingle()

    if (supabaseRecord) {
      return true
    }
  } catch (supabaseErr) {
    // Supabase table may not exist yet in dev/sandbox — non-fatal
  }

  return false
}

/**
 * Records a successful promo redemption for an account/email.
 */
export async function recordPromoRedemption(
  code: string,
  userEmail: string,
  orderRef?: string
): Promise<RecordPromoResult> {
  const cleanCode = (code || '').trim().toUpperCase()
  const cleanEmail = (userEmail || '').trim().toLowerCase()

  if (!cleanCode || !cleanEmail) {
    return { success: false, error: 'Missing code or email.' }
  }

  // Only track single-use codes (e.g. AWARAA10)
  if (cleanCode !== 'AWARAA10') {
    return { success: true }
  }

  let recorded = false

  // 1. Record in Sanity
  try {
    await sanityWriteClient.create({
      _type: 'promo_redemption',
      code: cleanCode,
      email: cleanEmail,
      orderRef: orderRef || 'N/A',
      redeemedAt: new Date().toISOString(),
    })
    recorded = true
  } catch (sanityErr: any) {
    console.warn('[Promo] Sanity redemption record notice:', sanityErr?.message || sanityErr)
  }

  // 2. Record in Supabase
  try {
    const supabase = await createSupabaseServerClient()
    await supabase.from('promo_redemptions').insert({
      code: cleanCode,
      email: cleanEmail,
      order_ref: orderRef || 'N/A',
      redeemed_at: new Date().toISOString(),
    })
    recorded = true
  } catch (supabaseErr) {
    // Supabase table optional / fallback
  }

  return { success: recorded }
}
