import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { changePasswordFormSchema } from "@schemas/user"
import { getSupabaseForRequest } from "@/lib/supabase/request"
import { logout, useAuthUser } from "@/lib/auth/store"
import { queryClient } from "@/lib/queryClient"
import { applicationsQueryKey } from "@/lib/application/applications"
import {
  getDashboardTimeDefault,
  setDashboardTimeDefault,
  type DashboardTimeDefault,
} from "@/lib/preferences"
import TextInput from "@/components/ui/form/TextInput"
import { Check, LayoutGrid, Settings, TrendingUp } from "lucide-react"

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthUser()
  const email = user?.email ?? null
  const [dashboardDefault, setDashboardDefaultState] = useState<DashboardTimeDefault>(() =>
    getDashboardTimeDefault(),
  )
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleteAck, setDeleteAck] = useState(false)
  const [logoutBusy, setLogoutBusy] = useState(false)

  const passwordForm = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    onSubmit: async ({ value }) => {
      setPasswordMessage(null)
      const supabase = await getSupabaseForRequest()
      if (!email) {
        const msg = "Could not verify your account email."
        setPasswordMessage({ type: "error", text: msg })
        throw new Error(msg)
      }
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: value.current_password,
      })
      if (verifyError) {
        const text =
          verifyError.message.toLowerCase().includes("invalid") ||
          verifyError.message.toLowerCase().includes("credential")
            ? "Current password is incorrect."
            : verifyError.message
        setPasswordMessage({ type: "error", text })
        throw verifyError
      }
      const { error } = await supabase.auth.updateUser({
        password: value.new_password,
      })
      if (error) {
        setPasswordMessage({ type: "error", text: error.message })
        throw error
      }
      passwordForm.reset()
      setPasswordMessage({ type: "success", text: "Password updated." })
    },
    validators: {
      onSubmit: changePasswordFormSchema,
    },
  })

  const handleDashboardDefaultChange = (value: DashboardTimeDefault) => {
    setDashboardTimeDefault(value)
    setDashboardDefaultState(value)
  }

  const handleLogout = async () => {
    setLogoutBusy(true)
    try {
      await logout()
      await queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
      await queryClient.invalidateQueries({ queryKey: ["user"] })
      navigate({ to: "/" })
    } finally {
      setLogoutBusy(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteError(null)
    setDeleteBusy(true)
    try {
      const supabase = await getSupabaseForRequest()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setDeleteError("Not signed in.")
        return
      }

      const { error: applicationsError } = await supabase
        .from("applications")
        .delete()
        .eq("user_id", user.id)

      if (applicationsError) throw applicationsError

      const { error: profileError } = await supabase.from("profiles").delete().eq("id", user.id)

      if (profileError) throw profileError

      await logout()
      await queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
      await queryClient.invalidateQueries({ queryKey: ["user"] })
      navigate({ to: "/" })
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Something went wrong.")
    } finally {
      setDeleteBusy(false)
    }
  }

  const canDelete =
    deleteAck && deleteConfirm.trim().toUpperCase() === "DELETE" && !deleteBusy

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-slate-600">Account and dashboard preferences.</p>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Settings className="size-5 shrink-0 text-slate-400" strokeWidth={1.5} aria-hidden />
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Preferences</h2>
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-slate-800">Default dashboard view</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Choose what time period to show by default when opening the dashboard.
          </p>
          <fieldset className="mt-1">
            <legend className="sr-only">Default dashboard period</legend>
            <div className="mt-5 flex flex-wrap gap-2">
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  dashboardDefault === "all"
                    ? "border-indigo-400 bg-indigo-50/90 text-indigo-950"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="dashboard-default"
                  className="sr-only"
                  checked={dashboardDefault === "all"}
                  onChange={() => handleDashboardDefaultChange("all")}
                />
                <LayoutGrid
                  className={`size-4 shrink-0 ${dashboardDefault === "all" ? "text-indigo-600" : "text-slate-500"}`}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="whitespace-nowrap">All Time</span>
                {dashboardDefault === "all" ? (
                  <Check className="size-3.5 shrink-0 text-indigo-600" strokeWidth={2.5} aria-hidden />
                ) : null}
              </label>
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  dashboardDefault === "current_month"
                    ? "border-indigo-400 bg-indigo-50/90 text-indigo-950"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="dashboard-default"
                  className="sr-only"
                  checked={dashboardDefault === "current_month"}
                  onChange={() => handleDashboardDefaultChange("current_month")}
                />
                <TrendingUp
                  className={`size-4 shrink-0 ${dashboardDefault === "current_month" ? "text-indigo-600" : "text-slate-500"}`}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="whitespace-nowrap">Current Month</span>
                {dashboardDefault === "current_month" ? (
                  <Check className="size-3.5 shrink-0 text-indigo-600" strokeWidth={2.5} aria-hidden />
                ) : null}
              </label>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Account</h2>
        <p className="mt-1 text-sm text-slate-500">Signed in as</p>
        <p className="mt-1 font-medium text-slate-900">{email ?? "—"}</p>
        <button
          type="button"
          disabled={logoutBusy}
          onClick={() => void handleLogout()}
          className="mt-4 h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {logoutBusy ? "Signing out…" : "Log out"}
        </button>

        <div className="mt-8 border-t border-slate-100 pt-8">
          <h3 className="text-lg font-semibold text-slate-900">Change password</h3>
          <p className="mt-1 text-sm text-slate-500">
            Use a strong password you do not reuse elsewhere.
          </p>
          <form
            className="mt-4 max-w-md space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              passwordForm.handleSubmit()
            }}
          >
            <passwordForm.Field name="current_password">
              {(field) => (
                <TextInput
                  field={field}
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                />
              )}
            </passwordForm.Field>
            <passwordForm.Field name="new_password">
              {(field) => (
                <TextInput field={field} label="New password" type="password" />
              )}
            </passwordForm.Field>
            <passwordForm.Field name="confirm_password">
              {(field) => (
                <TextInput field={field} label="Confirm new password" type="password" />
              )}
            </passwordForm.Field>
            {passwordMessage && (
              <p
                className={
                  passwordMessage.type === "success" ? "text-sm text-emerald-600" : "text-sm text-red-600"
                }
              >
                {passwordMessage.text}
              </p>
            )}
            <passwordForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  {isSubmitting ? "Updating…" : "Update password"}
                </button>
              )}
            />
          </form>
        </div>

        <div className="mt-8 border-t border-red-100 pt-8">
          <h3 className="text-lg font-semibold text-red-800">Delete account</h3>
          <p className="mt-2 text-sm text-slate-600">
            Removes your profile and all applications from this app, then signs you out. Your
            Supabase auth user may still exist until removed in the project dashboard or via a
            server-side admin API; you may not be able to register again with the same email until
            then.
          </p>
          <div className="mt-4 space-y-3 max-w-md">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={deleteAck}
                onChange={(e) => setDeleteAck(e.target.checked)}
                className="rounded border-slate-300"
              />
              I understand this is permanent for my stored data.
            </label>
            <div className="space-y-2">
              <label
                htmlFor="delete-confirm"
                className="block text-sm font-medium text-slate-700"
              >
                Type DELETE to confirm
              </label>
              <input
                id="delete-confirm"
                type="text"
                autoComplete="off"
                placeholder="DELETE"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
            <button
              type="button"
              disabled={!canDelete}
              onClick={() => void handleDeleteAccount()}
              className="h-11 rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteBusy ? "Deleting…" : "Delete my account data"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
