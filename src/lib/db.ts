import { createCollection } from "@tanstack/react-db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"
import { UserSchema, type User } from "../schemas/user"

import { queryClient } from "./queryClient"
import { supabase } from "./supabase"

export const UserCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["user"],
    queryClient,
    schema: UserSchema,
    getKey: (user: User) => user.id,

    queryFn: async (): Promise<User[]> => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) return []

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email")
        .eq("id", authUser.id)
        .single()

      if (error || !data) {
        console.warn("Profile not found or error: ", error)
        return []
      }
      return [data as User]
    },

    onInsert: async ({ transaction }) => {
      const newUser = transaction.mutations[0].modified

      const { error } = await supabase.from("profiles").insert({
        id: newUser.id,
        email: newUser.email,
      })
      if (error) throw error
    },

    onUpdate: async ({ transaction }) => {
      const { modified } = transaction.mutations[0]

      const { error } = await supabase
        .from("profiles")
        .update({ email: modified.email })
        .eq("id", modified.id)
      if (error) throw error
    },

    onDelete: async ({ transaction }) => {
      const id = transaction.mutations[0].key as string

      const { error } = await supabase.from("profiles").delete().eq("id", id)
      if (error) throw error
    },
  }),
)

/*
const ApplicationCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["application"],
    queryClient,
    schema: ApplicationSchema,
    getKey: (user: User) => user.id,
    
    queryFn: async () => {
        return []
    },
    onInsert: async ({ transaction }) => {},
    onUpdate: async ({ transaction }) => {},
    onDelete: async ({ transaction }) => {},
  }),
)
*/
