import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { supabase } from "@/lib/supabase"

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      throw redirect({ to: "/" })
    }
  },
  component: _Auth,
})

function _Auth() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
