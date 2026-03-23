import { useForm } from "@tanstack/react-form"
import { useMemo, useState } from "react"
import { ApplicationCollection } from "@/lib/db"
import { getSupabaseForRequest } from "@/lib/supabase/request"
import { CompanyInfo } from "./FormFeatures/CompanyInfo"
import { Contacts } from "./FormFeatures/Contacts"
import { JobCriterias } from "./FormFeatures/JobCriterias"
import { Tags } from "./FormFeatures/Tags"
import {
  applicationFormSchema,
  type ApplicationStatus,
  type ApplicationFeatureId,
} from "@schemas/application"
import Card from "../ui/Card"
import NativeSelect from "../ui/NativeSelect"
import TextInput from "../ui/form/TextInput"
import { APPLICATION_STATUS_ORDER, applicationStatusMeta } from "@/lib/application/application-status"

type FeatureId = ApplicationFeatureId
type FormContact = {
  name: string
  email: string
  phone: string
  note: string
}
type FormCompany = {
  info: string
  location: string
  homepage: string
}
type FormValues = {
  company_name: string
  job_title: string
  date_applied: string
  status: ApplicationStatus
  details: {
    contacts: FormContact
    tags: string[]
    job_criterias: Array<{ title: string; track: boolean }>
    company: FormCompany
  }
}

type NormalizedApplicationInput = {
  company_name: string
  job_title: string
  date_applied: string
  status: ApplicationStatus
  details: {
    contacts: FormContact[]
    tags: string[]
    job_criterias: Array<{ title: string; track: boolean }>
    company: FormCompany
  }
}

interface ApplicationFormProps {
  mode?: "create" | "edit"
  initialValues?: Partial<FormValues>
  onSubmitApplication?: (value: NormalizedApplicationInput) => Promise<void>
  submitLabel?: string
  onCancel?: () => void
}

const FEATURES = [
  {
    id: "contacts" as const,
    title: "Contacts",
    description: "Add recruiter or hiring manager details",
    Component: Contacts,
  },
  {
    id: "tags" as const,
    title: "Tags",
    description: "Label your application for easier filtering",
    Component: Tags,
  },
  {
    id: "job_criterias" as const,
    title: "Job Criterias",
    description: "Track requirements and skills to work on",
    Component: JobCriterias,
  },
  {
    id: "company" as const,
    title: "Company",
    description: "Company overview, location, and website",
    Component: CompanyInfo,
  },
]

const defaultValues: FormValues = {
  company_name: "",
  job_title: "",
  date_applied: new Date().toISOString().split("T")[0],
  status: "applied",
  details: {
    contacts: {
      name: "",
      email: "",
      phone: "",
      note: "",
    },
    tags: [],
    job_criterias: [],
    company: {
      info: "",
      location: "",
      homepage: "",
    },
  },
}

