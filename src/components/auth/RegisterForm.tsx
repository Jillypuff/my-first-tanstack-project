import { useForm } from "@tanstack/react-form"
import { registerFormSchema } from "@schemas/zod_schemas"

const RegisterForm = () => {
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    onSubmit: async ({ value }) => {
      // Call db
      console.log(value)
    },
    validators: {
      onSubmit: registerFormSchema,
      onBlur: registerFormSchema,
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(e)
      }}
    >
      <Field name="username">
        {(field) => {
          const { errors } = field.state.meta
          return (
            <div className="w-full flex flex-col gap-2">
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="username"
              />
              {errors.length > 0 && (
                <span className="text-red-500">{errors[0]?.message}</span>
              )}
            </div>
          )
        }}
      </Field>
      <Field name="email">
        {(field) => {
          const { errors } = field.state.meta
          return (
            <div className="w-full flex flex-col gap-2">
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="email"
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
                placeholder="password"
              />
              {errors.length > 0 && (
                <span className="text-red-500">{errors[0]?.message}</span>
              )}
            </div>
          )
        }}
      </Field>
      <Field name="confirm_password">
        {(field) => {
          const { errors } = field.state.meta
          return (
            <div className="w-full flex flex-col gap-2">
              <input
                value={field.state.value}
                type="password"
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="confirm_password"
              />
              {errors.length > 0 && (
                <span className="text-red-500">{errors[0]?.message}</span>
              )}
            </div>
          )
        }}
      </Field>
    </form>
  )
}

export default RegisterForm
