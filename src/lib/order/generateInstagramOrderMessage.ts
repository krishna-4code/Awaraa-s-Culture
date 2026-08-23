/**
 * src/lib/order/generateInstagramOrderMessage.ts
 *
 * Formats a validated, immutable order snapshot into a clean, readable,
 * and copy/paste friendly Instagram DM message.
 */

export interface InstagramOrderItem {
  productName: string;
  size: string;
  color?: string;
  quantity: number;
  unitPrice: number;
}

export interface InstagramCustomerDetails {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface InstagramOrder {
  orderRef: string;
  items: InstagramOrderItem[];
  subtotal: number;
  discount?: number;
  promoCode?: string;
  delivery?: string | number;
  total: number;
  customer: InstagramCustomerDetails;
}

/**
 * Format a number into standard Indian Rupee representation (e.g., ₹1,199)
 */
export function formatCurrencyINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * Generates a short, clean, copy/paste friendly Instagram DM order request message.
 *
 * Example output:
 *
 * AWARAA'S CULTURE — ORDER REQUEST
 * Order Ref: AW-8F42K
 *
 * ITEMS
 * • NB Sports — Size 9 (White) — Qty 1 — ₹1,199
 * • LV Sneakers — Size 8 (White/Black) — Qty 1 — ₹1,099
 *
 * Subtotal: ₹2,298
 * Total: ₹2,298
 *
 * CUSTOMER
 * Name: Krishna
 * Phone: +91 98765 43210
 * Address: 123 Hauz Khas Village, New Delhi - 110016
 *
 * Please confirm availability and order details.
 */
export function generateInstagramOrderMessage(order: InstagramOrder): string {
  const lines: string[] = [];

  lines.push("AWARAA'S CULTURE — ORDER REQUEST");
  lines.push(`Order Ref: ${order.orderRef}`);
  lines.push('');
  lines.push('ITEMS');

  order.items.forEach((item) => {
    const colorStr = item.color && item.color.trim() !== '' ? ` (${item.color})` : '';
    lines.push(
      `• ${item.productName} — Size ${item.size}${colorStr} — Qty ${item.quantity} — ${formatCurrencyINR(item.unitPrice)}`
    );
  });

  lines.push('');
  lines.push(`Subtotal: ${formatCurrencyINR(order.subtotal)}`);

  if (order.discount && order.discount > 0) {
    const promoLabel = order.promoCode ? ` (${order.promoCode})` : '';
    lines.push(`Discount${promoLabel}: -${formatCurrencyINR(order.discount)}`);
  }

  lines.push(`Total: ${formatCurrencyINR(order.total)}`);
  lines.push('');
  lines.push('CUSTOMER');
  lines.push(`Name: ${order.customer.name}`);
  lines.push(`Phone: ${order.customer.phone}`);
  lines.push(`Address: ${order.customer.address}`);

  if (order.customer.notes && order.customer.notes.trim() !== '') {
    lines.push(`Notes: ${order.customer.notes.trim()}`);
  }

  lines.push('');
  lines.push('Please confirm availability and order details.');

  return lines.join('\n');
}
