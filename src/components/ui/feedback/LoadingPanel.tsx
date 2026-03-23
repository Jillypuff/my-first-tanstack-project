import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type LoadingPanelProps = {
  children?: ReactNode
  className?: string
}

export default function LoadingPanel({ children, className }: LoadingPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm",
        className,
      )}
    >
      {children ?? "Loading..."}
    </div>
  )
}
