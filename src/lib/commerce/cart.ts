import { CommerceCart } from './types';
import { commerceFetch } from './client';

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
          // Fallbacks for type satisfaction since we don't fetch full product here
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

export async function createCart(variantId: string, quantity: number): Promise<CommerceCart | null> {
  try {
    const { body } = await commerceFetch<any>({
      query: createCartMutation,
      variables: {
        lineItems: [{ merchandiseId: variantId, quantity }]
      },
      cache: 'no-store'
    });

    const cart = body.data?.cartCreate?.cart;
    if (!cart) return null;
    return mapShopifyCart(cart);
  } catch (e) {
    console.error('Error creating cart:', e);
    return null;
  }
}

export async function getCart(cartId: string): Promise<CommerceCart | null> {
  try {
    const { body } = await commerceFetch<any>({
      query: getCartQuery,
      variables: { cartId },
      cache: 'no-store' 
    });

    const cart = body.data?.cart;
    if (!cart) return null;
    return mapShopifyCart(cart);
  } catch (e) {
    console.error('Error fetching cart:', e);
    return null;
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number): Promise<CommerceCart | null> {
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
    if (!cart) return null;
    return mapShopifyCart(cart);
  } catch (e) {
    console.error('Error adding to cart:', e);
    return null;
  }
}

export async function updateCart(cartId: string, lineId: string, quantity: number): Promise<CommerceCart | null> {
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
    if (!cart) return null;
    return mapShopifyCart(cart);
  } catch (e) {
    console.error('Error updating cart:', e);
    return null;
  }
}
