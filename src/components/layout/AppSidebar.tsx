import { Link, useRouterState } from "@tanstack/react-router"
import { useAuthUser } from "@/lib/auth/store"

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/applications", label: "Applications" },
  { to: "/add", label: "Add Application" },
  { to: "/profile", label: "Profile" },
]

const AppSidebar = () => {
  const user = useAuthUser()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const displayName =
    (typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    user?.email?.split("@")[0] ||
    "Account"
  const displayEmail = user?.email ?? ""

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-200">
      <div className="border-b border-slate-800 px-6 py-5">
        <p className="text-xl font-semibold text-white">JobTrack</p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.to ||
              (item.to !== "/" && pathname.startsWith(`${item.to}/`))

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`block rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800 px-5 py-4">
        <p className="text-sm font-medium text-white">{displayName}</p>
        {displayEmail ? (
          <p className="text-xs text-slate-400">{displayEmail}</p>
        ) : null}
      </div>
    </aside>
  )
}

export default AppSidebar
