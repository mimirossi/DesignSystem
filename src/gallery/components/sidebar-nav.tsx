import * as React from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { CATEGORIES, registry } from "@/gallery/registry"

export function SidebarNav({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  const [query, setQuery] = React.useState("")
  const matches = registry.filter((entry) => entry.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <nav aria-label="Components" className="flex flex-col gap-stack-md">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-text-secondary" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components"
          aria-label="Search components"
          className="pl-inset-xl"
        />
      </div>

      <a
        href="#/"
        onClick={onNavigate}
        className={cn(
          "rounded-md px-inset-sm py-inset-sm text-sm font-medium hover:bg-surface-muted",
          active === "" && "bg-surface-muted"
        )}
      >
        Overview
      </a>
      <a
        href="#/foundations"
        onClick={onNavigate}
        className={cn(
          "-mt-stack-md rounded-md px-inset-sm py-inset-sm text-sm font-medium hover:bg-surface-muted",
          active === "foundations" && "bg-surface-muted"
        )}
      >
        Foundations
      </a>

      {CATEGORIES.map((category) => {
        const items = matches.filter((entry) => entry.category === category)
        if (!items.length) return null
        return (
          <div key={category} className="flex flex-col gap-stack-xs">
            <h4 className="px-inset-sm pb-inset-xs text-xs font-medium tracking-wide text-text-secondary uppercase">
              {category}
            </h4>
            {items.map((entry) => (
              <a
                key={entry.slug}
                href={`#/${entry.slug}`}
                onClick={onNavigate}
                aria-current={active === entry.slug ? "page" : undefined}
                className={cn(
                  "rounded-md px-inset-sm py-inset-sm text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                  active === entry.slug && "bg-surface-muted font-medium text-text-primary"
                )}
              >
                {entry.name}
              </a>
            ))}
          </div>
        )
      })}

      {!matches.length && <p className="px-inset-sm text-sm text-text-secondary">No components found.</p>}
    </nav>
  )
}
