import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { loginFormSchema } from "@schemas/user"
import { useNavigate } from "@tanstack/react-router"
import {
  readStayLoggedInCheckboxDefault,
  setAuthPersistPreferenceCookie,
} from "@/lib/auth/auth-persist"
import { getSupabaseForRequest } from "@/lib/supabase/request"
import TextInput from "../ui/form/TextInput"

const LOGIN_FAILED_MESSAGE = "Email or password was incorrect."

const LoginForm = () => {
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState<string | null>(null)

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: readStayLoggedInCheckboxDefault(),
    },
    onSubmit: async ({ value }) => {
      setLoginError(null)
      setAuthPersistPreferenceCookie(value.rememberMe)
      const supabase = await getSupabaseForRequest()
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      })

      if (error) {
        console.error("LoginForm onSubmit error: ", error)
        setLoginError(LOGIN_FAILED_MESSAGE)
        return
      }
      navigate({ to: "/" })
    },
    validators: {
      onSubmit: loginFormSchema,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleSubmit()
      }}
      className="space-y-4"
    >
      <Field name="email">
        {(field) => <TextInput field={field} label="Email" type="text" />}
      </Field>

      <Field name="password">
        {(field) => (
          <TextInput field={field} label="Password" type="password" />
        )}
      </Field>

      <Field name="rememberMe">
        {(field) => (
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              Stay logged in on this computer
            </span>
          </label>
        )}
      </Field>

      {loginError && (
        <p className="text-sm text-red-600" role="alert">
          {loginError}
        </p>
      )}

      <Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 h-12 w-full rounded-xl bg-indigo-600 px-4 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        )}
      />
    </form>
  )
}

export default LoginForm
