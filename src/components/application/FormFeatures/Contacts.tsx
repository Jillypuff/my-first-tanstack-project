import { Link } from "@tanstack/react-router"
import TextInput from "../../ui/form/TextInput"

interface ContactsProps {
  form: any
}

export const Contacts = ({ form }: ContactsProps) => {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-600">
        Names, emails, and phone numbers you add here are personal data about other people. Only add
        professional contact details you are allowed to use for your job search. See{" "}
        <Link
          to="/privacy#third-party-contacts"
          className="font-medium text-indigo-600 underline decoration-indigo-400/40 underline-offset-2 hover:text-indigo-500"
        >
          Privacy Policy – Contacts you add about other people
        </Link>
        .
      </p>
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Contact 1
      </p>

      <form.Field name="details.contacts.name">
        {(field: any) => (
          <TextInput
            field={field}
            label="Name *"
            type="text"
            placeholder="Full name"
          />
        )}
      </form.Field>

      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="details.contacts.email">
          {(field: any) => (
            <TextInput
              field={field}
              label="Email (optional)"
              type="text"
              placeholder="email@company.com"
            />
          )}
        </form.Field>

        <form.Field name="details.contacts.phone">
          {(field: any) => (
            <TextInput
              field={field}
              label="Phone (optional)"
              type="text"
              placeholder="+1 555 000 0000"
            />
          )}
        </form.Field>
      </div>

      <form.Field name="details.contacts.note">
        {(field: any) => (
          <TextInput
            field={field}
            label="Note (optional)"
            type="text"
            placeholder="Quick note about this person..."
          />
        )}
      </form.Field>

      <button
        type="button"
        className="rounded-xl bg-transparent px-0 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        + Add another contact
      </button>
    </div>
  )
}
