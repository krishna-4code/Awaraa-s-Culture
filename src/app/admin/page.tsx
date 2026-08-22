/**
 * src/app/admin/page.tsx
 *
 * Admin dashboard — server component.
 * Checks admin auth before rendering. Redirects to login if unauthorized.
 *
 * To access admin:
 *   1. Log in with an account whose email is in ADMIN_EMAIL env var
 *   2. Navigate to /admin
 */

import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/admin/auth'
import { getAllProductsWithStock, getInventoryLogs } from '@/lib/inventory/operations'
import { getOrders } from '@/lib/inventory/orders'
import { AdminDashboard } from './AdminDashboard'

export const dynamic = 'force-dynamic' // Always render fresh — inventory is live data

export default async function AdminPage() {
  // Server-side auth check
  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    redirect('/login?redirectTo=/admin&reason=admin_required')
  }

  // Fetch dashboard data in parallel
  const [productsWithStock, recentLogs, recentOrders] = await Promise.all([
    getAllProductsWithStock(),
    getInventoryLogs(30),
    getOrders({ limit: 20 }),
  ])

  return (
    <AdminDashboard
      productsWithStock={productsWithStock}
      recentLogs={recentLogs}
      recentOrders={recentOrders}
    />
  )
}
