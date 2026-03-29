import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { PublicSiteFooter } from "@/components/layout/PublicSiteFooter"
import { PublicSiteHeader } from "@/components/layout/PublicSiteHeader"
import { getAuthSession } from "@/lib/auth/auth-session"

export const Route = createFileRoute("/_public")({
  beforeLoad: async () => {
    const session = await getAuthSession()
    if (session) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <PublicSiteHeader />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
      <PublicSiteFooter />
    </div>
  )
}
