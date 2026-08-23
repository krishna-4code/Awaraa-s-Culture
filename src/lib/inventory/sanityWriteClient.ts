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

import { createClient, type SanityClient } from '@sanity/client'

function createWriteClient(): SanityClient {
  const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ns5j1nmq'

  if (!token) {
    console.warn(
      '[Inventory] SANITY_WRITE_TOKEN is not configured. Live Sanity mutations will run in fallback mode.'
    )
  }

  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-02-09',
    token: token || 'placeholder_token',
    useCdn: false,
  })
}

// Singleton instance — safe for server-side execution
export const sanityWriteClient = createWriteClient()
