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
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await supabase.auth.signUp({
        email: value.email,
        password: value.password,
        options: {
          data: {
            username: value.username,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        UserCollection.insert({
          id: data.user.id,
          email: data.user.email!,
          username: value.username,
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
      className=""
    >
      <Field name="username">
        {(field) => <TextInput field={field} label="Username" type="text" />}
      </Field>
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
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        )}
      />
    </form>
  )
}

export default RegisterForm
