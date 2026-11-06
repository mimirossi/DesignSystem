import * as React from "react"
import { MenuIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "@/gallery/components/sidebar-nav"
import { ThemeToggle } from "@/gallery/components/theme-toggle"
import { ComponentPage } from "@/gallery/pages/component-page"
import { FoundationsPage } from "@/gallery/pages/foundations-page"
import { HomePage } from "@/gallery/pages/home-page"
import { findComponent } from "@/gallery/registry"
import { useHashRoute } from "@/gallery/use-hash-route"

export function App() {
  const route = useHashRoute()
  const entry = route ? findComponent(route) : undefined
  const [menuOpen, setMenuOpen] = React.useState(false)

  React.useEffect(() => {
    document.title = entry
      ? `${entry.name} · Design System`
      : route === "foundations"
        ? "Foundations · Design System"
        : "Design System"
  }, [entry, route])

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b-thin bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-gap-sm px-inset-md sm:px-inset-lg">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <XIcon /> : <MenuIcon />}
          </Button>
          <a href="#/" className="flex items-center gap-gap-sm font-heading font-semibold">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-xs text-primary-foreground">
              DS
            </span>
            Design System
          </a>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-screen-2xl">
        <aside
          className={
            menuOpen
              ? "fixed inset-x-0 top-14 bottom-0 z-30 overflow-y-auto bg-background p-inset-md lg:hidden"
              : "sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r-thin p-inset-md lg:block"
          }
        >
          <SidebarNav active={entry ? entry.slug : route} onNavigate={() => setMenuOpen(false)} />
        </aside>

        <main className="min-w-0 flex-1 px-inset-md py-inset-xl sm:px-inset-xl lg:py-inset-2xl">
          {entry ? (
            <ComponentPage key={entry.slug} entry={entry} />
          ) : route === "foundations" ? (
            <FoundationsPage />
          ) : route ? (
            <div className="flex flex-col gap-stack-xs">
              <h1 className="text-2xl font-semibold">Not found</h1>
              <p className="text-muted-foreground">
                No component called “{route}”. <a href="#/" className="underline">Back to overview</a>
              </p>
            </div>
          ) : (
            <HomePage />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
