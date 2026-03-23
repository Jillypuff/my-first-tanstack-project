import type { ApplicationStatus } from "@/schemas/application"

export const APPLICATION_STATUS_ORDER = [
  "applied",
  "responded",
  "interview",
  "rejected",
  "ghosted",
] as const satisfies readonly ApplicationStatus[]

export const applicationStatusMeta: Record<
  ApplicationStatus,
  { label: string; chartColor: string; badgeClassName: string }
> = {
  applied: {
    label: "Applied",
    chartColor: "#3b82f6",
    badgeClassName: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  responded: {
    label: "Responded",
    chartColor: "#10b981",
    badgeClassName: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  interview: {
    label: "Interview",
    chartColor: "#8b5cf6",
    badgeClassName: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  rejected: {
    label: "Rejected",
    chartColor: "#ef4444",
    badgeClassName: "bg-red-50 text-red-700 ring-red-200",
  },
  ghosted: {
    label: "Ghosted",
    chartColor: "#94a3b8",
    badgeClassName: "bg-slate-100 text-slate-600 ring-slate-200",
  },
}

export const applicationStatusLabels = Object.fromEntries(
  APPLICATION_STATUS_ORDER.map((status) => [status, applicationStatusMeta[status].label]),
) as Record<ApplicationStatus, string>
