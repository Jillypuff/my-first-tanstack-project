import { ApplicationSchema, type Application } from "@/schemas/application"
import { getSupabaseForRequest } from "@/lib/supabase-request"

export const applicationsQueryKey = ["applications"] as const

export const fetchApplications = async (): Promise<Application[]> => {
  const supabase = await getSupabaseForRequest()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("applications")
    .select(
      "id, user_id, company_name, job_title, date_applied, status, details, created_at, updated_at, last_activity_at",
    )
    .eq("user_id", user.id)
    .order("date_applied", { ascending: false })

  if (error) throw error

  return ApplicationSchema.array().parse(data ?? [])
}

export const applicationsQueryOptions = {
  queryKey: applicationsQueryKey,
  queryFn: fetchApplications,
  staleTime: 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
}
