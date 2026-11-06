import { ArrowRightIcon, MoreHorizontalIcon, PlayIcon } from "lucide-react"
import coppa from "@/assets/covers/coppa.svg?raw"
import cuoreOcchiolino from "@/assets/covers/cuore-occhiolino.svg?raw"
import cuorePalpebre from "@/assets/covers/cuore-palpebre.svg?raw"
import cuoreSocchiuso from "@/assets/covers/cuore-socchiuso.svg?raw"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardIllustration,
  CardOverlay,
  CardTitle,
} from "@/components/ui/card"
import { CoverCarousel } from "@/components/ui/cover-carousel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CardBasic() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>Everything your team needs to ship faster.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="More options">
            <MoreHorizontalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          $24<span className="text-sm font-normal text-muted-foreground">/user/month</span>
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Upgrade</Button>
      </CardFooter>
    </Card>
  )
}

export function CardForm() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-stack-sm">
        <div className="grid gap-stack-xs">
          <Label htmlFor="card-email">Email</Label>
          <Input id="card-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="grid gap-stack-xs">
          <Label htmlFor="card-password">Password</Label>
          <Input id="card-password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-stack-sm">
        <Button className="w-full">Login</Button>
        <Button variant="outline" className="w-full">
          Create account
        </Button>
      </CardFooter>
    </Card>
  )
}

export function CardSmall() {
  return (
    <Card size="sm" className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>Small card</CardTitle>
        <CardDescription>Uses tighter spacing for dense layouts.</CardDescription>
      </CardHeader>
      <CardContent>Content goes here.</CardContent>
    </Card>
  )
}

export function CardCoverImage() {
  return (
    <Card variant="cover" className="w-72">
      <CardIllustration svg={cuorePalpebre} label="LOCAMIMI heart with lowered eyelids" className="text-brand" />
      <CardOverlay>
        <div className="grid">
          <CardTitle>Sotto cassa</CardTitle>
          <CardDescription>House e hardgroove · Giovedì 23:00</CardDescription>
        </div>
        <Button className="w-fit">
          Prendi il tuo posto
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </CardOverlay>
    </Card>
  )
}

export function CardCoverSurface() {
  return (
    <Card variant="cover" className="w-72 bg-rosa-chiaro-200">
      <div className="absolute inset-0 -z-10 grid place-items-center">
        <span className="type-titolo-2 text-rosa-700">Vol. 3</span>
      </div>
      <CardOverlay>
        <div className="grid">
          <CardTitle>Vol. 3 — Afterhours</CardTitle>
          <CardDescription>12 tracce · 54 min</CardDescription>
        </div>
        <Button variant="link" className="w-fit">
          Ascolta la tracklist
        </Button>
      </CardOverlay>
    </Card>
  )
}

export function CardCoverGrid() {
  const releases = [
    { title: "Sotto cassa", artist: "LOCAMIMI", cover: cuorePalpebre, tone: "text-brand" },
    { title: "Socchiuso", artist: "Verde Club", cover: cuoreSocchiuso, tone: "text-highlight-text" },
    { title: "Occhiolino", artist: "N900 Sound", cover: cuoreOcchiolino, tone: "text-primary" },
    { title: "Aperitivo", artist: "Coppa Records", cover: coppa, tone: "text-foreground" },
  ]

  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-gap-xl sm:grid-cols-2">
      {releases.map((release) => (
        <Card key={release.title} variant="cover" size="sm">
          <CardIllustration svg={release.cover} className={release.tone} />
          <CardOverlay>
            <div className="grid">
              <CardTitle>{release.title}</CardTitle>
              <CardDescription>{release.artist}</CardDescription>
            </div>
            <Button size="icon" aria-label={`Play ${release.title}`}>
              <PlayIcon />
            </Button>
          </CardOverlay>
        </Card>
      ))}
    </div>
  )
}

export function CardCoverCarousel() {
  const items = [
    {
      id: "sotto-cassa",
      title: "Sotto cassa",
      subtitle: "LOCAMIMI · Giovedì 23:00",
      description: "House e hardgroove fino all'alba. La notte LOCAMIMI comincia qui.",
      illustration: cuorePalpebre,
      tone: "text-brand",
      cta: { label: "Prendi il tuo posto" },
    },
    {
      id: "socchiuso",
      title: "Socchiuso",
      subtitle: "Verde Club · Venerdì 22:00",
      description: "Un set lento e ipnotico, per chi arriva presto e resta tardi.",
      illustration: cuoreSocchiuso,
      tone: "text-highlight-text",
      cta: { label: "Scopri la line-up" },
    },
    {
      id: "occhiolino",
      title: "Occhiolino",
      subtitle: "N900 Sound · Sabato 23:30",
      description: "Disco, edit e qualche sorpresa. Dress code: brillare.",
      illustration: cuoreOcchiolino,
      tone: "text-primary",
      cta: { label: "Biglietti" },
    },
    {
      id: "aperitivo",
      title: "Aperitivo",
      subtitle: "Coppa Records · Domenica 18:00",
      description: "Vinili, spritz e tramonto in terrazza.",
      illustration: coppa,
      tone: "text-foreground",
      cta: { label: "Prenota un tavolo" },
    },
    {
      id: "after",
      title: "After",
      subtitle: "LOCAMIMI · Domenica 04:00",
      description: "Per chi non vuole ancora tornare a casa.",
      illustration: cuorePalpebre,
      tone: "text-foreground",
      cta: { label: "Mettiti in lista" },
    },
  ]

  return <CoverCarousel items={items} />
}

export function AvatarBasic() {
  return (
    <div className="flex items-center gap-gap-md">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge className="bg-green-600 dark:bg-green-500" />
      </Avatar>
    </div>
  )
}

export function AvatarSizes() {
  return (
    <div className="flex items-center gap-gap-md">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  )
}

export function AvatarGroupDemo() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  )
}

export function AccordionBasic() {
  return (
    <Accordion defaultValue={["item-1"]} className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It follows the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It uses the design system tokens by default.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" disabled>
        <AccordionTrigger>Is it disabled?</AccordionTrigger>
        <AccordionContent>This item can't be opened.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function AccordionMultiple() {
  return (
    <Accordion multiple defaultValue={["shipping", "returns"]} className="w-full max-w-md">
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>We ship worldwide within 3–5 business days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>Returns are free for 30 days after delivery.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export function TabsDefault() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-sm text-muted-foreground">
        Manage your account details.
      </TabsContent>
      <TabsContent value="password" className="text-sm text-muted-foreground">
        Change your password.
      </TabsContent>
    </Tabs>
  )
}

export function TabsLine() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        Overview content.
      </TabsContent>
      <TabsContent value="analytics" className="text-sm text-muted-foreground">
        Analytics content.
      </TabsContent>
      <TabsContent value="reports" className="text-sm text-muted-foreground">
        Reports content.
      </TabsContent>
    </Tabs>
  )
}

export function TabsVertical() {
  return (
    <Tabs defaultValue="general" orientation="vertical" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="text-sm text-muted-foreground">
        General settings.
      </TabsContent>
      <TabsContent value="security" className="text-sm text-muted-foreground">
        Security settings.
      </TabsContent>
      <TabsContent value="team" className="text-sm text-muted-foreground">
        Team settings.
      </TabsContent>
    </Tabs>
  )
}

export function SeparatorDemo() {
  return (
    <div className="w-full max-w-xs">
      <div className="space-y-stack-xs">
        <h4 className="text-sm font-medium">Design System</h4>
        <p className="text-sm text-muted-foreground">Components built on shadcn/ui.</p>
      </div>
      <Separator className="my-stack-sm" />
      <div className="flex h-5 items-center gap-gap-md text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
        <Separator orientation="vertical" />
        <span>Changelog</span>
      </div>
    </div>
  )
}

export function ScrollAreaVertical() {
  const tags = Array.from({ length: 40 }, (_, i) => `v1.2.0-beta.${40 - i}`)

  return (
    <ScrollArea className="h-64 w-48 rounded-md border-thin">
      <div className="p-inset-md">
        <h4 className="mb-stack-sm text-sm font-medium">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-stack-xs" />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export function ScrollAreaHorizontal() {
  const colors = ["Slate", "Red", "Orange", "Amber", "Lime", "Emerald", "Cyan", "Blue", "Violet", "Pink"]

  return (
    <ScrollArea className="w-full max-w-sm rounded-md border-thin whitespace-nowrap">
      <div className="flex w-max gap-gap-md p-inset-md">
        {colors.map((color) => (
          <div key={color} className="flex h-24 w-32 items-end rounded-md bg-muted p-inset-sm text-sm">
            {color}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
