import { CommerceCart, CommerceProduct } from './types';
import { commerceFetch } from './client';
import { findMockVariant, MOCK_PRODUCTS } from './mockData';

const createCartMutation = `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        id
        checkoutUrl
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const getCartQuery = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

const addToCartMutation = `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const updateCartMutation = `
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function mapShopifyCart(cart: any): CommerceCart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: cart.lines.edges.map(({ node }: any) => ({
      id: node.id,
      quantity: node.quantity,
      merchandise: {
        id: node.merchandise.id,
        title: node.merchandise.title,
        product: {
          id: node.merchandise.product.id,
          name: node.merchandise.product.title,
          handle: '',
          price: '',
          description: '',
          materials: [],
          variants: [],
          images: [],
          shippingPolicy: '',
          returnPolicy: '',
          careInstructions: ''
        }
      }
    })),
    cost: {
      subtotalAmount: cart.cost.subtotalAmount,
      totalAmount: cart.cost.totalAmount,
    }
  };
}

// -------------------------------------------------------------
// LOCAL / MOCK CART IMPLEMENTATION (Zero-config instant support)
// -------------------------------------------------------------

const STORAGE_KEY = 'awaraa_cart_storage';
// Bump this version whenever cart data format changes to auto-invalidate stale carts
const CART_VERSION = 2;
const CART_VERSION_KEY = 'awaraa_cart_version';

function parsePriceNumber(priceStr: string): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function calculateMockCartCost(lines: CommerceCart['lines']) {
  let subtotal = 0;
  for (const line of lines) {
    const unitPrice = parsePriceNumber(line.merchandise.product.price);
    subtotal += unitPrice * line.quantity;
  }
  const formatted = subtotal.toLocaleString('en-IN');
  return {
    subtotalAmount: { amount: formatted, currencyCode: 'INR' },
    totalAmount: { amount: formatted, currencyCode: 'INR' }
  };
}

function getStoredMockCart(): CommerceCart | null {
  if (typeof window === 'undefined') return null;
  try {
    // Discard any cart saved by an older version of the code
    const storedVersion = parseInt(localStorage.getItem(CART_VERSION_KEY) || '0', 10);
    if (storedVersion < CART_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(CART_VERSION_KEY, String(CART_VERSION));
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading mock cart from localStorage:', e);
    return null;
  }
}

function saveStoredMockCart(cart: CommerceCart | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!cart) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      localStorage.setItem(CART_VERSION_KEY, String(CART_VERSION));
    }
  } catch (e) {
    console.error('Error saving mock cart to localStorage:', e);
  }
}

function resolveProductAndVariant(
  variantId: string,
  productOverride?: CommerceProduct,
  variantOverride?: { id: string; title: string; available?: boolean }
): { product: CommerceProduct; variant: { id: string; title: string; available: boolean } } {
  if (productOverride) {
    const variant = variantOverride || 
      productOverride.variants.find(v => v.id === variantId || v.title === variantId) ||
      productOverride.variants[0] || 
      { id: variantId, title: "Standard", available: true };
    return {
      product: productOverride,
      variant: { id: variant.id, title: variant.title, available: variant.available ?? true }
    };
  }

  const match = findMockVariant(variantId);
  if (match) {
    return match;
  }

  const fallbackProduct = MOCK_PRODUCTS[0];
  return {
    product: fallbackProduct,
    variant: fallbackProduct.variants[0]
  };
}

function createLocalCart(
  variantId: string,
  quantity: number,
  productOverride?: CommerceProduct,
  variantOverride?: { id: string; title: string; available?: boolean }
): CommerceCart {
  const { product, variant } = resolveProductAndVariant(variantId, productOverride, variantOverride);

  const lineId = `line_${variant.id}_${Date.now()}`;
  const lines = [
    {
      id: lineId,
      quantity: Math.max(1, quantity),
      merchandise: {
        id: variant.id,
        title: variant.title,
        product
      }
    }
  ];

  const cart: CommerceCart = {
    id: `cart_mock_${Date.now()}`,
    checkoutUrl: '/cart/checkout-success',
    lines,
    cost: calculateMockCartCost(lines)
  };

  saveStoredMockCart(cart);
  return cart;
}

function addLocalItem(
  cart: CommerceCart,
  variantId: string,
  quantity: number,
  productOverride?: CommerceProduct,
  variantOverride?: { id: string; title: string; available?: boolean }
): CommerceCart {
  const { product, variant } = resolveProductAndVariant(variantId, productOverride, variantOverride);

  // Variant IDs are namespaced as "{handle}__{key}" so they are globally unique.
  // Match purely by exact variant ID — no normalization needed.
  const existingLineIndex = cart.lines.findIndex(
    (line) => line.merchandise.id === variant.id
  );

  let newLines = [...cart.lines];
  if (existingLineIndex > -1) {
    newLines[existingLineIndex] = {
      ...newLines[existingLineIndex],
      quantity: newLines[existingLineIndex].quantity + quantity
    };
  } else {
    newLines.push({
      id: `line_${variant.id}_${Date.now()}`,
      quantity: Math.max(1, quantity),
      merchandise: {
        id: variant.id,
        title: variant.title,
        product
      }
    });
  }

  const updatedCart: CommerceCart = {
    ...cart,
    lines: newLines,
    cost: calculateMockCartCost(newLines)
  };

  saveStoredMockCart(updatedCart);
  return updatedCart;
}

function updateLocalItem(cart: CommerceCart, lineId: string, quantity: number): CommerceCart {
  let newLines = cart.lines.map(line => {
    if (line.id === lineId) {
      return { ...line, quantity };
    }
    return line;
  }).filter(line => line.quantity > 0);

  const updatedCart: CommerceCart = {
    ...cart,
    lines: newLines,
    cost: calculateMockCartCost(newLines)
  };

  saveStoredMockCart(updatedCart);
  return updatedCart;
}

function isShopifyConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN &&
    process.env.NEXT_PUBLIC_COMMERCE_PROVIDER === 'shopify'
  );
}

// -------------------------------------------------------------
// PUBLIC CART API (Seamlessly routes Shopify or Local Mock)
// -------------------------------------------------------------

export async function createCart(
  variantId: string,
  quantity: number,
  productOverride?: CommerceProduct,
  variantOverride?: { id: string; title: string; available?: boolean }
): Promise<CommerceCart | null> {
  if (isShopifyConfigured()) {
    try {
      const { body } = await commerceFetch<any>({
        query: createCartMutation,
        variables: {
          lineItems: [{ merchandiseId: variantId, quantity }]
        },
        cache: 'no-store'
      });

      const cart = body.data?.cartCreate?.cart;
      if (cart) return mapShopifyCart(cart);
    } catch (e) {
      console.warn('Shopify cart creation failed, falling back to local cart:', e);
    }
  }

  return createLocalCart(variantId, quantity, productOverride, variantOverride);
}

export async function getCart(cartId: string): Promise<CommerceCart | null> {
  if (isShopifyConfigured()) {
    try {
      const { body } = await commerceFetch<any>({
        query: getCartQuery,
        variables: { cartId },
        cache: 'no-store' 
      });

      const cart = body.data?.cart;
      if (cart) return mapShopifyCart(cart);
    } catch (e) {
      console.warn('Shopify getCart failed, falling back to local cart:', e);
    }
  }

  return getStoredMockCart();
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number,
  productOverride?: CommerceProduct,
  variantOverride?: { id: string; title: string; available?: boolean }
): Promise<CommerceCart | null> {
  if (isShopifyConfigured()) {
    try {
      const { body } = await commerceFetch<any>({
        query: addToCartMutation,
        variables: {
          cartId,
          lines: [{ merchandiseId: variantId, quantity }]
        },
        cache: 'no-store'
      });

      const cart = body.data?.cartLinesAdd?.cart;
      if (cart) return mapShopifyCart(cart);
    } catch (e) {
      console.warn('Shopify addToCart failed, falling back to local cart:', e);
    }
  }

  const currentCart = getStoredMockCart() || createLocalCart(variantId, quantity, productOverride, variantOverride);
  return addLocalItem(currentCart, variantId, quantity, productOverride, variantOverride);
}

export async function updateCart(cartId: string, lineId: string, quantity: number): Promise<CommerceCart | null> {
  if (isShopifyConfigured()) {
    try {
      const { body } = await commerceFetch<any>({
        query: updateCartMutation,
        variables: {
          cartId,
          lines: [{ id: lineId, quantity }]
        },
        cache: 'no-store'
      });

      const cart = body.data?.cartLinesUpdate?.cart;
      if (cart) return mapShopifyCart(cart);
    } catch (e) {
      console.warn('Shopify updateCart failed, falling back to local cart:', e);
    }
  }

  const currentCart = getStoredMockCart();
  if (!currentCart) return null;
  return updateLocalItem(currentCart, lineId, quantity);
}

export async function removeCartItem(cartId: string, lineId: string): Promise<CommerceCart | null> {
  return updateCart(cartId, lineId, 0);
}

export async function clearCart(cartId: string): Promise<CommerceCart | null> {
  saveStoredMockCart(null);
  return null;
}
