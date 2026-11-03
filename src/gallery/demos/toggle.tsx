import { BoldIcon, BookmarkIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleDefault() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  )
}

export function ToggleOutlineWithText() {
  return (
    <Toggle variant="outline" aria-label="Bookmark">
      <BookmarkIcon data-icon="inline-start" />
      Bookmark
    </Toggle>
  )
}

export function ToggleSizes() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" variant="outline" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle size="lg" variant="outline" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
    </div>
  )
}

export function ToggleGroupMultiple() {
  return (
    <ToggleGroup multiple variant="outline" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export function ToggleGroupSingle() {
  return (
    <ToggleGroup defaultValue={["week"]} spacing={0} variant="outline">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  )
}
