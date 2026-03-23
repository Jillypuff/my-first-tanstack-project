import type { SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  sizeVariant?: "filter" | "form"
}

export default function NativeSelect({
  className,
  sizeVariant = "filter",
  ...props
}: NativeSelectProps) {
  return (
    <select
      className={cn(
        "w-full border border-slate-200 bg-white text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
        sizeVariant === "filter" &&
          "h-11 rounded-xl px-3 text-sm",
        sizeVariant === "form" &&
          "h-12 rounded-xl px-4 text-[15px]",
        className,
      )}
      {...props}
    />
  )
}
