import { useEffect, useMemo, useRef, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import ApplicationForm from "@/components/application/ApplicationForm"
import ApplicationCard from "@/components/application/ApplicationCard"
import Card from "@/components/ui/Card"
import ErrorPanel from "@/components/ui/feedback/ErrorPanel"
import LoadingPanel from "@/components/ui/feedback/LoadingPanel"
import NativeSelect from "@/components/ui/NativeSelect"
import {
  APPLICATION_STATUS_ORDER,
  applicationStatusLabels,
} from "@/lib/application/application-status"
import { type ApplicationStatus } from "@/schemas/application"
import {
  ApplicationCollection,
  useApplicationsLive,
} from "@/lib/db"

export const Route = createFileRoute("/_app/applications")({
  component: ApplicationsPage,
})

const PAGE_SIZE = 20

function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus[]>([])
  const [monthFilter, setMonthFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [editingApplicationId, setEditingApplicationId] = useState<string | null>(null)
  const [expandedApplicationIds, setExpandedApplicationIds] = useState<Set<string>>(
    () => new Set(),
  )
  const editFormSectionRef = useRef<HTMLElement | null>(null)
  const scrollYBeforeEditRef = useRef<number | null>(null)
  const { data: applications = [], isLoading, isError } = useApplicationsLive()
  const error = ApplicationCollection.utils.lastError

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

  const totalFiltered = filteredApplications.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))

  const paginatedApplications = useMemo(
    () => filteredApplications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredApplications, page],
  )

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter, monthFilter, tagFilter])

  useEffect(() => {
    setPage((previous) => Math.min(previous, totalPages))
  }, [totalPages])

  useEffect(() => {
    const idsOnPage = new Set(paginatedApplications.map((application) => application.id))
    setExpandedApplicationIds((previous) => {
      const next = new Set<string>()
      for (const id of previous) {
        if (idsOnPage.has(id)) next.add(id)
      }
      return next
    })
  }, [paginatedApplications])

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

    try {
      const tx = ApplicationCollection.delete(applicationId)
      await tx.isPersisted.promise
    } catch {
      return
    }
  }

  const scrollToPositionBeforeEdit = (savedY: number | null) => {
    if (typeof window !== "undefined" && typeof savedY === "number") {
      window.scrollTo({ top: savedY, behavior: "smooth" })
    }
  }

  useEffect(() => {
    if (!editingApplicationId) return
    if (!editFormSectionRef.current) return

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

      <Card className="p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search company or job title..."
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />

          <NativeSelect
            value={statusFilter.join(",")}
            onChange={(event) => {
              const value = event.target.value
              setStatusFilter(value ? (value.split(",") as ApplicationStatus[]) : [])
            }}
          >
            <option value="">All status</option>
            {APPLICATION_STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {applicationStatusLabels[status]}
              </option>
            ))}
          </NativeSelect>

          <NativeSelect value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)}>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))}
          </NativeSelect>

          <NativeSelect
            value={tagFilter[0] ?? ""}
            onChange={(event) => {
              const nextTag = event.target.value
              setTagFilter(nextTag ? [nextTag] : [])
            }}
          >
            <option value="">All tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </NativeSelect>
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
      </Card>

      {isLoading ? (
        <LoadingPanel>Loading applications...</LoadingPanel>
      ) : isError ? (
        <ErrorPanel>
          {error instanceof Error ? error.message : "Failed to load applications."}
        </ErrorPanel>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-lg font-semibold text-slate-800">No applications match your filters</p>
          <p className="mt-1 text-slate-500">Try adjusting search or filter values.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear filters
          </button>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-stretch gap-2 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-0">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5">
                <div className="h-5 w-5 shrink-0" />
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:items-center lg:gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Job title
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tags
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 border-l border-slate-200 bg-slate-50/50 px-3 py-2.5">
                <span className="min-w-[3.25rem] text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Refine
                </span>
                <span className="min-w-[3.25rem] text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Retire
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
            {paginatedApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                expanded={expandedApplicationIds.has(application.id)}
                onToggleExpand={() => toggleApplicationExpanded(application.id)}
                onEdit={() => {
                  scrollYBeforeEditRef.current =
                    typeof window !== "undefined" ? window.scrollY : null
                  setEditingApplicationId(application.id)
                }}
                onDelete={() => onDelete(application.id)}
              />
            ))}
            </div>
          </div>

          {totalPages > 1 && (
            <Card className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalFiltered)} of{" "}
                {totalFiltered}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </Card>
          )}
        </div>
      )}

      {editingApplication && (
        <section ref={editFormSectionRef}>
          <Card className="p-6">
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
                  notes: editingApplication.details.notes ?? "",
                  contacts: (() => {
                    const rows = editingApplication.details.contacts.slice(0, 3).map((c) => ({
                      name: c.name ?? "",
                      email: c.email ?? "",
                      phone: c.phone ?? "",
                      note: c.note ?? "",
                    }))
                    return rows.length > 0
                      ? rows
                      : [{ name: "", email: "", phone: "", note: "" }]
                  })(),
                  tags: editingApplication.details.tags,
                  job_criterias: editingApplication.details.job_criterias,
                  company: editingApplication.details.company,
                },
              }}
              onCancel={() => {
                const scrollYBeforeEdit = scrollYBeforeEditRef.current
                setEditingApplicationId(null)
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    scrollToPositionBeforeEdit(scrollYBeforeEdit)
                  })
                })
              }}
              onSubmitApplication={async (value) => {
                const scrollYBeforeEdit = scrollYBeforeEditRef.current
                const now = new Date().toISOString()
                const tx = ApplicationCollection.update(editingApplication.id, (draft) => {
                  draft.company_name = value.company_name
                  draft.job_title = value.job_title
                  draft.date_applied = value.date_applied
                  draft.status = value.status
                  draft.details = value.details
                  draft.updated_at = now
                  draft.last_activity_at = now
                })
                await tx.isPersisted.promise
                setEditingApplicationId(null)

                scrollToPositionBeforeEdit(scrollYBeforeEdit)
              }}
            />
          </Card>
        </section>
      )}
    </section>
  )
}
