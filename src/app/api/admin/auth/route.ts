/**
 * src/app/api/admin/auth/route.ts
 *
 * Admin authentication helper endpoint.
 * Returns whether the current session has admin privileges.
 *
 * Admin authorization strategy:
 * We use Supabase Auth (already in the project) with a simple email allowlist.
 * The admin email is stored in ADMIN_EMAIL env var (server-side only).
 *
 * This is the simplest secure approach given the existing auth infrastructure.
 * A more robust approach would use Supabase custom claims or RLS roles,
 * but that would require additional Supabase configuration.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ isAdmin: false, reason: 'Not authenticated' }, { status: 401 })
    }

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      // If ADMIN_EMAIL is not configured, deny all admin access
      console.warn('[Admin Auth] ADMIN_EMAIL env var not set. Denying admin access.')
      return NextResponse.json(
        { isAdmin: false, reason: 'Admin access not configured' },
        { status: 403 }
      )
    }

    const adminEmails = adminEmail.split(',').map((e) => e.trim().toLowerCase())
    const isAdmin = adminEmails.includes(user.email?.toLowerCase() ?? '')

    if (!isAdmin) {
      return NextResponse.json({ isAdmin: false, reason: 'Not authorized' }, { status: 403 })
    }

    return NextResponse.json({ isAdmin: true, email: user.email })
  } catch (err: any) {
    return NextResponse.json(
      { isAdmin: false, reason: err?.message || 'Auth check failed' },
      { status: 500 }
    )
  }
}
