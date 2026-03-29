import { Link, useRouterState } from "@tanstack/react-router"

export function PublicSiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isSignInSurface = pathname.startsWith("/login")
  const widthClass = isSignInSurface ? "auth-content-width" : "marketing-content-width"

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/60 py-8 backdrop-blur-sm">
      <div
        className={`flex min-w-0 flex-col items-center justify-between gap-4 sm:flex-row ${widthClass}`}
      >
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} JobTrack</p>
        <div className="flex gap-6 text-sm font-medium text-slate-600">
          <Link to="/terms" className="hover:text-indigo-600">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-indigo-600">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
