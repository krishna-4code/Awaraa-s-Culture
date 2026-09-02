/**
 * src/app/admin/layout.tsx
 *
 * Admin section layout — applies auth check and consistent wrapper.
 * The actual auth protection is done at the page level via server-side checks
 * since Next.js middleware cannot reliably call Supabase in all environments.
 */

import type { Metadata } from 'next'
import { BRAND_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Admin — ${BRAND_NAME}`,
  robots: 'noindex, nofollow',  // Never index admin pages
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {children}
    </div>
  )
}
