import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import AppSidebar from "@/components/layout/AppSidebar"
import { queryClient } from "@/lib/queryClient"
import { applicationsQueryOptions } from "@/lib/application/applications"
import { getAuthSession } from "@/lib/auth/auth-session"

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const session = await getAuthSession()

    if (!session) {
      throw redirect({ to: "/login" })
    }

    await queryClient.ensureQueryData(applicationsQueryOptions)
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AppSidebar />
      <main className="min-w-0 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
