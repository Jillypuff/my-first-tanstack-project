import { parse, serialize, type SerializeOptions } from "cookie"

/** Tracks "stay logged in" so auth cookie lifetime matches user choice (readable by SSR). */
export const AUTH_PERSIST_COOKIE = "sb-stay-logged-in"

const PERSIST_MAX_AGE_SEC = 60 * 60 * 24 * 365

export function shouldPersistAuthFromRecord(
  cookies: Record<string, string | undefined>,
): boolean {
  const v = cookies[AUTH_PERSIST_COOKIE]
  if (v === "0") return false
  return true
}

export function readPersistFromDocumentCookie(): boolean {
  if (typeof document === "undefined") return true
  const parsed = parse(document.cookie)
  return shouldPersistAuthFromRecord(parsed)
}

/** Login checkbox default: only checked if the user previously chose “stay logged in” (cookie still present). */
export function readStayLoggedInCheckboxDefault(): boolean {
  if (typeof document === "undefined") return false
  const parsed = parse(document.cookie)
  return parsed[AUTH_PERSIST_COOKIE] === "1"
}

/** Call before sign-in so the next Set-Cookie uses the right lifetime. */
export function setAuthPersistPreferenceCookie(rememberMe: boolean): void {
  if (typeof document === "undefined") return
  const base: SerializeOptions = { path: "/", sameSite: "lax" }
  const opts: SerializeOptions = rememberMe
    ? { ...base, maxAge: PERSIST_MAX_AGE_SEC }
    : base
  document.cookie = serialize(AUTH_PERSIST_COOKIE, rememberMe ? "1" : "0", opts)
}

export function clearAuthPersistPreferenceCookie(): void {
  if (typeof document === "undefined") return
  document.cookie = serialize(AUTH_PERSIST_COOKIE, "", {
    path: "/",
    maxAge: 0,
  })
}

export function mergePersistIntoSupabaseCookieOptions(
  options: SerializeOptions,
  persist: boolean,
): SerializeOptions {
  if (options.maxAge === 0) {
    return options
  }

  const { maxAge: _m, expires: _e, ...rest } = options
  const base: SerializeOptions = {
    ...rest,
    path: rest.path ?? "/",
    sameSite: rest.sameSite ?? "lax",
  }

  if (persist) {
    return { ...base, maxAge: PERSIST_MAX_AGE_SEC }
  }

  return base
}
