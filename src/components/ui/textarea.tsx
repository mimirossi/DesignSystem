import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border-thin border-border-input bg-transparent px-inset-sm-md py-inset-sm type-lead transition-colors outline-none placeholder:text-text-secondary focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap disabled:cursor-not-allowed disabled:bg-border-input/50 disabled:opacity-50 aria-invalid:border-feedback-error aria-invalid:ring-3 aria-invalid:ring-feedback-error/20 md:type-body dark:bg-border-input/30 dark:disabled:bg-border-input/80 dark:aria-invalid:border-feedback-error/50 dark:aria-invalid:ring-feedback-error/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
