import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { registerFormSchema } from "@schemas/user"
import { UserCollection } from "@/lib/db"
import { supabase } from "@/lib/supabase"
import TextInput from "../ui/form/TextInput"

const emptyRegisterValues = {
  email: "",
  password: "",
  confirm_password: "",
}

const RegisterForm = () => {
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(
    null,
  )

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: { ...emptyRegisterValues },
    onSubmit: async ({ value, formApi }) => {
      const email = value.email.trim()
      const { data, error } = await supabase.auth.signUp({
        email,
        password: value.password,
      })

      if (error) throw error

      if (data.user) {
        UserCollection.insert({
          id: data.user.id,
          email: data.user.email!,
        })
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
