import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/register")({
  beforeLoad: () => {
    throw redirect({ to: "/login", hash: "create-account" })
  },
})
