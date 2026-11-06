import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-md border-thin border-border-input bg-transparent px-inset-sm-md py-inset-xs type-lead transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:type-label file:text-text-primary placeholder:text-text-secondary focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-border-input/50 disabled:opacity-50 aria-invalid:border-feedback-error aria-invalid:ring-3 aria-invalid:ring-feedback-error/20 tablet:type-body dark:bg-border-input/30 dark:disabled:bg-border-input/80 dark:aria-invalid:border-feedback-error/50 dark:aria-invalid:ring-feedback-error/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
