interface TextInputProps {
  field: any
  label: string
  type: "text" | "password"
  placeholder?: string
  wrapperClassName?: string
  labelClassName?: string
  inputClassName?: string
}

const TextInput = ({
  field,
  label,
  type,
  placeholder,
  wrapperClassName = "",
  labelClassName = "",
  inputClassName = "",
}: TextInputProps) => {
  const { errors } = field.state.meta

  return (
    <div className={`space-y-2 ${wrapperClassName}`}>
      <label
        htmlFor={field.name}
        className={`block text-sm font-medium text-slate-700 ${labelClassName}`}
      >
        {label}
      </label>
      <input
        className={`h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${inputClassName}`}
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
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
