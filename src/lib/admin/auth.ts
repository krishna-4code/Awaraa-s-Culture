/**
 * src/lib/admin/auth.ts
 *
 * Server-side admin authorization utility.
 * Used by all admin API routes and server actions.
 *
 * Returns the authenticated admin user or throws an error.
 */

import { createClient } from '@/lib/supabase/server'

export class AdminAuthError extends Error {
  public readonly statusCode: number
  constructor(message: string, statusCode = 403) {
    super(message)
    this.name = 'AdminAuthError'
    this.statusCode = statusCode
  }
}

/**
 * Verifies the current request is from an authenticated admin user.
 * Throws AdminAuthError if not authorized.
 */
export async function requireAdmin(): Promise<{ email: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new AdminAuthError('Authentication required', 401)
  }

  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    throw new AdminAuthError('Admin access not configured on this server', 403)
  }

  const adminEmails = adminEmail.split(',').map((e) => e.trim().toLowerCase())
  const isAdmin = adminEmails.includes(user.email?.toLowerCase() ?? '')

  if (!isAdmin) {
    throw new AdminAuthError('You do not have admin privileges', 403)
  }

  return { email: user.email! }
}

/**
 * Returns true if the current request is from an admin user.
 * Does NOT throw — safe to use in UI to show/hide elements.
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    await requireAdmin()
    return true
  } catch {
    return false
  }
}
