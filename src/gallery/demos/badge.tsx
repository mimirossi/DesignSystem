import { BadgeCheckIcon, CheckIcon, ExternalLinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BadgeVariants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="highlight">Highlight</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  )
}

export function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">
        <BadgeCheckIcon data-icon="inline-start" />
        Verified
      </Badge>
      <Badge className="h-5 min-w-5 rounded-full px-1 tabular-nums">8</Badge>
      <Badge variant="destructive" className="h-5 min-w-5 rounded-full px-1 tabular-nums">
        99+
      </Badge>
    </div>
  )
}

export function BadgeHighlight() {
  return (
    <Badge variant="highlight">
      <CheckIcon data-icon="inline-start" />
      Tickets available
    </Badge>
  )
}

export function BadgeAsLink() {
  return (
    <Badge variant="outline" render={<a href="#/badge" />}>
      Changelog
      <ExternalLinkIcon data-icon="inline-end" />
    </Badge>
  )
}
