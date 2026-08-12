import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-20 mx-auto">
      <div className="cpg-card cpg-card-diecut flex flex-col gap-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-bright-muted text-sm">Sign in or create an account</p>
        </div>

        <form className="flex-1 flex flex-col w-full justify-center gap-4 text-bright-ink">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="px-4 py-3 bg-white border border-bright-ink/15 rounded-xl focus:outline-none focus:border-bright-amber focus:ring-1 focus:ring-bright-amber transition-colors"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="px-4 py-3 bg-white border border-bright-ink/15 rounded-xl focus:outline-none focus:border-bright-amber focus:ring-1 focus:ring-bright-amber transition-colors"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button formAction={login} className="cpg-button-primary w-full">
              Sign In
            </button>
            <button formAction={signup} className="cpg-button-secondary w-full">
              Sign Up
            </button>
          </div>
          
          {message && (
            <p
              role="alert"
              className={`mt-4 p-4 text-center text-sm rounded-xl border ${
                message.toLowerCase().includes('check email') || message.toLowerCase().includes('success')
                  ? 'bg-bright-canvas text-bright-ink border-bright-lime/40'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
