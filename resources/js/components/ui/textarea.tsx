import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-base text-[var(--text)] shadow-xs transition-[color,box-shadow] outline-none placeholder:text-[var(--text-faint)] focus-visible:border-[var(--primary)] focus-visible:ring-3 focus-visible:ring-[var(--primary)]/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--danger)] aria-invalid:ring-3 aria-invalid:ring-[var(--danger)]/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }