import * as React from "react"
import { ArrowRightIcon, CheckIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { copyToClipboard } from "@/gallery/lib/copy"
import { FAMILIES, STEPS, contrast, paletteHex, semanticRoles, typeRoles } from "@/gallery/lib/tokens"

function Section({ id, title, description, children }: {
  id: string
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="scroll-mt-20 font-heading text-xl font-medium tracking-tight">
          {title}
        </h2>
        {description && <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}

/* ---------- Palette ---------- */

function Palette() {
  return (
    <div className="flex flex-col gap-6">
      {FAMILIES.map((family) => (
        <div key={family.id} className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-medium">{family.label}</span>
            <span className="text-muted-foreground">{family.role}</span>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {STEPS.map((step) => {
              const hex = paletteHex(family.id, step)
              const token = `${family.id}-${step}`
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => copyToClipboard(`bg-${token}`, `bg-${token}`)}
                  className="group flex flex-col gap-1 rounded-control-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap"
                  aria-label={`Copy class bg-${token} (${hex})`}
                >
                  <span
                    className="h-12 w-full rounded-control-md ring-1 ring-foreground/10 ring-inset"
                    style={{ background: `var(--color-${token})` }}
                  />
                  <span className="font-mono text-xs">
                    {family.code}
                    {step}
                  </span>
                  <span className="font-mono text-[0.7rem] text-muted-foreground">{hex}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Semantic roles (from the Figma export) ---------- */

function Swatch({ hex }: { hex: string }) {
  return <span className="size-4 shrink-0 rounded-control-2xs ring-1 ring-foreground/20" style={{ background: hex }} />
}

function SemanticRoles() {
  const roles = semanticRoles()
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left">
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Light · Chiaro</th>
            <th className="px-4 py-3 font-medium">Dark · Scuro</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={`${role.group}.${role.name}`} className="border-b last:border-b-0">
              <td className="px-4 py-3 font-mono text-xs">
                {role.group}.{role.name}
              </td>
              {[role.light, role.dark].map((mode, i) => (
                <td key={i} className="px-4 py-3">
                  <span className="flex items-center gap-2 font-mono text-xs">
                    <Swatch hex={mode.hex} />
                    {mode.alias} <span className="text-muted-foreground">{mode.hex}</span>
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- Theme variables with live contrast ---------- */

const PAIRS = [
  { label: "Text", fg: "foreground", bg: "background" },
  { label: "Secondary text", fg: "muted-foreground", bg: "background" },
  { label: "Text on card", fg: "card-foreground", bg: "card" },
  { label: "Primary button label", fg: "primary-foreground", bg: "primary" },
  { label: "Secondary button label", fg: "secondary-foreground", bg: "secondary" },
  { label: "Link", fg: "link", bg: "background" },
  { label: "Link on card", fg: "link", bg: "card" },
  { label: "Highlight badge", fg: "highlight-foreground", bg: "highlight" },
  { label: "Green message text", fg: "highlight-text", bg: "background" },
  { label: "Control border (≥3:1)", fg: "input", bg: "background", ui: true },
  { label: "Focus ring (≥3:1)", fg: "ring", bg: "focus-gap", ui: true },
] as const

/** Resolves a theme variable inside `scope` to an sRGB string via a canvas. */
function resolveColor(scope: HTMLElement, variable: string) {
  const probe = document.createElement("span")
  probe.style.color = `var(--${variable})`
  scope.appendChild(probe)
  const css = getComputedStyle(probe).color
  probe.remove()
  const ctx = document.createElement("canvas").getContext("2d")!
  ctx.fillStyle = css
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `rgb(${r}, ${g}, ${b})`
}

function ContrastPanel({ mode }: { mode: "light" | "dark" }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [ratios, setRatios] = React.useState<number[]>([])

  React.useEffect(() => {
    const scope = ref.current!
    setRatios(PAIRS.map((pair) => contrast(resolveColor(scope, pair.fg), resolveColor(scope, pair.bg))))
  }, [])

  return (
    <div ref={ref} className={cn(mode, "flex flex-col gap-3 rounded-xl border bg-background p-4 text-foreground")}>
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">{mode === "light" ? "Chiaro" : "Scuro"}</p>
      <ul className="flex flex-col">
        {PAIRS.map((pair, i) => {
          const ratio = ratios[i] ?? 0
          const pass = ratio >= ("ui" in pair ? 3 : 4.5)
          return (
            <li key={pair.label} className="flex items-center gap-3 border-b py-2 last:border-b-0">
              <span
                className="grid h-8 w-12 shrink-0 place-items-center rounded-control-md text-sm font-semibold ring-1 ring-foreground/10"
                style={{ background: `var(--${pair.bg})`, color: `var(--${pair.fg})` }}
              >
                {"ui" in pair ? <span className="size-4 rounded-full border-3" style={{ borderColor: `var(--${pair.fg})` }} /> : "Aa"}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm">{pair.label}</span>
                <span className="truncate font-mono text-xs text-muted-foreground">
                  --{pair.fg} / --{pair.bg}
                </span>
              </span>
              <span className="font-mono text-xs tabular-nums">{ratio.toFixed(2)}:1</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-control-xs px-2 py-1 text-xs font-medium",
                  pass ? "bg-highlight text-highlight-foreground" : "bg-destructive/10 text-destructive"
                )}
              >
                {pass ? <CheckIcon className="size-3" /> : <XIcon className="size-3" />}
                {pass ? "Pass" : "Fail"}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ---------- Brand sample (mirrors the Figma "Esempi applicativi") ---------- */

function BrandSample({ mode }: { mode: "light" | "dark" }) {
  return (
    <div className={cn(mode, "flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground")}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs uppercase">{mode === "light" ? "Tema chiaro / S50" : "Tema scuro / N800"}</span>
        <Badge variant="highlight">
          <CheckIcon data-icon="inline-start" />
          Biglietti disponibili
        </Badge>
      </div>
      <h3 className="font-heading text-2xl font-bold tracking-tight">Ci vediamo sotto cassa.</h3>
      <p className="text-muted-foreground">Giovedì, dalle 23:00 · House e hardgroove. La notte LOCAMIMI comincia qui.</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg" data-force-focus="">
          Prendi il tuo posto
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="link">Scopri la line-up</Button>
      </div>
      <p className="text-xs text-muted-foreground">The primary button is shown in its focus state.</p>
    </div>
  )
}

/* ---------- Radius ---------- */

const CONTROL_SIZES = [
  { name: "control-2xs", height: 16, use: "Checkbox" },
  { name: "control-xs", height: 24, use: "Button xs, tooltip" },
  { name: "control-sm", height: 28, use: "Button sm, menu items, select sm" },
  { name: "control-md", height: 32, use: "Button, input, select, toggle" },
  { name: "control-lg", height: 36, use: "Button lg, tabs list" },
] as const

function readRatio() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--control-radius-ratio")) || 0.375
}

function RadiusScale() {
  const [ratio, setRatio] = React.useState(readRatio)

  const update = (value: number) => {
    setRatio(value)
    document.documentElement.style.setProperty("--control-radius-ratio", String(value))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Radius ratio · {ratio.toFixed(3)}</span>
          <span className="text-xs text-muted-foreground">
            Preview only — the whole gallery updates. Set <code className="font-mono">--control-radius-ratio</code> in index.css to keep a value.
          </span>
        </div>
        <Slider
          className="w-full sm:max-w-xs"
          min={0.125}
          max={0.5}
          step={0.0625}
          value={ratio}
          onValueChange={(value) => update(Array.isArray(value) ? value[0] : value)}
          aria-label="Radius ratio"
        />
        <Button variant="outline" size="sm" onClick={() => update(0.375)}>
          Reset
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40 text-left">
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-4 py-3 font-medium">Height</th>
              <th className="px-4 py-3 font-medium">Radius</th>
              <th className="px-4 py-3 font-medium">Used by</th>
              <th className="px-4 py-3 font-medium">Shape</th>
            </tr>
          </thead>
          <tbody>
            {CONTROL_SIZES.map((size) => (
              <tr key={size.name} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-mono text-xs">rounded-{size.name}</td>
                <td className="px-4 py-3 tabular-nums">{size.height}px</td>
                <td className="px-4 py-3 tabular-nums">{(size.height * ratio).toFixed(1)}px</td>
                <td className="px-4 py-3 text-muted-foreground">{size.use}</td>
                <td className="px-4 py-3">
                  <span
                    className="block w-24 border-2 border-primary bg-secondary"
                    style={{ height: size.height, borderRadius: `var(--radius-${size.name})` }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="preview-surface flex flex-wrap items-center gap-3 rounded-lg border p-6">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Input placeholder="Input" className="w-40" />
        <Checkbox defaultChecked aria-label="Checkbox" />
      </div>
    </div>
  )
}

/* ---------- Typography ---------- */

// Literal class names so Tailwind generates every type-* utility.
const TYPE_CLASS: Record<string, string> = {
  "display-xl": "type-display-xl",
  "display-l": "type-display-l",
  "titolo-1": "type-titolo-1",
  "titolo-2": "type-titolo-2",
  "titolo-3": "type-titolo-3",
  sottotitolo: "type-sottotitolo",
  lead: "type-lead",
  body: "type-body",
  "body-strong": "type-body-strong",
  caption: "type-caption",
  info: "type-info",
  label: "type-label",
}

const SCALES = [
  { value: 0.5, label: "Web · 0.5×" },
  { value: 0.75, label: "0.75×" },
  { value: 1, label: "Social · 1×" },
]

function readTypeScale() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--type-scale")) || 0.5
}

function TypeScale() {
  const [scale, setScale] = React.useState(readTypeScale)

  const update = (value: number) => {
    setScale(value)
    document.documentElement.style.setProperty("--type-scale", String(value))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Families</span>
          <span className="text-sm text-muted-foreground">
            <span className="font-display text-base uppercase">DAMN</span> for display and titles 1–2 ·{" "}
            <span className="font-semibold text-foreground">Bricolage Grotesque</span> for everything else, including all components.
          </span>
        </div>
        <div className="flex items-center gap-2" role="group" aria-label="Preview scale">
          {SCALES.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={scale === option.value ? "default" : "outline"}
              aria-pressed={scale === option.value}
              onClick={() => update(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        {typeRoles().map((role) => {
          const className = TYPE_CLASS[role.name]
          return (
            <div key={role.name} className="grid gap-4 border-b py-6 last:border-b-0 lg:grid-cols-[14rem_1fr]">
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium">{role.label}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(className, className)}
                  className="w-fit rounded-control-xs font-mono text-xs text-link underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap"
                >
                  {className}
                </button>
                <span className="text-xs text-muted-foreground">
                  {role.family} {role.style} · {Math.round(role.size * scale * 10) / 10}px
                </span>
                <span className="text-xs text-muted-foreground">
                  Line height {role.lineHeight} · tracking {role.letterSpacing}
                  {role.uppercase && " · uppercase"}
                </span>
              </div>
              <p className={cn(className, "min-w-0 break-words")}>
                {role.size >= 96 ? "Sotto cassa" : role.name === "info" ? "Giovedì · 23:00" : "Ci vediamo sotto cassa, la notte comincia qui."}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Spacing ---------- */

function SpacingScale() {
  const steps = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step) => (
        <div key={step} className="flex items-center gap-4 text-sm">
          <span className="w-16 font-mono text-xs">{step}</span>
          <span className="w-12 text-xs text-muted-foreground tabular-nums">{step * 4}px</span>
          <span className="h-4 rounded-sm bg-primary" style={{ width: `calc(var(--spacing) * ${step})` }} />
        </div>
      ))}
    </div>
  )
}

/* ---------- Page ---------- */

export function FoundationsPage() {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <Badge variant="outline">Foundations</Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Color, type, radius & spacing</h1>
        <p className="max-w-2xl text-muted-foreground">
          The LOCAMIMI tokens behind every component. Colors come straight from the Figma exports in{" "}
          <code className="font-mono text-sm">tokens/</code>; contrast ratios are computed live from the rendered theme.
        </p>
      </header>

      <Section id="sample" title="In context" description="The Figma application example, rebuilt with the components in both themes.">
        <div className="grid gap-4 lg:grid-cols-2">
          <BrandSample mode="light" />
          <BrandSample mode="dark" />
        </div>
      </Section>

      <Section
        id="typography"
        title="Typography"
        description="Twelve roles from the Figma type scale. Sizes use the web scale (0.5× the Figma Social values, set by --type-scale in index.css); the buttons preview other scales."
      >
        <TypeScale />
      </Section>

      <Section id="palette" title="Tonal scales" description="Five families, ten steps each. Click a swatch to copy its Tailwind class.">
        <Palette />
      </Section>

      <Section
        id="contrast"
        title="Theme contrast"
        description="How the shadcn/ui variables map onto the roles, checked against WCAG AA: 4.5:1 for text, 3:1 for control borders and focus rings."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <ContrastPanel mode="light" />
          <ContrastPanel mode="dark" />
        </div>
      </Section>

      <Section id="roles" title="Semantic roles" description="As defined in Figma (LOCAMIMI — Ruoli semantici).">
        <SemanticRoles />
      </Section>

      <Section
        id="radius"
        title="Radius scales with height"
        description="Every control's corner radius is its height × one ratio, so small and large controls keep the same shape."
      >
        <RadiusScale />
      </Section>

      <Section id="spacing" title="Spacing · 4px grid" description="All component padding, gaps and heights are multiples of 4px (Tailwind spacing unit = 4px).">
        <SpacingScale />
      </Section>
    </div>
  )
}
