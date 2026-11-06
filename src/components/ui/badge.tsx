import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-gap-xs overflow-hidden rounded-full border-thin border-transparent px-inset-sm type-info whitespace-nowrap transition-all focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap has-data-[icon=inline-end]:pr-inset-sm has-data-[icon=inline-start]:pl-inset-sm aria-invalid:border-feedback-error aria-invalid:ring-feedback-error/20 dark:aria-invalid:ring-feedback-error/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-action-primary text-action-on-primary [a]:hover:bg-action-primary/80",
        secondary:
          "bg-action-secondary-surface text-action-secondary [a]:hover:bg-action-secondary-surface/80",
        destructive:
          "bg-feedback-error/10 text-feedback-error dark:bg-feedback-error/20 [a]:hover:bg-feedback-error/20",
        outline:
          "border-border-default text-text-primary [a]:hover:bg-surface-muted [a]:hover:text-text-secondary",
        highlight: "bg-accent-default text-accent-on-accent",
        ghost:
          "hover:bg-surface-muted hover:text-text-secondary dark:hover:bg-surface-muted/50",
        link: "text-text-link underline underline-offset-4 hover:decoration-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
