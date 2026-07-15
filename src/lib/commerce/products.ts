import { CommerceProduct } from './types';
import { commerceFetch } from './client';

const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 250) {
        edges {
          node {
            id
            title
            availableForSale
          }
        }
      }
      metafield(namespace: "custom", key: "materials") {
        value
      }
    }
  }
`;

export async function getProduct(handle: string): Promise<CommerceProduct | null> {
  try {
    const { body } = await commerceFetch<any>({
      query: getProductQuery,
      variables: { handle },
      tags: ['products', `product-${handle}`],
    });

    const product = body.data?.product;
    if (!product) return null;

    // Default metafield materials fallback if not setup in Shopify yet
    let materials: string[] = [];
    try {
      if (product.metafield?.value) {
        materials = JSON.parse(product.metafield.value);
      } else {
        materials = [
          "Full-grain leather upper",
          "High-density EVA midsole",
          "Rubber traction outsole"
        ];
      }
    } catch (e) {
       materials = [product.metafield?.value || "Premium materials"];
    }

    return {
      id: product.id,
      handle: product.handle,
      name: product.title,
      price: `₹${parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString('en-IN')}`,
      description: product.description,
      materials,
      variants: product.variants.edges.map(({ node }: any) => ({
        id: node.id,
        title: node.title,
        available: node.availableForSale,
      })),
      images: product.images.edges.map(({ node }: any) => ({
        url: node.url,
        altText: node.altText || product.title,
      })),
      shippingPolicy: "Free shipping across India on prepaid orders.",
      returnPolicy: "14-day returns for unworn products.",
      careInstructions: "Wipe clean with a damp cloth. Avoid direct heat."
    };
  } catch (e) {
    console.error(`Failed to fetch product ${handle}:`, e);
    return null;
  }
}
