import { createFileRoute } from "@tanstack/react-router"
import LoginForm from "@/components/auth/LoginForm"
import RegisterForm from "@/components/auth/RegisterForm"

export const Route = createFileRoute("/_auth/login")({ component: Login })

function Login() {
  return (
    <div className="mx-auto grid min-h-screen max-w-5xl gap-6 px-4 py-10 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-600">
          Sign in to continue managing your applications.
        </p>
        <LoginForm />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-2xl font-semibold text-slate-900">Create account</h2>
        <p className="mb-6 text-sm text-slate-600">
          New here? Register and start tracking your job search.
        </p>
        <RegisterForm />
      </section>
    </div>
  )
}
