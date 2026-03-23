import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { getAuthSession } from "@/lib/auth/auth-session"

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getAuthSession()

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
