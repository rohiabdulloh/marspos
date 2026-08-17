import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-[var(--primary)] focus-visible:ring-3 focus-visible:ring-[var(--primary)]/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-[var(--danger)] aria-invalid:ring-3 aria-invalid:ring-[var(--danger)]/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-xs",
        outline:
          "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-xs hover:bg-[var(--primary-soft)] hover:text-[var(--primary-dark)] aria-expanded:bg-[var(--primary-soft)] aria-expanded:text-[var(--primary-dark)]",
        secondary:
          "bg-[var(--primary-soft)] text-[var(--primary-dark)] hover:bg-[var(--border)] aria-expanded:bg-[var(--primary-soft)] aria-expanded:text-[var(--primary-dark)]",
        ghost:
          "hover:bg-[var(--primary-soft)] hover:text-[var(--primary-dark)] aria-expanded:bg-[var(--primary-soft)] aria-expanded:text-[var(--primary-dark)]",
        destructive:
          "bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white focus-visible:border-[var(--danger)]/40 focus-visible:ring-[var(--danger)]/20",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }