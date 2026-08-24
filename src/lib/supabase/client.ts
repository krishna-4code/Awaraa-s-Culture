import { createBrowserClient } from '@supabase/ssr'

function createDummyBrowserClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
      signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
      signInWithOAuth: async () => ({ data: { url: null, provider: 'google' }, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  } as any
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes('your-project-ref') ||
    supabaseKey.includes('placeholder')
  ) {
    return createDummyBrowserClient()
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseKey)
  } catch (err) {
    console.warn('[Supabase Client] Falling back to dummy client:', err)
    return createDummyBrowserClient()
  }
}
