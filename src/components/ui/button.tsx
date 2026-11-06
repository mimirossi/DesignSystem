import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border-thin border-transparent bg-clip-padding type-label whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-feedback-error aria-invalid:ring-3 aria-invalid:ring-feedback-error/20 dark:aria-invalid:border-feedback-error/50 dark:aria-invalid:ring-feedback-error/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-action-primary text-action-on-primary hover:bg-action-primary/80",
        outline:
          "border-border-input bg-background-default hover:bg-surface-muted hover:text-text-primary aria-expanded:bg-surface-muted aria-expanded:text-text-primary dark:border-border-input dark:bg-border-input/30 dark:hover:bg-border-input/50",
        secondary:
          "bg-action-secondary-surface text-action-secondary hover:bg-[color-mix(in_oklch,var(--action-secondary-surface),var(--text-primary)_5%)] aria-expanded:bg-action-secondary-surface aria-expanded:text-action-secondary",
        ghost:
          "hover:bg-surface-muted hover:text-text-primary aria-expanded:bg-surface-muted aria-expanded:text-text-primary dark:hover:bg-surface-muted/50",
        destructive:
          "bg-feedback-error/10 text-feedback-error hover:bg-feedback-error/20 dark:bg-feedback-error/20 dark:hover:bg-feedback-error/30",
        link: "text-text-link underline underline-offset-4 hover:decoration-2",
      },
      size: {
        default:
          "h-8 gap-gap-sm px-inset-sm-md has-data-[icon=inline-end]:pr-inset-sm has-data-[icon=inline-start]:pl-inset-sm",
        xs: "h-6 gap-gap-xs rounded-sm px-inset-sm type-caption in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-inset-sm has-data-[icon=inline-start]:pl-inset-sm [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-gap-xs rounded-sm px-inset-sm-md type-caption in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-inset-sm has-data-[icon=inline-start]:pl-inset-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 rounded-md gap-gap-sm px-inset-sm-md has-data-[icon=inline-end]:pr-inset-sm has-data-[icon=inline-start]:pl-inset-sm",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-sm in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-sm in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9 rounded-md",
      },
    },
    compoundVariants: [
      // Links align with the surrounding text, so they carry no side padding.
      {
        variant: "link",
        class: "px-inset-none has-data-[icon=inline-end]:pr-inset-none has-data-[icon=inline-start]:pl-inset-none",
      },
    ],
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
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
