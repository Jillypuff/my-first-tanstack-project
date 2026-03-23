import { Store, useStore } from "@tanstack/react-store"
import type { User } from "@supabase/supabase-js"
import { clearAuthPersistPreferenceCookie } from "@/lib/auth/auth-persist"
import { getSupabaseForRequest } from "@/lib/supabase/request"

export type GlobalAuthState = {
  user: User | null
  isAuthenticated: boolean
}

export const globalStore = new Store<GlobalAuthState>({
  user: null,
  isAuthenticated: false,
})

function applySessionUser(user: User | null) {
  globalStore.setState(() => ({
    user,
    isAuthenticated: !!user,
  }))
}

let authSyncStarted = false

export function initAuthStore() {
  if (typeof window === "undefined" || authSyncStarted) return
  authSyncStarted = true

  void getSupabaseForRequest().then((supabase) => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      applySessionUser(session?.user ?? null)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      applySessionUser(session?.user ?? null)
    })
  })
}

export function useAuthUser() {
  return useStore(globalStore, (s) => s.user)
}

export async function logout() {
  const supabase = await getSupabaseForRequest()
  await supabase.auth.signOut()
  clearAuthPersistPreferenceCookie()
}
