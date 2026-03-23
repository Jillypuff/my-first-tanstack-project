const DASHBOARD_TIME_DEFAULT_KEY = "dashboard_time_default"

export type DashboardTimeDefault = "all" | "current_month"

export function currentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export function getDashboardTimeDefault(): DashboardTimeDefault {
  if (typeof localStorage === "undefined") {
    return "all"
  }
  const v = localStorage.getItem(DASHBOARD_TIME_DEFAULT_KEY)
  return v === "current_month" ? "current_month" : "all"
}

export function setDashboardTimeDefault(value: DashboardTimeDefault) {
  if (typeof localStorage === "undefined") return
  localStorage.setItem(DASHBOARD_TIME_DEFAULT_KEY, value)
}
