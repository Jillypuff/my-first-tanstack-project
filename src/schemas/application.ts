import { z } from "zod"

export const applicationStatusSchema = z.enum([
  "applied",
  "responded",
  "interview",
  "rejected",
  "ghosted",
])

const applicationBaseSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  job_title: z.string().min(1, "Job title is required"),
  date_applied: z.string().min(1, "Date applied is required"),
  status: applicationStatusSchema,
})

const contactsRelaxedSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  note: z.string(),
})

const contactsEnabledSchema = z.object({
  name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Email must be valid").or(z.literal("")),
  phone: z.string(),
  note: z.string(),
})

const tagsRelaxedSchema = z.array(z.string())
const tagsEnabledSchema = z.array(z.string().min(1)).max(5, "Max 5 tags")

const jobCriteriasRelaxedSchema = z.array(
  z.object({
    title: z.string(),
    track: z.boolean(),
  }),
)

const jobCriteriasEnabledSchema = z
  .array(
    z.object({
      title: z.string().min(1, "Criteria title required"),
      track: z.boolean(),
    }),
  )
  .max(5, "Max 5 criterias")

const companyRelaxedSchema = z.object({
  info: z.string(),
  location: z.string(),
  homepage: z.string(),
})

const companyEnabledSchema = z.object({
  info: z.string(),
  location: z.string(),
  homepage: z
    .string()
    .refine(
      (value) => {
        const trimmed = value.trim()
        return trimmed === "" || z.string().url().safeParse(trimmed).success
      },
      { message: "Homepage must be a valid URL (e.g. https://company.com)" },
    ),
})

const applicationNotesSchema = z
  .string()
  .max(2000, "Notes must be at most 2000 characters")

const buildDetailsSchema = (enabled: ApplicationFeatureId[]) => {
  const hasFeature = (feature: ApplicationFeatureId) => enabled.includes(feature)

  return z.object({
    notes: applicationNotesSchema,
    contacts: hasFeature("contacts") ? contactsEnabledSchema : contactsRelaxedSchema,
    tags: hasFeature("tags") ? tagsEnabledSchema : tagsRelaxedSchema,
    job_criterias: hasFeature("job_criterias")
      ? jobCriteriasEnabledSchema
      : jobCriteriasRelaxedSchema,
    company: hasFeature("company") ? companyEnabledSchema : companyRelaxedSchema,
  })
}

// Features for the application form
export type ApplicationFeatureId = "contacts" | "tags" | "job_criterias" | "company"

// Schema for the application form
export const applicationFormSchema = (enabled: ApplicationFeatureId[] = []) => {
  return applicationBaseSchema.extend({
    details: buildDetailsSchema(enabled),
  })
}

const applicationContactSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  note: z.string().default(""),
})

const applicationCompanySchema = z.object({
  info: z.string().default(""),
  location: z.string().default(""),
  homepage: z.string().default(""),
})

const applicationDetailsSchema = z.object({
  notes: z.string().max(2000).default(""),
  contacts: z.array(applicationContactSchema).default([]),
  tags: z.array(z.string()).max(5).default([]),
  job_criterias: z
    .array(
      z.object({
        title: z.string(),
        track: z.boolean(),
      }),
    )
    .max(5)
    .default([]),
  company: applicationCompanySchema.default({
    info: "",
    location: "",
    homepage: "",
  }),
})

// Schema for the application in the database
export const ApplicationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  company_name: z.string().min(1),
  job_title: z.string().min(1),
  date_applied: z.string(),
  status: applicationStatusSchema,
  details: applicationDetailsSchema,
  created_at: z.string(),
  updated_at: z.string(),
  last_activity_at: z.string(),
})

// Type for the application in the database
export type Application = z.infer<typeof ApplicationSchema>
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>