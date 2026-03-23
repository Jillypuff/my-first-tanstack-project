import { Store, useStore } from "@tanstack/react-store"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

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

  void supabase.auth.getSession().then(({ data: { session } }) => {
    applySessionUser(session?.user ?? null)
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    applySessionUser(session?.user ?? null)
  })
}

export function useAuthUser() {
  return useStore(globalStore, (s) => s.user)
}

export async function logout() {
  await supabase.auth.signOut()
}
