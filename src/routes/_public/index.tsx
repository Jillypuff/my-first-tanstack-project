import { Link, createFileRoute } from "@tanstack/react-router"
import { BarChart3, Kanban, LayoutDashboard, Tags } from "lucide-react"

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      {
        title: "JobTrack — Job search, organized",
      },
      {
        name: "description",
        content:
          "Track applications, statuses, and progress in one dashboard. Built for focused job seekers who want clarity without spreadsheets.",
      },
    ],
  }),
  component: LandingPage,
})

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard at a glance",
    description:
      "See totals, monthly activity, and status breakdown so you always know where your search stands.",
  },
  {
    icon: Kanban,
    title: "Every application in one place",
    description:
      "Log companies, roles, and dates in a structured list—no more lost threads in your inbox.",
  },
  {
    icon: Tags,
    title: "Tags and context",
    description:
      "Add tags to remember referrals, tech stacks, or notes that matter when you follow up.",
  },
  {
    icon: BarChart3,
    title: "Status pipeline",
    description:
      "Track applied, interviews, rejections, and more so you can spot patterns and stay motivated.",
  },
]

function LandingPage() {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.22),transparent)]"
      />
      <main className="marketing-content-width relative min-w-0 flex-1 pb-20">
        <section className="grid gap-12 py-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[2.75rem] lg:leading-tight">
                Your job search,{" "}
                <span className="text-indigo-600">finally organized</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                JobTrack helps you record applications, track outcomes, and see trends over time—so
                you spend less energy remembering and more energy interviewing.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                hash="create-account"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-indigo-500"
              >
                Create free account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <div
            aria-hidden
            className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-900/5 ring-1 ring-slate-900/5 lg:max-w-none"
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-semibold text-slate-800">Dashboard preview</span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                Sample
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Applications", value: "24" },
                { label: "Interviews", value: "5" },
                { label: "This month", value: "8" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
                >
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex h-28 items-end justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/50 px-4 pb-3 pt-6">
              {[40, 65, 45, 80, 55, 70].map((h, i) => (
                <div
                  key={i}
                  className="w-full max-w-[2rem] rounded-t-md bg-indigo-400/90"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-white p-3">
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">Acme Corp</p>
                  <p className="truncate text-xs text-slate-500">Senior Engineer</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                  Interview
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                  N
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">Northwind</p>
                  <p className="truncate text-xs text-slate-500">Product Designer</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Applied
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200/80 pt-16">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Built for a calmer search
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Everything you need to stay consistent—without turning your hunt into a second job.
          </p>
          <ul className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-12 text-center shadow-lg sm:px-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to track smarter?</h2>
          <p className="mx-auto mt-3 max-w-lg text-indigo-100">
            Sign up in seconds and add your first application today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              hash="create-account"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-base font-semibold text-indigo-700 shadow transition hover:bg-indigo-50"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent px-5 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
