import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-base text-[var(--text)] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--text)] placeholder:text-[var(--text-faint)] focus-visible:border-[var(--primary)] focus-visible:ring-3 focus-visible:ring-[var(--primary)]/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--danger)] aria-invalid:ring-3 aria-invalid:ring-[var(--danger)]/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }