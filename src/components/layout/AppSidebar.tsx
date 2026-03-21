import { Link, useRouterState } from "@tanstack/react-router"

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/applications", label: "Applications" },
  { to: "/add", label: "Add Application" },
  { to: "/profile", label: "Profile" },
]

const AppSidebar = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-200">
      <div className="border-b border-slate-800 px-6 py-5">
        <p className="text-xl font-semibold text-white">JobTrack</p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-2 text-xs tracking-wide text-slate-500 uppercase">Menu</p>
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
        <p className="text-sm font-medium text-white">User userson</p>
        <p className="text-xs text-slate-400">User@example.com</p>
      </div>
    </aside>
  )
}

export default AppSidebar
