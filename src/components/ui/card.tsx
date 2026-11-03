import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const cardVariants = cva(
  "group/card overflow-hidden rounded-xl bg-card text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] data-[size=sm]:[--card-spacing:--spacing(3)]",
  {
    variants: {
      variant: {
        default:
          "flex flex-col gap-(--card-spacing) py-(--card-spacing) has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        // Square, record-sleeve card: media or surface color fills it, details
        // appear on hover/focus.
        cover:
          "relative isolate aspect-square",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

/** Full-bleed image or illustration behind a cover card. */
function CardMedia({ className, alt = "", ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-slot="card-media"
      alt={alt}
      className={cn(
        "absolute inset-0 -z-10 size-full object-cover transition-transform duration-300 group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100",
        className
      )}
      {...props}
    />
  )
}

/**
 * Details layer of a cover card: title and subtitle at the top, CTA at the
 * bottom-left. Hidden until the card is hovered or something inside it has
 * keyboard focus; always visible on touch screens. It renders in the dark
 * theme so text stays legible over any media.
 */
function CardOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-overlay"
      className={cn(
        "dark absolute inset-0 flex flex-col items-start justify-between gap-4 bg-linear-to-b from-nero-900/90 via-nero-900/40 to-nero-900/90 p-(--card-spacing) text-foreground translate-y-2 opacity-0 transition duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100 group-has-[:focus-visible]/card:translate-y-0 group-has-[:focus-visible]/card:opacity-100 motion-reduce:translate-y-0 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm group-data-[variant=cover]/card:font-display group-data-[variant=cover]/card:text-5xl group-data-[variant=cover]/card:leading-[0.9] group-data-[variant=cover]/card:font-normal group-data-[variant=cover]/card:tracking-[0.01em] group-data-[variant=cover]/card:uppercase group-[[data-variant=cover][data-size=sm]]/card:text-3xl",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground group-data-[variant=cover]/card:type-info", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardMedia,
  CardOverlay,
  cardVariants,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
