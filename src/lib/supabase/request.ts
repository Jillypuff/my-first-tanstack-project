import type { SupabaseClient } from "@supabase/supabase-js"
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string

/**
 * Cookie-backed Supabase client for the active request (SSR) or the browser singleton.
 * Use this in loaders, queryFns, and server-aware code instead of importing `@/lib/supabase/browser-client` directly.
 */
export async function getSupabaseForRequest(): Promise<SupabaseClient> {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY")
  }

  if (import.meta.env.SSR) {
    const { getSupabaseForRequestServer } = await import("./request-ssr")
    return getSupabaseForRequestServer()
  }

  const { supabase } = await import("@/lib/supabase/browser-client")
  return supabase
}
