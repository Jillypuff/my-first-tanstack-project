import { createFileRoute } from "@tanstack/react-router"
import ApplicationForm from "#/components/application/ApplicationForm"

export const Route = createFileRoute("/_app/add")({
  component: ApplicationPage,
})

function ApplicationPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Add Application</h1>
        <p className="mt-1 text-slate-500">
          Track a new job application. Start with the basics and add more details
          whenever you need.
        </p>
      </div>
      <ApplicationForm />
    </section>
  )
}
