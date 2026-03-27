import { z } from "zod"

export const UserSchema = z.object({
  id: z.string(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  /** ISO 8601 timestamp when the user accepted the legal documents at registration. */
  terms_accepted_at: z.string().nullable().optional(),
  /** Version string matching published Terms / Privacy (see `LEGAL_DOCUMENTS_VERSION`). */
  terms_version: z.string().nullable().optional(),
})

export type User = z.infer<typeof UserSchema>

const strongPassword = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const registerFormSchema = UserSchema.pick({ email: true })
  .extend({
    password: strongPassword,
    confirm_password: z.string(),
    accept_legal: z.boolean().refine((v) => v === true, {
      message:
        "You must accept the Terms of Service and Privacy Policy to register.",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

export type RegisterInput = z.infer<typeof registerFormSchema>

export const loginFormSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
})

export type LoginInput = z.infer<typeof loginFormSchema>

export const changePasswordFormSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: strongPassword,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordFormSchema>
