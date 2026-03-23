import type { Session } from "@supabase/supabase-js"
import { getSupabaseForRequest } from "@/lib/supabase-request"

/**
 * Session for route guards. Uses cookie-backed SSR on the server so refresh keeps you signed in.
 */
export async function getAuthSession(): Promise<Session | null> {
  const supabase = await getSupabaseForRequest()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
