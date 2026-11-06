import { ArrowRightIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CATEGORIES, registry } from "@/gallery/registry"

export function HomePage() {
  const stateCount = registry.filter((entry) => entry.states).length

  return (
    <div className="flex flex-col gap-section-md">
      <header className="flex flex-col gap-stack-sm">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Components</h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse every component in the design system. Each page shows its variants, its interactive
          states side by side, and copy-ready code for every example.
        </p>
        <div className="flex flex-wrap gap-gap-sm">
          <Badge variant="secondary">{registry.length} components</Badge>
          <Badge variant="secondary">{registry.reduce((sum, entry) => sum + entry.examples.length, 0)} examples</Badge>
          <Badge variant="secondary">{stateCount} state matrices</Badge>
        </div>
      </header>

      {CATEGORIES.map((category) => (
        <section key={category} className="flex flex-col gap-stack-md">
          <h2 className="font-heading text-lg font-medium">{category}</h2>
          <div className="grid gap-gap-lg sm:grid-cols-2 xl:grid-cols-3">
            {registry
              .filter((entry) => entry.category === category)
              .map((entry) => {
                const Preview = entry.examples[0].Component
                return (
                  <a
                    key={entry.slug}
                    href={`#/${entry.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border-thin bg-card transition-colors hover:border-foreground/20"
                  >
                    {/* Thumbnails are decorative; the link itself is the interactive element. */}
                    <div
                      inert
                      aria-hidden
                      className="preview-surface flex h-40 items-center justify-center overflow-hidden border-b-thin p-inset-md"
                    >
                      <div className="pointer-events-none flex origin-center scale-[0.8] items-center justify-center">
                        <Preview />
                      </div>
                    </div>
                    <div className="flex flex-col p-inset-md">
                      <div className="flex items-center justify-between gap-gap-sm">
                        <h3 className="font-medium">{entry.name}</h3>
                        <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{entry.description}</p>
                    </div>
                  </a>
                )
              })}
          </div>
        </section>
      ))}
    </div>
  )
}
