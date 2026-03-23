import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type SectionLabelProps = HTMLAttributes<HTMLHeadingElement>

export default function SectionLabel({ className, ...props }: SectionLabelProps) {
  return (
    <h3
      className={cn(
        "text-xs font-semibold uppercase tracking-wide text-slate-500",
        className,
      )}
      {...props}
    />
  )
}
