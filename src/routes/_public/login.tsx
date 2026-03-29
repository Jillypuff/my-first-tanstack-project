import { useEffect } from "react"
import { createFileRoute, useRouterState } from "@tanstack/react-router"
import LoginForm from "@/components/auth/LoginForm"
import RegisterForm from "@/components/auth/RegisterForm"

export const Route = createFileRoute("/_public/login")({ component: SignInPage })

function SignInPage() {
  const hash = useRouterState({ select: (s) => s.location.hash })

  useEffect(() => {
    if (hash !== "create-account") return
    const el = document.getElementById("create-account")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [hash])

  return (
    <div className="auth-content-width grid min-w-0 gap-6 py-8 pb-12 md:grid-cols-2 md:py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-600">
          Sign in to continue managing your applications.
        </p>
        <LoginForm />
      </section>

      <section
        id="create-account"
        className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-2 text-2xl font-semibold text-slate-900">Create account</h2>
        <p className="mb-6 text-sm text-slate-600">
          New here? Register and start tracking your job search.
        </p>
        <RegisterForm />
      </section>
    </div>
  )
}
