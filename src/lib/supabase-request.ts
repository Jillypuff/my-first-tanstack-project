import type { SupabaseClient } from "@supabase/supabase-js"
import {
  mergePersistIntoSupabaseCookieOptions,
  shouldPersistAuthFromRecord,
} from "@/lib/auth-persist"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string

/**
 * Cookie-backed Supabase client for the active request (SSR) or the browser singleton.
 * Use this in loaders, queryFns, and server-aware code instead of importing `@/lib/supabase` directly.
 */
export async function getSupabaseForRequest(): Promise<SupabaseClient> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY")
  }

  if (import.meta.env.SSR) {
    const [{ createServerClient }, { getCookies, setCookie, deleteCookie }] =
      await Promise.all([
        import("@supabase/ssr"),
        import("@tanstack/react-start/server"),
      ])

    const persist = shouldPersistAuthFromRecord(getCookies())

    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            const merged = mergePersistIntoSupabaseCookieOptions(
              options,
              persist,
            )
            if (!value) {
              deleteCookie(name, merged)
            } else {
              setCookie(name, value, merged)
            }
          }
        },
      },
    })
  }

  const { supabase } = await import("@/lib/supabase")
  return supabase
}
