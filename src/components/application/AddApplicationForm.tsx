import { useForm } from "@tanstack/react-form"
import TextInput from "../ui/form/TextInput"

const AddApplicationForm = () => {
  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      company_name: "",
      job_title: "",
      date_applied: new Date().toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      // Save to db
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
      <Field name="company_name">
        {(field) => (
          <TextInput field={field} label="company_name" type="text" />
        )}
      </Field>
      <Field name="job_title">
        {(field) => <TextInput field={field} label="job_title" type="text" />}
      </Field>
      <Field name="date_applied">
        {(field) => (
          <div className="">
            <label htmlFor={field.name} className="">
              Date applied
            </label>
            <input
              id={field.name}
              type="date"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className=""
            />
            {field.state.meta.errors && (
              <em className="text-red-500 text-xs">
                {field.state.meta.errors.join(",")}
              </em>
            )}
          </div>
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

export default AddApplicationForm
