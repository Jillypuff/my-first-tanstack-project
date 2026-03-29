import { Link, useRouterState } from "@tanstack/react-router"

const navClass = "flex shrink-0 items-center gap-2 sm:gap-3"

const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:px-4"

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-900/15 transition hover:bg-indigo-500 sm:px-4"

export function PublicSiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isSignInSurface = pathname.startsWith("/login")
  const widthClass = isSignInSurface ? "auth-content-width" : "marketing-content-width"

  return (
    <div
      role="banner"
      className="sticky top-0 z-10 w-full border-b border-slate-200/90 bg-slate-100/95 shadow-[0_1px_3px_rgba(15,23,42,0.06)] backdrop-blur-sm"
    >
      <div
        className={`flex min-w-0 items-center justify-between gap-4 py-4 sm:py-6 ${widthClass}`}
      >
        <Link
          to="/"
          className="shrink-0 text-lg font-semibold tracking-tight text-slate-900 transition hover:text-indigo-700 sm:text-xl"
        >
          JobTrack
        </Link>
        <nav className={navClass}>
          {isSignInSurface ? (
            <Link to="/" className={secondaryButtonClass}>
              ← Home
            </Link>
          ) : (
            <>
              <Link to="/login" className={secondaryButtonClass}>
                Log in
              </Link>
              <Link to="/login" hash="create-account" className={primaryButtonClass}>
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
