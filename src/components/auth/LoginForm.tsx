import React from 'react'
import { useForm } from "@tanstack/react-form"
import { loginFormSchema } from "@schemas/user"
import { useNavigate } from "@tanstack/react-router"
import { supabase } from "@/lib/supabase"
import TextInput from "../ui/form/TextInput"

const LoginForm = () => {
  const navigate = useNavigate()

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      })

      if (error) throw error
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
        void handleSubmit()
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
