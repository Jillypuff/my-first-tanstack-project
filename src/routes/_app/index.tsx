import { useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { applicationsQueryOptions } from "@/lib/queries/applications"
import { currentMonthKey, getDashboardTimeDefault } from "@/lib/preferences"

export const Route = createFileRoute("/_app/")({
  component: DashboardPage,
})

const statusOrder = ["applied", "responded", "interview", "rejected", "ghosted"] as const

const statusMeta: Record<
  (typeof statusOrder)[number],
  { label: string; color: string; badge: string }
> = {
  applied: {
    label: "Applied",
    color: "#3b82f6",
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  responded: {
    label: "Responded",
    color: "#10b981",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  interview: {
    label: "Interview",
    color: "#8b5cf6",
    badge: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444",
    badge: "bg-red-50 text-red-700 ring-red-200",
  },
  ghosted: {
    label: "Ghosted",
    color: "#94a3b8",
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
  },
}

function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(() =>
    getDashboardTimeDefault() === "all" ? "all" : currentMonthKey(),
  )
  const { data: applications = [], isLoading, error } = useQuery(applicationsQueryOptions)

  const monthOptions = useMemo(() => {
    const uniqueMonths = new Set<string>()
    uniqueMonths.add(currentMonthKey())

    for (const application of applications) {
      const date = new Date(application.date_applied)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      uniqueMonths.add(monthKey)
    }

    return ["all", ...Array.from(uniqueMonths).sort((a, b) => b.localeCompare(a))]
  }, [applications])

  const filteredApplications = useMemo(() => {
    if (selectedMonth === "all") return applications

    return applications.filter((application) => {
      const date = new Date(application.date_applied)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      return monthKey === selectedMonth
    })
  }, [applications, selectedMonth])

  const stats = useMemo(() => {
    const summary = {
      total: filteredApplications.length,
      applied: 0,
      responded: 0,
      interview: 0,
      rejected: 0,
      ghosted: 0,
    }

    for (const application of filteredApplications) {
      summary[application.status] += 1
    }

    return summary
  }, [filteredApplications])

  const monthlySeries = useMemo(() => {
    const buckets = new Map<string, number>()

    for (const application of applications) {
      const date = new Date(application.date_applied)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      buckets.set(monthKey, (buckets.get(monthKey) ?? 0) + 1)
    }

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, value]) => ({ monthKey, value }))
  }, [applications])

  const maxMonthlyValue = useMemo(
    () => monthlySeries.reduce((max, item) => Math.max(max, item.value), 0),
    [monthlySeries],
  )

  const statusSeries = useMemo(
    () =>
      statusOrder.map((status) => ({
        status,
        label: statusMeta[status].label,
        value: stats[status],
        color: statusMeta[status].color,
      })),
    [stats],
  )

  const donutBackground = useMemo(() => {
    const total = statusSeries.reduce((sum, item) => sum + item.value, 0)
    if (total === 0) {
      return "conic-gradient(#e2e8f0 0deg 360deg)"
    }

    let current = 0
    const segments = statusSeries.map((item) => {
      const start = current
      const span = (item.value / total) * 360
      current += span
      return `${item.color} ${start}deg ${current}deg`
    })

    return `conic-gradient(${segments.join(", ")})`
  }, [statusSeries])

  const recentApplications = useMemo(
    () => [...filteredApplications].sort((a, b) => b.date_applied.localeCompare(a.date_applied)),
    [filteredApplications],
  )

  const formatMonth = (monthKey: string) => {
    if (monthKey === "all") return "All time"
    const [year, month] = monthKey.split("-").map(Number)
    return new Date(year, month - 1, 1).toLocaleString(undefined, {
      month: "short",
      year: "numeric",
    })
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
        <div className="min-w-48">
          <label
            htmlFor="month-filter"
            className="mb-2 block text-sm font-medium text-slate-600"
          >
            Time range
          </label>
          <select
            id="month-filter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Loading applications...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          {error instanceof Error ? error.message : "Failed to load applications."}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Applications", stats.total],
              ["Applied", stats.applied],
              ["Responded", stats.responded],
              ["Interviews", stats.interview],
              ["Rejected", stats.rejected],
              ["Ghosted", stats.ghosted],
            ].map(([label, value]) => (
              <article
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">{String(value)}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-2xl font-semibold text-slate-900">Applications per Month</h2>
              <p className="mb-4 text-sm text-slate-500">Total applications sent each month</p>

              {monthlySeries.length === 0 ? (
                <p className="text-slate-500">No data yet.</p>
              ) : (
                <div className="flex h-56 items-end gap-6 overflow-x-auto pt-3">
                  {monthlySeries.map((item) => {
                    const ratio = maxMonthlyValue > 0 ? item.value / maxMonthlyValue : 0
                    const height = Math.max(20, Math.round(ratio * 180))

                    return (
                      <div key={item.monthKey} className="flex min-w-16 flex-col items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">{item.value}</span>
                        <div
                          className="w-9 rounded-t-md bg-indigo-400/85"
                          style={{ height: `${height}px` }}
                        />
                        <span className="text-xs text-slate-500">{formatMonth(item.monthKey)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Status Breakdown</h2>
              <p className="mb-4 text-sm text-slate-500">{formatMonth(selectedMonth)}</p>

              <div className="mb-5 flex justify-center">
                <div
                  className="relative h-44 w-44 rounded-full"
                  style={{ background: donutBackground }}
                >
                  <div className="absolute inset-5 rounded-full bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {statusSeries.map((item) => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-slate-900">
                Recent Applications - {formatMonth(selectedMonth)}
              </h2>
            </div>

            {recentApplications.length === 0 ? (
              <p className="text-slate-500">No applications found for this period.</p>
            ) : (
              <div className="space-y-2">
                {recentApplications.slice(0, 10).map((application) => {
                  const badge = statusMeta[application.status].badge
                  const initial = application.company_name.charAt(0).toUpperCase()
                  const tags = application.details.tags.slice(0, 2)

                  return (
                    <article
                      key={application.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div className="flex min-w-64 items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-sm font-semibold text-indigo-700">
                          {initial}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{application.company_name}</p>
                          <p className="text-sm text-slate-500">{application.job_title}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-slate-500">
                          {new Date(application.date_applied).toLocaleDateString()}
                        </span>
                        {tags.map((tag) => (
                          <span
                            key={`${application.id}-${tag}`}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badge}`}
                        >
                          {statusMeta[application.status].label}
                        </span>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  )
}
