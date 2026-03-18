import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth")({
  component: _Auth,
})

function _Auth() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
