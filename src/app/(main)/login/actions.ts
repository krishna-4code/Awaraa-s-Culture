'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type AuthResponse = {
  error?: string
  success?: string
  redirectTo?: string
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: 'Successfully signed in!', redirectTo: '/' }
}

export async function signupAction(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const fullName = formData.get('fullName') as string

  if (!email || !password) {
    return { error: 'Please fill in all required fields.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || undefined,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Supabase silently returns a fake response (user with no identities) when the
  // email is already registered, instead of throwing an error (for security).
  if (authData.user && authData.user.identities?.length === 0) {
    return { error: 'An account with this email already exists. Please sign in instead.' }
  }

  revalidatePath('/', 'layout')

  if (authData.session) {
    return { success: 'Account created successfully! Welcome aboard.', redirectTo: '/' }
  } else {
    return {
      success: 'Confirmation link sent! Please check your email to verify your account before signing in.',
    }
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}
