import { Link } from "@tanstack/react-router"
import TextInput from "../../ui/form/TextInput"

const MAX_CONTACTS = 3

interface ContactsProps {
  form: any
}

export const Contacts = ({ form }: ContactsProps) => {
  const { Field } = form

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-600">
        Names, emails, and phone numbers you add here are personal data about other people. Only add
        professional contact details you are allowed to use for your job search. See{" "}
        <Link
          to="/privacy"
          hash="third-party-contacts"
          className="font-medium text-indigo-600 underline decoration-indigo-400/40 underline-offset-2 hover:text-indigo-500"
        >
          Privacy Policy – Contacts you add about other people
        </Link>
        .
      </p>

      <Field name="details.contacts">
        {(contactsField: any) => {
          const contacts = contactsField.state.value ?? []

          const addContact = () => {
            if (contacts.length >= MAX_CONTACTS) return
            contactsField.handleChange([
              ...contacts,
              { name: "", email: "", phone: "", note: "" },
            ])
          }

          return (
            <>
              {contacts.map((_: unknown, index: number) => (
                <div
                  key={index}
                  className="space-y-4 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0"
                >
                  <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Contact {index + 1}
                  </p>

                  <Field name={`details.contacts[${index}].name` as any}>
                    {(field: any) => (
                      <TextInput
                        field={field}
                        label="Name *"
                        type="text"
                        placeholder="Full name"
                      />
                    )}
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field name={`details.contacts[${index}].email` as any}>
                      {(field: any) => (
                        <TextInput
                          field={field}
                          label="Email (optional)"
                          type="text"
                          placeholder="email@company.com"
                        />
                      )}
                    </Field>

                    <Field name={`details.contacts[${index}].phone` as any}>
                      {(field: any) => (
                        <TextInput
                          field={field}
                          label="Phone (optional)"
                          type="text"
                          placeholder="+1 555 000 0000"
                        />
                      )}
                    </Field>
                  </div>

                  <Field name={`details.contacts[${index}].note` as any}>
                    {(field: any) => (
                      <TextInput
                        field={field}
                        label="Note (optional)"
                        type="text"
                        placeholder="Quick note about this person..."
                      />
                    )}
                  </Field>
                </div>
              ))}

              {contacts.length < MAX_CONTACTS ? (
                <button
                  type="button"
                  onClick={addContact}
                  className="rounded-xl bg-transparent px-0 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  + Add another contact
                </button>
              ) : (
                <p className="text-xs text-slate-500">You can add up to {MAX_CONTACTS} contacts.</p>
              )}
            </>
          )
        }}
      </Field>
    </div>
  )
}
