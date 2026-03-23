import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ErrorPanelProps = {
  children: ReactNode
  className?: string
}

export default function ErrorPanel({ children, className }: ErrorPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  )
}
