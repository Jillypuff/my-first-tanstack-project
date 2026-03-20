import { Store } from "@tanstack/react-store"

export const globalStore = new Store({
  token: localStorage.getItem("auth_token") || null,
  isAuthenticated: false,
})

export const loginSuccess = (token: string) =>
  globalStore.setState((s) => ({ ...s, token, isAuthenticated: true }))

export const logout = () => {
  localStorage.removeItem("auth_token")
  globalStore.setState((s) => ({
    ...s,
    token: null,
    isAuthenticated: false,
  }))
}
