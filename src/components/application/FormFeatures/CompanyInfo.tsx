import TextInput from "../../ui/form/TextInput"

interface CompanyInfoProps {
  form: any
}

export const CompanyInfo = ({ form }: CompanyInfoProps) => {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <form.Field name="details.company.info">
        {(field: any) => (
          <div className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-slate-700"
            >
              Company information (optional)
            </label>
            <textarea
              id={field.name}
              name={field.name}
              rows={4}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="What the company does, size, culture notes..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {field.state.meta.errors?.length > 0 && (
              <span className="text-xs text-red-500">{field.state.meta.errors[0]?.message}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="details.company.location">
        {(field: any) => (
          <TextInput
            field={field}
            label="Location (optional)"
            type="text"
            placeholder="e.g. Stockholm, Remote EU"
          />
        )}
      </form.Field>

      <form.Field name="details.company.homepage">
        {(field: any) => (
          <div className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-slate-700"
            >
              Homepage (optional)
            </label>
            <input
              id={field.name}
              name={field.name}
              type="url"
              inputMode="url"
              placeholder="https://company.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {field.state.meta.errors?.length > 0 && (
              <span className="text-xs text-red-500">{field.state.meta.errors[0]?.message}</span>
            )}
          </div>
        )}
      </form.Field>
    </div>
  )
}
