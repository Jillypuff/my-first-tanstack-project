import { cva, type VariantProps } from "class-variance-authority"
import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const tagVariants = cva("inline-flex items-center rounded-full", {
  variants: {
    variant: {
      accent: "bg-indigo-50 text-indigo-700",
      muted: "bg-slate-100 text-slate-600",
    },
    size: {
      sm: "px-2 py-0.5 text-xs font-normal",
      md: "px-2.5 py-1 text-xs font-normal",
      lg: "px-3 py-1 text-sm font-normal",
    },
  },
  defaultVariants: {
    variant: "accent",
    size: "md",
  },
})

export type TagProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof tagVariants>

export default function Tag({ className, variant, size, ...props }: TagProps) {
  return <span className={cn(tagVariants({ variant, size }), className)} {...props} />
}
