import { ArrowRightIcon, Loader2Icon, MailIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-gap-sm">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}

export function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-gap-sm">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}

export function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-gap-sm">
      <Button>
        <MailIcon data-icon="inline-start" />
        Login with email
      </Button>
      <Button variant="outline">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="destructive">
        <TrashIcon data-icon="inline-start" />
        Delete
      </Button>
    </div>
  )
}

export function ButtonIconOnly() {
  return (
    <div className="flex flex-wrap items-center gap-gap-sm">
      <Button size="icon-xs" variant="outline" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button size="icon" variant="outline" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  )
}

export function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2Icon data-icon="inline-start" className="animate-spin" />
      Please wait
    </Button>
  )
}

export function ButtonAsLink() {
  return (
    <Button nativeButton={false} render={<a href="#/button" />}>
      Go to docs
    </Button>
  )
}
