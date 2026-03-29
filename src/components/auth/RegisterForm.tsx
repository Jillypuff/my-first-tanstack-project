import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { registerFormSchema } from "@schemas/user"
import { UserCollection } from "@/lib/db"
import { LEGAL_DOCUMENTS_VERSION } from "@/lib/legal/constants"
import { getSupabaseForRequest } from "@/lib/supabase/request"
import TextInput from "../ui/form/TextInput"

const emptyRegisterValues = {
  email: "",
  password: "",
  confirm_password: "",
  accept_legal: false,
}

const RegisterForm = () => {
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(
    null,
  )

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: { ...emptyRegisterValues },
    onSubmit: async ({ value, formApi }) => {
      const email = value.email.trim()
      const supabase = await getSupabaseForRequest()
      const { data, error } = await supabase.auth.signUp({
        email,
        password: value.password,
      })

      if (error) throw error

      if (data.user) {
        const profileTx = UserCollection.insert({
          id: data.user.id,
          email: data.user.email!,
          terms_accepted_at: new Date().toISOString(),
          terms_version: LEGAL_DOCUMENTS_VERSION,
        })
        await profileTx.isPersisted.promise
      }

      setConfirmationSentTo(email)
      formApi.reset({ ...emptyRegisterValues }, { keepDefaultValues: false })
    },
    validators: {
      onSubmit: registerFormSchema,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(e)
      }}
      className="space-y-4"
    >
      {confirmationSentTo ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950"
        >
          <p className="font-semibold">Check your email</p>
          <p className="mt-2 text-emerald-900">
            We&apos;ve sent a confirmation link to{" "}
            <span className="font-medium">{confirmationSentTo}</span>. Open that
            message and follow the link to verify your account before signing
            in.
          </p>
          <button
            type="button"
            onClick={() => setConfirmationSentTo(null)}
            className="mt-3 text-sm font-medium text-emerald-800 underline decoration-emerald-600/40 underline-offset-2 hover:text-emerald-950"
          >
            Dismiss
          </button>
        </div>
      ) : null}
      <Field name="email">
        {(field) => <TextInput field={field} label="Email" type="text" />}
      </Field>
      <Field name="password">
        {(field) => (
          <TextInput field={field} label="Password" type="password" />
        )}
      </Field>
      <Field name="confirm_password">
        {(field) => (
          <TextInput field={field} label="Confirm password" type="password" />
        )}
      </Field>
      <Field name="accept_legal">
        {(field) => (
          <div className="space-y-1">
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
                I have read and agree to the{" "}
                <Link
                  to="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 underline decoration-indigo-400/40 underline-offset-2 hover:text-indigo-500"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 underline decoration-indigo-400/40 underline-offset-2 hover:text-indigo-500"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {field.state.meta.errors && field.state.meta.errors.length > 0 ? (
              <p className="text-sm text-red-600">
                {field.state.meta.errors[0]?.message ??
                  String(field.state.meta.errors[0])}
              </p>
            ) : null}
          </div>
        )}
      </Field>
      <Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 h-12 w-full rounded-xl bg-indigo-600 px-4 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        )}
      />
    </form>
  )
}

export default RegisterForm
