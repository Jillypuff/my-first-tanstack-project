import { useEffect, useMemo, useRef, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import ApplicationForm from "@/components/application/ApplicationForm"
import ApplicationCard from "@/components/application/ApplicationCard"
import { type ApplicationStatus } from "@/schemas/application"
import { applicationsQueryOptions } from "@/lib/queries/applications"
import { supabase } from "@/lib/supabase"

export const Route = createFileRoute("/_app/applications")({
  component: ApplicationsPage,
})

const statusOptions: ApplicationStatus[] = [
  "applied",
  "responded",
  "interview",
  "rejected",
  "ghosted",
]

const statusLabel: Record<ApplicationStatus, string> = {
  applied: "Applied",
  responded: "Responded",
  interview: "Interview",
  rejected: "Rejected",
  ghosted: "Ghosted",
}

function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus[]>([])
  const [monthFilter, setMonthFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [editingApplicationId, setEditingApplicationId] = useState<string | null>(null)
  const [expandedApplicationIds, setExpandedApplicationIds] = useState<Set<string>>(
    () => new Set(),
  )
  const editFormSectionRef = useRef<HTMLElement | null>(null)
  const scrollYBeforeEditRef = useRef<number | null>(null)
  const { data: applications = [], isLoading, error, refetch } = useQuery(
    applicationsQueryOptions,
  )

  const monthOptions = useMemo(() => {
    const uniqueMonths = new Set<string>()
    for (const application of applications) {
      const date = new Date(application.date_applied)
      uniqueMonths.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`)
    }
    return ["all", ...Array.from(uniqueMonths).sort((a, b) => b.localeCompare(a))]
  }, [applications])

  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    for (const application of applications) {
      for (const tag of application.details.tags) tags.add(tag)
    }
    return Array.from(tags).sort()
  }, [applications])

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        `${application.company_name} ${application.job_title}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(application.status)

      const matchesMonth =
        monthFilter === "all" ||
        (() => {
          const date = new Date(application.date_applied)
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          return key === monthFilter
        })()

      const matchesTags =
        tagFilter.length === 0 ||
        tagFilter.every((tag) => application.details.tags.includes(tag))

      return matchesSearch && matchesStatus && matchesMonth && matchesTags
    })
  }, [applications, searchTerm, statusFilter, monthFilter, tagFilter])

  const editingApplication = useMemo(
    () => applications.find((application) => application.id === editingApplicationId) ?? null,
    [applications, editingApplicationId],
  )

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter([])
    setMonthFilter("all")
    setTagFilter([])
  }

  const formatMonth = (monthKey: string) => {
    if (monthKey === "all") return "All months"
    const [year, month] = monthKey.split("-").map(Number)
    return new Date(year, month - 1, 1).toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    })
  }

  const toggleApplicationExpanded = (applicationId: string) => {
    setExpandedApplicationIds((previous) => {
      const next = new Set(previous)
      if (next.has(applicationId)) next.delete(applicationId)
      else next.add(applicationId)
      return next
    })
  }

  const onDelete = async (applicationId: string) => {
    const shouldDelete = window.confirm("Delete this application?")
    if (!shouldDelete) return

    const { error } = await supabase.from("applications").delete().eq("id", applicationId)
    if (error) {
      return
    }
    await refetch()
  }

  useEffect(() => {
    if (!editingApplicationId) return
    if (!editFormSectionRef.current) return

    // Scroll the newly opened edit form into view.
    editFormSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [editingApplicationId])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Applications</h1>
          <p className="mt-1 text-slate-500">
            {filteredApplications.length} of {applications.length} applications
          </p>
        </div>
        <Link
          to="/add"
          className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500"
        >
          Add Application
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search company or job title..."
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />

          <select
            value={statusFilter.join(",")}
            onChange={(event) => {
              const value = event.target.value
              setStatusFilter(value ? (value.split(",") as ApplicationStatus[]) : [])
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>

          <select
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))}
          </select>

          <select
            value={tagFilter[0] ?? ""}
            onChange={(event) => {
              const nextTag = event.target.value
              setTagFilter(nextTag ? [nextTag] : [])
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || statusFilter.length || monthFilter !== "all" || tagFilter.length) && (
          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-rose-600 hover:text-rose-500"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Loading applications...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          {error instanceof Error ? error.message : "Failed to load applications."}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-800">No applications match your filters</p>
          <p className="mt-1 text-slate-500">Try adjusting search or filter values.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              expanded={expandedApplicationIds.has(application.id)}
              onToggleExpand={() => toggleApplicationExpanded(application.id)}
              statusLabel={statusLabel}
              onEdit={() => {
                scrollYBeforeEditRef.current =
                  typeof window !== "undefined" ? window.scrollY : null
                setEditingApplicationId(application.id)
              }}
              onDelete={() => onDelete(application.id)}
            />
          ))}
        </div>
      )}

      {editingApplication && (
        <section
          ref={editFormSectionRef}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-slate-900">Edit Application</h2>
          <p className="mb-4 text-sm text-slate-500">
            Update details for {editingApplication.company_name}.
          </p>

          <ApplicationForm
            mode="edit"
            submitLabel="Save Changes"
            initialValues={{
              company_name: editingApplication.company_name,
              job_title: editingApplication.job_title,
              date_applied: editingApplication.date_applied,
              status: editingApplication.status,
              details: {
                contacts: editingApplication.details.contacts[0] ?? {
                  name: "",
                  email: "",
                  phone: "",
                  note: "",
                },
                tags: editingApplication.details.tags,
                job_criterias: editingApplication.details.job_criterias,
                company: editingApplication.details.company,
              },
            }}
            onCancel={() => setEditingApplicationId(null)}
            onSubmitApplication={async (value) => {
              const scrollYBeforeEdit = scrollYBeforeEditRef.current
              const now = new Date().toISOString()
              const { error } = await supabase
                .from("applications")
                .update({
                  company_name: value.company_name,
                  job_title: value.job_title,
                  date_applied: value.date_applied,
                  status: value.status,
                  details: value.details,
                  updated_at: now,
                  last_activity_at: now,
                })
                .eq("id", editingApplication.id)

              if (error) throw error
              setEditingApplicationId(null)
              await refetch()

              if (typeof window !== "undefined" && typeof scrollYBeforeEdit === "number") {
                window.scrollTo({ top: scrollYBeforeEdit, behavior: "smooth" })
              }
            }}
          />
        </section>
      )}
    </section>
  )
}