const ApplicationForm = ({
  mode = "create",
  initialValues,
  onSubmitApplication,
  submitLabel,
  onCancel,
}: ApplicationFormProps) => {
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null)
  const scrollToTop = () => {
    if (typeof window === "undefined") return

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  }

  const mergedInitialValues = useMemo<FormValues>(
    () => ({
      ...defaultValues,
      ...initialValues,
      details: {
        ...defaultValues.details,
        ...(initialValues?.details ?? {}),
        contacts: {
          ...defaultValues.details.contacts,
          ...(initialValues?.details?.contacts ?? {}),
        },
        company: {
          ...defaultValues.details.company,
          ...(initialValues?.details?.company ?? {}),
        },
      },
    }),
    [initialValues],
  )

  const [enabledFeatures, setEnabledFeatures] = useState<FeatureId[]>(() => {
    const enabled: FeatureId[] = []
    const contact = mergedInitialValues.details.contacts
    if ([contact.name, contact.email, contact.phone, contact.note].some((v) => v.trim())) {
      enabled.push("contacts")
    }
    if (mergedInitialValues.details.tags.length > 0) {
      enabled.push("tags")
    }
    if (mergedInitialValues.details.job_criterias.length > 0) {
      enabled.push("job_criterias")
    }
    const co = mergedInitialValues.details.company
    if ([co.info, co.location, co.homepage].some((v) => v.trim())) {
      enabled.push("company")
    }
    return enabled
  })
  const [isFeaturePickerOpen, setIsFeaturePickerOpen] = useState(false)
  const dynamicSchema = useMemo(
    () => applicationFormSchema(enabledFeatures),
    [enabledFeatures],
  )

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: mergedInitialValues,
    onSubmit: async ({ value, formApi }) => {
      setSaveFeedback(null)

      const contact = value.details.contacts
      const hasContactValue = [contact.name, contact.email, contact.phone, contact.note]
        .map((item) => item.trim())
        .some(Boolean)

      const normalizedInput: NormalizedApplicationInput = {
        company_name: value.company_name,
        job_title: value.job_title,
        date_applied: value.date_applied,
        status: value.status,
        details: {
          contacts: hasContactValue ? [contact] : [],
          tags: value.details.tags,
          job_criterias: value.details.job_criterias,
          company: value.details.company,
        },
      }

      if (onSubmitApplication) {
        await onSubmitApplication(normalizedInput)

        if (mode === "create") {
          scrollToTop()
        }

        if (mode === "create") {
          setSaveFeedback("Application saved successfully.")
          setEnabledFeatures([])
          setIsFeaturePickerOpen(false)

          formApi.reset(
            {
              ...defaultValues,
              date_applied: new Date().toISOString().split("T")[0],
              details: {
                contacts: { ...defaultValues.details.contacts },
                tags: [],
                job_criterias: [],
                company: { ...defaultValues.details.company },
              },
            },
            { keepDefaultValues: false },
          )
        }
        return
      }

      const supabase = await getSupabaseForRequest()
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) throw authError
      if (!authUser) throw new Error("You must be logged in to add an application.")

      const nowIso = new Date().toISOString()

      await ApplicationCollection.insert({
        id: crypto.randomUUID(),
        user_id: authUser.id,
        ...normalizedInput,
        created_at: nowIso,
        updated_at: nowIso,
        last_activity_at: nowIso,
      })

      if (mode === "create") {
        setSaveFeedback("Application saved successfully.")
        setEnabledFeatures([])
        setIsFeaturePickerOpen(false)

        formApi.reset(
          {
            ...defaultValues,
            date_applied: new Date().toISOString().split("T")[0],
            details: {
              contacts: { ...defaultValues.details.contacts },
              tags: [],
              job_criterias: [],
              company: { ...defaultValues.details.company },
            },
          },
          { keepDefaultValues: false },
        )
      }

      if (mode === "create") {
        scrollToTop()
      }
    },
    validators: {
      onSubmit: dynamicSchema,
    },
  })

  const availableFeatures = useMemo(
    () => FEATURES.filter((feature) => !enabledFeatures.includes(feature.id)),
    [enabledFeatures],
  )

  const activeFeatures = useMemo(
    () => FEATURES.filter((feature) => enabledFeatures.includes(feature.id)),
    [enabledFeatures],
  )

  const addFeature = (featureId: FeatureId) => {
    setEnabledFeatures((current) =>
      current.includes(featureId) ? current : [...current, featureId],
    )
    setIsFeaturePickerOpen(false)
  }

  const removeFeature = (featureId: FeatureId) => {
    setEnabledFeatures((current) => current.filter((id) => id !== featureId))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(e)
        }}
        className="space-y-5"
      >
        {saveFeedback && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
            {saveFeedback}
          </div>
        )}
        <Card className="p-6">
          <h2 className="mb-5 text-2xl font-semibold text-slate-800">
            Application Details
          </h2>

          <div className="space-y-4">
            <Field name="company_name">
              {(field) => (
                <TextInput
                  field={field}
                  label="Company Name *"
                  type="text"
                  placeholder="e.g. Spotify"
                />
              )}
            </Field>
            <Field name="job_title">
              {(field) => (
                <TextInput
                  field={field}
                  label="Job Title *"
                  type="text"
                  placeholder="e.g. Frontend Developer"
                />
              )}
            </Field>

            <Field name="date_applied">
              {(field) => (
                <div className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-slate-700"
                  >
                    Date Applied *
                  </label>
                  <input
                    id={field.name}
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  {field.state.meta.errors && (
                    <em className="text-xs text-red-500">
                      {field.state.meta.errors.join(",")}
                    </em>
                  )}
                </div>
              )}
            </Field>

            <Field name="status">
              {(field) => (
                <div className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-slate-700"
                  >
                    Status *
                  </label>
                  <NativeSelect
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value as ApplicationStatus)}
                    sizeVariant="form"
                  >
                    {APPLICATION_STATUS_ORDER.map((status) => (
                      <option key={status} value={status}>
                        {applicationStatusMeta[status].label}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
              )}
            </Field>
          </div>
        </Card>

        {activeFeatures.length > 0 && (
          <section className="space-y-4">
            {activeFeatures.map((feature) => {
              const FeatureComponent = feature.Component

              return (
                <Card key={feature.id} className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-semibold text-slate-800">
                        {feature.title}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(feature.id)}
                      className="rounded-lg bg-transparent px-2 py-1 text-slate-400 hover:text-slate-600"
                    >
                      x
                    </button>
                  </div>
                  <FeatureComponent form={{ Field }} />
                </Card>
              )
            })}
          </section>
        )}

        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setIsFeaturePickerOpen((current) => !current)}
            disabled={availableFeatures.length === 0}
            className="w-full rounded-2xl border-2 border-dashed border-slate-200 bg-white py-3 text-base font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            + Add more details {isFeaturePickerOpen ? "˄" : "˅"}
          </button>

          {availableFeatures.length === 0 ? (
            <p className="text-center text-sm text-slate-500">
              All available detail sections are already added.
            </p>
          ) : isFeaturePickerOpen ? (
            <Card className="p-5">
              <p className="mb-4 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Additional Information
              </p>
              <div className="space-y-2">
                {availableFeatures.map((feature) => (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => addFeature(feature.id)}
                    className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-left transition hover:border-slate-200 hover:bg-slate-100"
                  >
                    <p className="font-semibold text-slate-700">{feature.title}</p>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            <></>
          )}
        </section>

        <Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {isSubmitting
                  ? "Saving..."
                  : submitLabel ?? (mode === "edit" ? "Update Application" : "Add Application")}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          )}
        />
      </form>
    </div>
  )
}

export default ApplicationForm
