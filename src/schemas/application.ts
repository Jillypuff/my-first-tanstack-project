import { z } from "zod"

export const ApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  company_name: z.string().min(1, "Company name is required"),
  job_title: z.string().min(1, "Job title is required"),
  applied_at: z.string(),
})
