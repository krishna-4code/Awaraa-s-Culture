// Analytics Interface Contract
// Configured to track e-commerce and Instagram checkout events safely
// without logging PII (Personally Identifiable Information).

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
  // Instagram ordering specific event tracking (PII-free)
  trackCheckoutStarted(itemCount: number, total: number): void;
  trackCheckoutValidated(itemCount: number, total: number): void;
  trackInstagramOrderClicked(orderRef: string, itemCount: number, total: number): void;
  trackOrderMessageCopied(orderRef: string): void;
  trackInstagramOpened(orderRef: string): void;
  trackInstagramOrderFailed(reason: string): void;
}

class NoopAnalytics implements AnalyticsAdapter {
  trackView(pageName: string, path: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] View: ${pageName} (${path})`);
    }
  }

  trackProduct(product: ProductEventData) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] Product:`, product);
    }
  }

  trackAddToCart(product: ProductEventData, quantity: number) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] AddToCart:`, { ...product, quantity });
    }
  }

  trackCheckout(cartId: string, total: number) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] Checkout:`, { cartId, total });
    }
  }

  trackPurchase(orderId: string, total: number) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] Purchase:`, { orderId, total });
    }
  }

  trackCheckoutStarted(itemCount: number, total: number) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] checkout_started:`, { itemCount, total });
    }
  }

  trackCheckoutValidated(itemCount: number, total: number) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] checkout_validated:`, { itemCount, total });
    }
  }

  trackInstagramOrderClicked(orderRef: string, itemCount: number, total: number) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] instagram_order_clicked:`, { orderRef, itemCount, total });
    }
  }

  trackOrderMessageCopied(orderRef: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] order_message_copied:`, { orderRef });
    }
  }

  trackInstagramOpened(orderRef: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] instagram_opened:`, { orderRef });
    }
  }

  trackInstagramOrderFailed(reason: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Analytics] instagram_order_failed:`, { reason });
    }
  }
}

export const analytics = new NoopAnalytics();
