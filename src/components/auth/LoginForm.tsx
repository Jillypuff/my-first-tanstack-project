import { useForm } from "@tanstack/react-form"
import { loginFormSchema } from "@schemas/user"
import TextInput from "../ui/form/TextInput"

const LoginForm = () => {
  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      email_or_username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Call db
      console.log(value)
    },
    validators: {
      onSubmit: loginFormSchema,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(e)
      }}
    >
      <Field name="email_or_username">
        {(field) => (
          <TextInput field={field} label="Email or Username" type="text" />
        )}
      </Field>

      <Field name="password">
        {(field) => (
          <TextInput field={field} label="Password" type="password" />
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

export default LoginForm
