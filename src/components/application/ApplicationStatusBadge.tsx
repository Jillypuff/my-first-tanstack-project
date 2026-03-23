import { cva, type VariantProps } from "class-variance-authority"
import type { ApplicationStatus } from "@/schemas/application"
import { applicationStatusMeta } from "@/lib/application/application-status"
import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center rounded-full text-xs font-medium", {
  variants: {
    variant: {
      compact: "px-2.5 py-1",
      emphasized: "px-2.5 py-1 ring-1",
    },
  },
  defaultVariants: {
    variant: "compact",
  },
})

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus
  className?: string
} & VariantProps<typeof badgeVariants>

export default function ApplicationStatusBadge({
  status,
  className,
  variant,
}: ApplicationStatusBadgeProps) {
  const meta = applicationStatusMeta[status]
  return (
    <span className={cn(badgeVariants({ variant }), meta.badgeClassName, className)}>
      {meta.label}
    </span>
  )
}
