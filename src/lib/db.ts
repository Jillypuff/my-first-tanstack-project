import { createCollection } from "@tanstack/react-db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"
import { UserSchema, type User } from "../schemas/user"
import { ApplicationSchema, type Application } from "../schemas/application"

import { queryClient } from "./queryClient"
import { applicationsQueryKey } from "./application/applications"
import { getSupabaseForRequest } from "./supabase/request"

export const UserCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["user"],
    queryClient,
    schema: UserSchema,
    getKey: (user: User) => user.id,

    queryFn: async (): Promise<User[]> => {
      const supabase = await getSupabaseForRequest()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) return []

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, terms_accepted_at, terms_version")
        .eq("id", authUser.id)
        .single()

      if (error || !data) {
        console.warn("Profile not found or error: ", error)
        return []
      }
      return [UserSchema.parse(data)]
    },

    onInsert: async ({ transaction }) => {
      const supabase = await getSupabaseForRequest()
      const newUser = transaction.mutations[0].modified

      const { error } = await supabase.from("profiles").insert({
        id: newUser.id,
        email: newUser.email,
        terms_accepted_at: newUser.terms_accepted_at ?? null,
        terms_version: newUser.terms_version ?? null,
      })
      if (error) throw error
      await queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },

    onUpdate: async ({ transaction }) => {
      const supabase = await getSupabaseForRequest()
      const { modified } = transaction.mutations[0]

      const { error } = await supabase
        .from("profiles")
        .update({ email: modified.email })
        .eq("id", modified.id)
      if (error) throw error
      await queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },

    onDelete: async ({ transaction }) => {
      const supabase = await getSupabaseForRequest()
      const id = transaction.mutations[0].key as string

      const { error } = await supabase.from("profiles").delete().eq("id", id)
      if (error) throw error
    },
  }),
)

export const ApplicationCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["applications"],
    queryClient,
    schema: ApplicationSchema,
    getKey: (application: Application) => application.id,

    queryFn: async (): Promise<Application[]> => {
      const supabase = await getSupabaseForRequest()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) return []

      const { data, error } = await supabase
        .from("applications")
        .select(
          "id, user_id, company_name, job_title, date_applied, status, details, created_at, updated_at, last_activity_at",
        )
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      return ApplicationSchema.array().parse(data ?? [])
    },

    onInsert: async ({ transaction }) => {
      const supabase = await getSupabaseForRequest()
      const newApplication = transaction.mutations[0].modified as Application

      const { error } = await supabase.from("applications").insert({
        id: newApplication.id,
        user_id: newApplication.user_id,
        company_name: newApplication.company_name,
        job_title: newApplication.job_title,
        date_applied: newApplication.date_applied,
        status: newApplication.status,
        details: newApplication.details,
        created_at: newApplication.created_at,
        updated_at: newApplication.updated_at,
        last_activity_at: newApplication.last_activity_at,
      })

      if (error) throw error
    },

    onUpdate: async ({ transaction }) => {
      const supabase = await getSupabaseForRequest()
      const modified = transaction.mutations[0].modified as Application

      const { error } = await supabase
        .from("applications")
        .update({
          company_name: modified.company_name,
          job_title: modified.job_title,
          date_applied: modified.date_applied,
          status: modified.status,
          details: modified.details,
          last_activity_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", modified.id)

      if (error) throw error
    },

    onDelete: async ({ transaction }) => {
      const supabase = await getSupabaseForRequest()
      const id = transaction.mutations[0].key as string

      const { error } = await supabase.from("applications").delete().eq("id", id)
      if (error) throw error
      await queryClient.invalidateQueries({ queryKey: applicationsQueryKey })
    },
  }),
)
