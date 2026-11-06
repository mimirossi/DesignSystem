"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-gap-xs rounded-md type-label whitespace-nowrap transition-all outline-none hover:bg-surface-muted hover:text-text-primary focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-feedback-error aria-invalid:ring-feedback-error/20 aria-pressed:bg-surface-muted data-[state=on]:bg-surface-muted dark:aria-invalid:ring-feedback-error/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-thin border-border-input bg-transparent hover:bg-surface-muted",
      },
      size: {
        default:
          "h-8 min-w-8 px-inset-sm-md has-data-[icon=inline-end]:pr-inset-sm has-data-[icon=inline-start]:pl-inset-sm",
        sm: "h-7 min-w-7 rounded-sm px-inset-sm-md type-caption has-data-[icon=inline-end]:pr-inset-sm has-data-[icon=inline-start]:pl-inset-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 rounded-md px-inset-sm-md has-data-[icon=inline-end]:pr-inset-sm has-data-[icon=inline-start]:pl-inset-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
