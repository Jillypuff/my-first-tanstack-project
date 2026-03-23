import type { SupabaseClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { getCookies, setCookie, deleteCookie } from "@tanstack/react-start/server"
import {
  mergePersistIntoSupabaseCookieOptions,
  shouldPersistAuthFromRecord,
} from "@/lib/auth/auth-persist"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string

export function getSupabaseForRequestServer(): SupabaseClient {
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
          const merged = mergePersistIntoSupabaseCookieOptions(options, persist)
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
