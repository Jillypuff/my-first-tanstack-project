interface TextInputProps {
  field: any
  label: string
  type: "text" | "password"
}

const TextInput = ({ field, label, type }: TextInputProps) => {
  const { errors } = field.state.meta

  return (
    <div className="">
      <label htmlFor={field.name} className="">
        {label}
      </label>
      <input
        className="border"
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {errors.length > 0 && (
        <span className="text-xs text-red-500">{errors[0]?.message}</span>
      )}
    </div>
  )
}

export default TextInput
