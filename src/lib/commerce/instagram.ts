/**
 * src/lib/commerce/instagram.ts
 *
 * Commerce bridge for Instagram ordering utilities and configurations.
 */

export { INSTAGRAM_CONFIG, getInstagramDmUrl, getInstagramProfileUrl } from '@/lib/config/instagram';
export { generateOrderRef, isValidOrderRef } from '@/lib/order/orderReference';
export {
  generateInstagramOrderMessage,
  formatCurrencyINR,
  type InstagramOrder,
  type InstagramOrderItem,
  type InstagramCustomerDetails,
} from '@/lib/order/generateInstagramOrderMessage';
