import { createBrowserClient } from "@supabase/ssr"
import { parse, serialize } from "cookie"
import {
  mergePersistIntoSupabaseCookieOptions,
  readPersistFromDocumentCookie,
} from "@/lib/auth-persist"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string

export const supabase = createBrowserClient(supabaseUrl, supabaseKey, {
  isSingleton: true,
  cookies: {
    getAll() {
      const parsed = parse(document.cookie)
      return Object.keys(parsed).map((name) => ({
        name,
        value: parsed[name] ?? "",
      }))
    },
    setAll(cookiesToSet) {
      const persist = readPersistFromDocumentCookie()
      for (const { name, value, options } of cookiesToSet) {
        const merged = mergePersistIntoSupabaseCookieOptions(options, persist)
        document.cookie = serialize(name, value || "", merged)
      }
    },
  },
})
