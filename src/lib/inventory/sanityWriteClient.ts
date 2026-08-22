/**
 * src/lib/inventory/sanityWriteClient.ts
 *
 * Server-side-only Sanity client with write capabilities.
 *
 * IMPORTANT: This module must ONLY be imported from server-side code:
 *   - Next.js Server Actions ('use server')
 *   - API Route handlers (route.ts)
 *   - Server Components
 *
 * NEVER import this in:
 *   - 'use client' components
 *   - Files that are part of the client bundle
 *
 * The SANITY_WRITE_TOKEN env var is server-side only (no NEXT_PUBLIC_ prefix).
 */

import { createClient } from '@sanity/client'

function createWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    throw new Error(
      '[Inventory] SANITY_WRITE_TOKEN is not configured. ' +
      'Cannot perform inventory mutations. ' +
      'Add SANITY_WRITE_TOKEN to .env.local'
    )
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  if (!projectId) {
    throw new Error('[Inventory] NEXT_PUBLIC_SANITY_PROJECT_ID is not configured.')
  }

  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-02-09',
    token,
    // useCdn: false is REQUIRED for:
    // 1. Mutations (writes)
    // 2. Consistent reads immediately after writes
    // Never enable CDN for inventory operations.
    useCdn: false,
  })
}

// Singleton instance — created once at module load time.
// Will throw at startup if SANITY_WRITE_TOKEN is missing.
export const sanityWriteClient = createWriteClient()
