import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import AppSidebar from "@/components/layout/AppSidebar"
import { queryClient } from "@/lib/queryClient"
import { applicationsQueryOptions } from "@/lib/queries/applications"
import { supabase } from "@/lib/supabase"

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

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
