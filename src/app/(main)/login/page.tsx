import { Suspense } from 'react'
import { AuthForm } from './AuthForm'
import { BRAND_NAME } from '@/lib/constants'

export const metadata = {
  title: `Account & Sign In | ${BRAND_NAME}`,
  description: "Sign in or create an account to access your curated streetwear orders and exclusive drops.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <Suspense fallback={
        <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-bright-surface border border-bright-ink/10 flex items-center justify-center min-h-[400px]">
          <div className="w-6 h-6 border-2 border-bright-amber border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <AuthForm />
      </Suspense>
    </main>
  )
}

