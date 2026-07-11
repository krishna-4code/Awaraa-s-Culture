// Analytics Interface Contract
// Tomorrow, this will adapt to GA4, Mixpanel, or PostHog.

export interface ProductEventData {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export interface AnalyticsAdapter {
  trackView(pageName: string, path: string): void;
  trackProduct(product: ProductEventData): void;
  trackAddToCart(product: ProductEventData, quantity: number): void;
  trackCheckout(cartId: string, total: number): void;
  trackPurchase(orderId: string, total: number): void;
}

class NoopAnalytics implements AnalyticsAdapter {
  trackView(pageName: string, path: string) {
    if (process.env.NODE_ENV === 'development') console.debug(`[Analytics] View: ${pageName} (${path})`);
  }
  trackProduct(product: ProductEventData) {
    if (process.env.NODE_ENV === 'development') console.debug(`[Analytics] Product:`, product);
  }
  trackAddToCart(product: ProductEventData, quantity: number) {
    if (process.env.NODE_ENV === 'development') console.debug(`[Analytics] AddToCart:`, { ...product, quantity });
  }
  trackCheckout(cartId: string, total: number) {
    if (process.env.NODE_ENV === 'development') console.debug(`[Analytics] Checkout:`, { cartId, total });
  }
  trackPurchase(orderId: string, total: number) {
    if (process.env.NODE_ENV === 'development') console.debug(`[Analytics] Purchase:`, { orderId, total });
  }
}

export const analytics = new NoopAnalytics();
