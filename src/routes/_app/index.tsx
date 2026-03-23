import { useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import ApplicationStatusBadge from "@/components/application/ApplicationStatusBadge"
import Card from "@/components/ui/Card"
import ErrorPanel from "@/components/ui/feedback/ErrorPanel"
import LoadingPanel from "@/components/ui/feedback/LoadingPanel"
import NativeSelect from "@/components/ui/NativeSelect"
import Tag from "@/components/ui/Tag"
import {
  APPLICATION_STATUS_ORDER,
  applicationStatusMeta,
} from "@/lib/application/application-status"
import { applicationsQueryOptions } from "@/lib/application/applications"
import { currentMonthKey, getDashboardTimeDefault } from "@/lib/preferences"

export const Route = createFileRoute("/_app/")({
  component: DashboardPage,
})

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
      APPLICATION_STATUS_ORDER.map((status) => ({
        status,
        label: applicationStatusMeta[status].label,
        value: stats[status],
        chartColor: applicationStatusMeta[status].chartColor,
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
      return `${item.chartColor} ${start}deg ${current}deg`
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
          <NativeSelect
            id="month-filter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 rounded-lg border-slate-300 text-slate-800"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonth(month)}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      {isLoading ? (
        <LoadingPanel>Loading applications...</LoadingPanel>
      ) : error ? (
        <ErrorPanel>
          {error instanceof Error ? error.message : "Failed to load applications."}
        </ErrorPanel>
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
              <Card key={label} className="p-5">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">{String(value)}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="p-6 xl:col-span-2">
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
            </Card>

            <Card className="p-6">
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
                        style={{ backgroundColor: item.chartColor }}
                      />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
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
                          <Tag key={`${application.id}-${tag}`} variant="muted" size="md">
                            {tag}
                          </Tag>
                        ))}
                        <ApplicationStatusBadge
                          status={application.status}
                          variant="emphasized"
                        />
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </Card>
        </>
      )}
    </section>
  )
}
