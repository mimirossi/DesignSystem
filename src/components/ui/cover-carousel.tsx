import * as React from "react"
import { flushSync } from "react-dom"
import { ArrowRightIcon, XIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardIllustration, CardMedia, CardOverlay, CardTitle } from "@/components/ui/card"

type CoverCarouselItem = {
  id: string
  title: string
  subtitle?: string
  description?: string
  /** Photo URL… */
  image?: string
  /** …or inline SVG markup drawn in currentColor, tinted by `tone`. */
  illustration?: string
  /** Text color class for the illustration, e.g. "text-brand-primary". */
  tone?: string
  imageAlt?: string
  cta?: { label: string; href?: string; onClick?: () => void }
}

/**
 * Commits a state update inside a View Transition so the cards morph between
 * layouts. `afterCommit` runs once the new DOM exists, before it is captured.
 */
function transition(update: () => void, afterCommit?: () => void) {
  const run = () => {
    flushSync(update)
    afterCommit?.()
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!document.startViewTransition || reduceMotion) run()
  else document.startViewTransition(run)
}

function CoverArt({ item }: { item: CoverCarouselItem }) {
  return item.illustration ? (
    <CardIllustration svg={item.illustration} label={item.imageAlt} className={item.tone} />
  ) : (
    <CardMedia src={item.image} alt={item.imageAlt ?? ""} />
  )
}

/**
 * Cover cards stacked in perspective along a diagonal. Hovering a card lifts
 * it out of the stack; clicking it straightens and enlarges the cards into a
 * horizontal strip you can scroll through, with more details per card.
 */
function CoverCarousel({
  items,
  className,
  ...props
}: React.ComponentProps<"div"> & { items: CoverCarouselItem[] }) {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const stripRef = React.useRef<HTMLDivElement>(null)
  // view-transition-name must be a plain identifier.
  const viewName = "cover-" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const nameOf = (item: CoverCarouselItem) => `${viewName}-${item.id.replace(/[^a-zA-Z0-9-]/g, "")}`

  const open = (id: string) => transition(() => setOpenId(id))

  // Jump the strip to the opened card before the new layout is painted
  // (instant, so scroll-smooth doesn't animate from the first card).
  React.useLayoutEffect(() => {
    const strip = stripRef.current
    const slide = openId && strip?.querySelector<HTMLElement>(`[data-id="${openId}"]`)
    if (strip && slide) strip.scrollTo({ left: slide.offsetLeft - strip.offsetLeft, behavior: "instant" })
  }, [openId])

  const close = () => {
    const id = openId
    // Return focus to the card that was opened.
    transition(
      () => setOpenId(null),
      () => document.querySelector<HTMLElement>(`[data-cover-trigger="${viewName}-${id}"]`)?.focus()
    )
  }

  // Vertical wheel scrolls the strip horizontally, for mouse users.
  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.currentTarget.scrollLeft += event.deltaY
    }
  }

  return (
    <div data-slot="cover-carousel" className={cn("relative w-full", className)} {...props}>
      {openId === null ? (
        <ul
          aria-label="Covers"
          className="relative mx-auto h-[calc(var(--cover-size)+(var(--count)-1)*var(--step-y))] w-[calc(var(--cover-size)+(var(--count)-1)*var(--step-x)+var(--cover-size)*0.3)] max-w-full perspective-[1400px] [--cover-size:clamp(9rem,28vw,13rem)] [--step-x:clamp(2.5rem,8vw,4.5rem)] [--step-y:clamp(1.25rem,3.5vw,2rem)]"
          style={{ "--count": items.length } as React.CSSProperties}
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              className="absolute bottom-0 left-0 w-(--cover-size) transition-transform duration-300 ease-out [--lift:0] [transform:translate3d(calc(var(--i)*var(--step-x)),calc(var(--i)*var(--step-y)*-1-var(--lift)*1.5rem),calc(var(--lift)*3rem))_rotateY(-38deg)] hover:[--lift:1] has-[:focus-visible]:[--lift:1] motion-reduce:transition-none"
              style={
                {
                  "--i": i,
                  zIndex: items.length - i,
                  viewTransitionName: nameOf(item),
                } as React.CSSProperties
              }
            >
              <Card variant="cover" size="sm" className="shadow-lg">
                <CoverArt item={item} />
                <CardOverlay>
                  <div className="grid">
                    <CardTitle>{item.title}</CardTitle>
                    {item.subtitle && <CardDescription>{item.subtitle}</CardDescription>}
                  </div>
                </CardOverlay>
                <button
                  type="button"
                  data-cover-trigger={`${viewName}-${item.id}`}
                  aria-label={`Open ${item.title}`}
                  onClick={() => open(item.id)}
                  className="absolute inset-0 z-10 cursor-pointer rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-inset"
                />
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <div
          role="region"
          aria-label="Covers, expanded"
          onKeyDown={(event) => event.key === "Escape" && close()}
          className="relative"
        >
          <Button
            variant="outline"
            size="icon"
            aria-label="Back to stack"
            onClick={close}
            className="absolute top-0 right-0 z-10"
            autoFocus
          >
            <XIcon />
          </Button>
          <div
            ref={stripRef}
            tabIndex={0}
            onWheel={onWheel}
            className="flex snap-x snap-mandatory gap-gap-xl overflow-x-auto overscroll-x-contain scroll-smooth pt-stack-xl pb-stack-sm outline-none motion-reduce:scroll-auto [scrollbar-width:thin] focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap"
          >
            {items.map((item, i) => (
              <article
                key={item.id}
                data-id={item.id}
                aria-label={`${i + 1} of ${items.length}: ${item.title}`}
                className="flex w-[min(44rem,85%)] shrink-0 snap-start flex-col gap-stack-md tablet:flex-row tablet:items-end tablet:gap-gap-lg"
              >
                <div
                  className="w-full max-w-80 shrink-0"
                  style={{ viewTransitionName: nameOf(item) }}
                >
                  <Card variant="cover" className="pointer-events-none">
                    <CoverArt item={item} />
                  </Card>
                </div>
                <div className="flex min-w-0 flex-col gap-stack-lg pb-inset-sm">
                  <div className="flex flex-col gap-stack-md">
                    <div className="flex flex-col gap-stack-xs">
                      <span className="font-mono type-caption text-text-secondary">
                        {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                      </span>
                      <div className="flex flex-col">
                        <h3 className="type-titolo-2">
                          {item.title}
                        </h3>
                        {item.subtitle && <p className="type-info text-text-secondary">{item.subtitle}</p>}
                      </div>
                    </div>
                    {item.description && <p className="max-w-sm type-body text-text-secondary">{item.description}</p>}
                  </div>
                  {item.cta && (
                    <Button
                      className="w-fit"
                      onClick={item.cta.onClick}
                      {...(item.cta.href ? { nativeButton: false, render: <a href={item.cta.href} /> } : {})}
                    >
                      {item.cta.label}
                      <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { CoverCarousel, type CoverCarouselItem }
