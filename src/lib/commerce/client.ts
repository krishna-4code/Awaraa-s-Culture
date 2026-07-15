import { env } from '../env';

export async function commerceFetch<T>({
  query,
  variables,
  tags,
  cache = 'force-cache',
}: {
  query: string;
  variables?: any;
  tags?: string[];
  cache?: RequestCache;
}): Promise<{ status: number; body: T } | never> {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const provider = env.NEXT_PUBLIC_COMMERCE_PROVIDER;

  if (!domain || !token) {
    if (provider === 'shopify') {
      console.warn(
        '⚠️ Shopify credentials are not set. Please add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local'
      );
    }
    // Return a dummy empty response to trigger the mock fallbacks gracefully
    return { status: 400, body: {} as T };
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error('Error fetching from Shopify Storefront API:', error);
    throw error;
  }
}
