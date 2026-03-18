import { useForm } from "@tanstack/react-form"
import { loginFormSchema } from "@schemas/zod_schemas"

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
      onBlur: loginFormSchema,
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
        {(field) => {
          const { errors } = field.state.meta
          return (
            <div className="w-full flex flex-col gap-2">
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter email or username"
              />
              {errors.length > 0 && (
                <span className="text-red-500">{errors[0]?.message}</span>
              )}
            </div>
          )
        }}
      </Field>
      <Field name="password">
        {(field) => {
          const { errors } = field.state.meta
          return (
            <div className="w-full flex flex-col gap-2">
              <input
                value={field.state.value}
                type="password"
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Password"
              />
              {errors.length > 0 && (
                <span className="text-red-500">{errors[0]?.message}</span>
              )}
            </div>
          )
        }}
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
