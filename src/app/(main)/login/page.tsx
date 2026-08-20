import { AuthForm } from './AuthForm'

export const metadata = {
  title: "Account & Sign In | Awaraa's Culture",
  description: "Sign in or create an account to access your curated streetwear orders and exclusive drops.",
}

export default function LoginPage() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <AuthForm />
    </main>
  )
}
