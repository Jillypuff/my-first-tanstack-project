import { useForm } from "@tanstack/react-form"
import { registerFormSchema } from "@schemas/user"
import { UserCollection } from "@/lib/db"
import { useNavigate } from "@tanstack/react-router"
import { supabase } from "@/lib/supabase"
import TextInput from "../ui/form/TextInput"

const RegisterForm = () => {
  const navigate = useNavigate()

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
      })

      if (error) throw error

      if (data.user) {
        UserCollection.insert({
          id: data.user.id,
          email: data.user.email!,
        })
      }

      navigate({ to: "/" })
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
