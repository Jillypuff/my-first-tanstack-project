import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-bold text-slate-900">Profile</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">
          Profile settings placeholder. Add account preferences and notification
          settings here.
        </p>
      </div>
    </section>
  )
}
