'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { loginAction, signupAction, type AuthResponse } from './actions'

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, setIsGooglePending] = useState(false)

  // Capture OAuth error if redirected back with error query param
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    setError(null)
    setSuccess(null)
    setIsGooglePending(true)

    try {
      const supabase = createClient()
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })

      if (oauthError) {
        setError(oauthError.message)
        setIsGooglePending(false)
      } else if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to initiate Google sign in.')
      setIsGooglePending(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      let res: AuthResponse
      if (mode === 'signin') {
        res = await loginAction(formData)
      } else {
        res = await signupAction(formData)
      }

      if (res.error) {
        setError(res.error)
      } else if (res.success) {
        setSuccess(res.success)
        if (res.redirectTo) {
          router.push(res.redirectTo)
          router.refresh()
        }
      }
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Container card */}
      <div className="bg-bright-surface border border-bright-ink/10 rounded-3xl p-8 shadow-xl relative overflow-hidden backdrop-blur-sm">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-bright-amber/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-bright-lime/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tab switch */}
        <div className="flex bg-bright-canvas p-1 rounded-2xl border border-bright-ink/10 mb-8 relative">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError(null)
              setSuccess(null)
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
              mode === 'signin'
                ? 'bg-bright-ink text-bright-canvas shadow-sm'
                : 'text-bright-muted hover:text-bright-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError(null)
              setSuccess(null)
            }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
              mode === 'signup'
                ? 'bg-bright-ink text-bright-canvas shadow-sm'
                : 'text-bright-muted hover:text-bright-ink'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-black tracking-tight text-bright-ink">
            {mode === 'signin' ? 'Welcome Back' : 'Join Awaraa’s Culture'}
          </h1>
          <p className="text-bright-muted text-xs mt-1">
            {mode === 'signin'
              ? 'Access your orders, saved items, and exclusive drops.'
              : 'Create your account to start curating authentic streetwear.'}
          </p>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-6 p-4 text-xs font-medium rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 flex items-start gap-2.5 animate-fadeIn">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 text-xs font-medium rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 flex items-start gap-2.5 animate-fadeIn">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{success}</p>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isPending || isGooglePending}
          className="w-full py-3.5 px-6 rounded-xl font-sans font-bold text-xs uppercase tracking-wider bg-white hover:bg-bright-canvas border border-bright-ink/15 text-bright-ink transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
        >
          {isGooglePending ? (
            <>
              <svg className="animate-spin h-4 w-4 text-bright-ink" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-bright-ink/10" />
          </div>
          <div className="relative inline-block px-3 bg-bright-surface text-[11px] font-bold uppercase tracking-wider text-bright-muted">
            or with email
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bright-ink mb-1.5" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Alex Rivera"
                className="w-full px-4 py-3 bg-white/70 border border-bright-ink/15 rounded-xl text-sm text-bright-ink placeholder-bright-muted/60 focus:outline-none focus:border-bright-amber focus:ring-2 focus:ring-bright-amber/20 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-bright-ink mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="alex@example.com"
              className="w-full px-4 py-3 bg-white/70 border border-bright-ink/15 rounded-xl text-sm text-bright-ink placeholder-bright-muted/60 focus:outline-none focus:border-bright-amber focus:ring-2 focus:ring-bright-amber/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-bright-ink mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/70 border border-bright-ink/15 rounded-xl text-sm text-bright-ink placeholder-bright-muted/60 focus:outline-none focus:border-bright-amber focus:ring-2 focus:ring-bright-amber/20 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-bright-muted hover:text-bright-ink transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bright-ink mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/70 border border-bright-ink/15 rounded-xl text-sm text-bright-ink placeholder-bright-muted/60 focus:outline-none focus:border-bright-amber focus:ring-2 focus:ring-bright-amber/20 transition-all"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3.5 px-6 rounded-xl font-sans font-bold text-xs uppercase tracking-widest bg-bright-amber text-white hover:bg-bright-amber/90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : mode === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-bright-ink/10 text-center">
          <p className="text-xs text-bright-muted">
            {mode === 'signin' ? "Don't have an account yet? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError(null)
                setSuccess(null)
              }}
              className="text-bright-ink font-bold hover:text-bright-amber transition-colors underline underline-offset-4"
            >
              {mode === 'signin' ? 'Sign up now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
