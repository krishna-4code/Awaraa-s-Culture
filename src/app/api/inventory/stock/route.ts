/**
 * src/app/api/inventory/stock/route.ts
 *
 * Public API: Fetch current stock for a product.
 * Used by the website to refresh stock data on product pages.
 * Read-only — no auth required.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getStockInfo } from '@/lib/inventory/operations'

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 })
  }

  try {
    const stockInfo = await getStockInfo(productId)

    if (!stockInfo) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Cache stock responses for a SHORT time — inventory is dynamic.
    // 30 seconds is a reasonable tradeoff between freshness and API load.
    return NextResponse.json(stockInfo, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (err: any) {
    console.error('[API/inventory/stock] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch stock information' }, { status: 500 })
  }
}
