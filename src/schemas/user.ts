import { z } from "zod"

export const UserSchema = z.object({
  id: z.string(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
})

export type User = z.infer<typeof UserSchema>

export const registerFormSchema = UserSchema.omit({ id: true })
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string(),
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
})

export type LoginInput = z.infer<typeof loginFormSchema>
