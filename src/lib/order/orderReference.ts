/**
 * src/lib/order/orderReference.ts
 *
 * Generates and validates unique temporary order references for Awaraa's Culture.
 * Format: AW-XXXXX (e.g., AW-8F42K)
 */

export function generateOrderRef(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let ref = '';
  for (let i = 0; i < 5; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AW-${ref}`;
}

export function isValidOrderRef(ref: string): boolean {
  return /^AW-[2-9A-HJ-NP-Z]{5}$/.test(ref);
}
