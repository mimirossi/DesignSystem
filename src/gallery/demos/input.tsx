import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function InputDefault() {
  return <Input type="email" placeholder="Email" className="max-w-xs" />
}

export function InputWithLabel() {
  return (
    <div className="grid w-full max-w-xs gap-stack-xs">
      <Label htmlFor="input-email">Email</Label>
      <Input id="input-email" type="email" placeholder="you@example.com" />
      <p className="text-xs text-muted-foreground">We'll never share your email.</p>
    </div>
  )
}

export function InputInvalid() {
  return (
    <div className="grid w-full max-w-xs gap-stack-xs">
      <Label htmlFor="input-username">Username</Label>
      <Input id="input-username" defaultValue="a" aria-invalid aria-describedby="input-username-error" />
      <p id="input-username-error" className="text-xs text-destructive">
        Username must be at least 3 characters.
      </p>
    </div>
  )
}

export function InputWithButton() {
  return (
    <div className="flex w-full max-w-sm items-center gap-gap-sm">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search…" className="pl-8" />
      </div>
      <Button>Search</Button>
    </div>
  )
}

export function InputFile() {
  return (
    <div className="grid w-full max-w-xs gap-stack-xs">
      <Label htmlFor="input-file">Picture</Label>
      <Input id="input-file" type="file" />
    </div>
  )
}

export function TextareaDefault() {
  return <Textarea placeholder="Type your message here." className="max-w-sm" />
}

export function TextareaWithLabel() {
  return (
    <div className="grid w-full max-w-sm gap-stack-xs">
      <Label htmlFor="textarea-message">Your message</Label>
      <Textarea id="textarea-message" placeholder="Type your message here." />
      <Button className="justify-self-end">Send message</Button>
    </div>
  )
}
