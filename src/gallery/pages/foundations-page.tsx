import * as React from "react"
import { ArrowRightIcon, CheckIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { copyToClipboard } from "@/gallery/lib/copy"
import {
  FAMILIES,
  STEPS,
  contrast,
  paletteHex,
  semanticRoles,
  gridModes,
  radiusTokens,
  spacingPrimitives,
  spacingRoles,
  typeRoles,
} from "@/gallery/lib/tokens"

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-stack-md">
      <div className="flex flex-col gap-stack-xs">
        <h2
          id={id}
          className="scroll-mt-20 font-heading text-xl font-medium tracking-tight"
        >
          {title}
        </h2>
        {description && (
          <p className="max-w-3xl text-sm text-text-secondary">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

/* ---------- Palette ---------- */

function Palette() {
  return (
    <div className="flex flex-col gap-stack-md">
      {FAMILIES.map((family) => (
        <div key={family.id} className="flex flex-col gap-stack-xs">
          <div className="flex items-baseline gap-gap-sm text-sm">
            <span className="font-medium">{family.label}</span>
            <span className="text-text-secondary">{family.role}</span>
          </div>
          <div className="grid grid-cols-5 gap-gap-sm tablet:grid-cols-10">
            {STEPS.map((step) => {
              const hex = paletteHex(family.id, step)
              const token = `${family.id}-${step}`
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => copyToClipboard(`bg-${token}`, `bg-${token}`)}
                  className="group flex flex-col gap-stack-xs rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap"
                  aria-label={`Copy class bg-${token} (${hex})`}
                >
                  <span
                    className="h-12 w-full rounded-md ring-thin ring-text-primary/10 ring-inset"
                    style={{ background: `var(--color-${token})` }}
                  />
                  <span className="font-mono text-xs">
                    {family.code}
                    {step}
                  </span>
                  <span className="font-mono text-[0.7rem] text-text-secondary">
                    {hex}
                  </span>
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
  return (
    <span
      className="size-4 shrink-0 rounded-xs ring-thin ring-text-primary/20"
      style={{ background: hex }}
    />
  )
}

function SemanticRoles() {
  const roles = semanticRoles()
  return (
    <div className="overflow-x-auto rounded-lg border-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-thin bg-surface-muted/40 text-left">
            <th className="px-inset-md py-inset-sm-md font-medium">Role</th>
            <th className="px-inset-md py-inset-sm-md font-medium">Light · Chiaro</th>
            <th className="px-inset-md py-inset-sm-md font-medium">Dark · Scuro</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr
              key={`${role.group}.${role.name}`}
              className="border-b-thin last:border-b-0"
            >
              <td className="px-inset-md py-inset-sm-md font-mono text-xs">
                {role.group}.{role.name}
              </td>
              {[role.light, role.dark].map((mode, i) => (
                <td key={i} className="px-inset-md py-inset-sm-md">
                  <span className="flex items-center gap-gap-sm font-mono text-xs">
                    <Swatch hex={mode.hex} />
                    {mode.alias}{" "}
                    <span className="text-text-secondary">{mode.hex}</span>
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
  {
    label: "Secondary button label",
    fg: "secondary-foreground",
    bg: "secondary",
  },
  { label: "Link", fg: "link", bg: "background" },
  { label: "Link on card", fg: "link", bg: "card" },
  { label: "Highlight badge", fg: "highlight-foreground", bg: "highlight" },
  { label: "Green message text", fg: "highlight-text", bg: "background" },
  { label: "Control border-thin (≥3:1)", fg: "input", bg: "background", ui: true },
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
    setRatios(
      PAIRS.map((pair) =>
        contrast(resolveColor(scope, pair.fg), resolveColor(scope, pair.bg))
      )
    )
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        mode,
        "flex flex-col gap-stack-sm rounded-xl border-thin bg-background-default p-inset-md text-text-primary"
      )}
    >
      <p className="font-mono text-xs tracking-wide text-text-secondary uppercase">
        {mode === "light" ? "Chiaro" : "Scuro"}
      </p>
      <ul className="flex flex-col">
        {PAIRS.map((pair, i) => {
          const ratio = ratios[i] ?? 0
          const pass = ratio >= ("ui" in pair ? 3 : 4.5)
          return (
            <li
              key={pair.label}
              className="flex items-center gap-gap-sm border-b-thin py-inset-sm last:border-b-0"
            >
              <span
                className="grid h-8 w-12 shrink-0 place-items-center rounded-md text-sm font-semibold ring-thin ring-text-primary/10"
                style={{
                  background: `var(--${pair.bg})`,
                  color: `var(--${pair.fg})`,
                }}
              >
                {"ui" in pair ? (
                  <span
                    className="size-4 rounded-full border-3"
                    style={{ borderColor: `var(--${pair.fg})` }}
                  />
                ) : (
                  "Aa"
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm">{pair.label}</span>
                <span className="truncate font-mono text-xs text-text-secondary">
                  --{pair.fg} / --{pair.bg}
                </span>
              </span>
              <span className="font-mono text-xs tabular-nums">
                {ratio.toFixed(2)}:1
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-gap-xs rounded-sm px-inset-sm py-inset-xs text-xs font-medium",
                  pass
                    ? "bg-accent-default text-accent-on-accent"
                    : "bg-feedback-error/10 text-feedback-error"
                )}
              >
                {pass ? (
                  <CheckIcon className="size-3" />
                ) : (
                  <XIcon className="size-3" />
                )}
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
    <div
      className={cn(
        mode,
        "@container flex flex-col gap-stack-lg rounded-xl border-thin bg-surface-default p-inset-lg text-text-primary"
      )}
    >
      <div className="flex flex-col gap-stack-md">
        <div className="flex items-center justify-between gap-gap-sm">
          <span className="font-mono text-xs uppercase">
            {mode === "light" ? "Tema chiaro / S50" : "Tema scuro / N800"}
          </span>
          <Badge variant="highlight">
            <CheckIcon data-icon="inline-start" />
            Biglietti disponibili
          </Badge>
        </div>
        <div className="flex flex-col">
          <h3 className="font-heading text-2xl font-bold tracking-tight">
            Ci vediamo sotto cassa.
          </h3>
          <p className="text-text-secondary">
            Giovedì, dalle 23:00 · House e hardgroove. La notte LOCAMIMI
            comincia qui.
          </p>
        </div>
      </div>
      {/* Stacks below 28rem of card width instead of wrapping, so the
          distances stay on tokens: stack-sm stacked, gap-md side by side. */}
      <div className="flex flex-col items-start gap-stack-sm @tablet:flex-row @tablet:items-center @tablet:gap-gap-md">
        <Button size="lg" data-force-focus="">
          Prendi il tuo posto
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="link">Scopri la line-up</Button>
      </div>
    </div>
  )
}

/* ---------- Radius ---------- */

// Which components use each step. Literal class names so Tailwind generates them.
const RADIUS_USE: Record<string, { className: string; use: string }> = {
  none: {
    className: "rounded-none",
    use: "Joined edges (toggle group, tabs line)",
  },
  xs: { className: "rounded-xs", use: "Checkbox, tooltip arrow" },
  sm: {
    className: "rounded-sm",
    use: "Button xs/sm, menu and select items, tabs trigger, tooltip",
  },
  md: {
    className: "rounded-md",
    use: "Button, input, select, textarea, toggle, menus, tabs list",
  },
  lg: { className: "rounded-lg", use: "Popover, alert, small panels" },
  xl: { className: "rounded-xl", use: "Card, dialog" },
  "2xl": { className: "rounded-2xl", use: "Large surfaces" },
  full: {
    className: "rounded-full",
    use: "Badge, avatar, switch, slider, radio",
  },
}

function RadiusScale() {
  return (
    <div className="flex flex-col gap-stack-md">
      <div className="overflow-x-auto rounded-lg border-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-thin bg-surface-muted/40 text-left">
              <th className="px-inset-md py-inset-sm-md font-medium">Class</th>
              <th className="px-inset-md py-inset-sm-md font-medium">Value</th>
              <th className="px-inset-md py-inset-sm-md font-medium">Figma</th>
              <th className="px-inset-md py-inset-sm-md font-medium">Used by</th>
              <th className="px-inset-md py-inset-sm-md font-medium">Shape</th>
            </tr>
          </thead>
          <tbody>
            {radiusTokens().map((token) => {
              const role = RADIUS_USE[token.name]
              return (
                <tr key={token.name} className="border-b-thin last:border-b-0">
                  <td className="px-inset-md py-inset-sm-md">
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(role.className, role.className)
                      }
                      className="rounded-sm text-left font-mono text-xs text-text-link underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap"
                    >
                      {role.className}
                    </button>
                  </td>
                  <td className="px-inset-md py-inset-sm-md tabular-nums">
                    {token.px >= 9999 ? "pill" : `${token.px}px`}
                  </td>
                  <td className="px-inset-md py-inset-sm-md font-mono text-xs text-text-secondary">
                    {token.alias}
                  </td>
                  <td className="px-inset-md py-inset-sm-md text-text-secondary">
                    {role.use}
                  </td>
                  <td className="px-inset-md py-inset-sm-md">
                    <span
                      className={cn(
                        "block h-10 w-24 border-default border-action-primary bg-action-secondary-surface",
                        role.className
                      )}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="preview-surface flex flex-wrap items-center gap-gap-sm rounded-lg border-thin p-inset-lg">
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

function TypeScale() {
  return (
    <div className="flex flex-col gap-stack-md">
      <div className="flex flex-col gap-stack-sm rounded-xl border-thin p-inset-md tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex flex-col gap-stack-xs">
          <span className="text-sm font-medium">Families</span>
          <span className="text-sm text-text-secondary">
            <span className="font-display text-base uppercase">DAMN</span> for
            display and titles 1–2 ·{" "}
            <span className="font-semibold text-text-primary">
              Bricolage Grotesque
            </span>{" "}
            for everything else, including all components.
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        {typeRoles().map((role) => {
          const className = TYPE_CLASS[role.name]
          return (
            <div
              key={role.name}
              className="grid gap-stack-md border-b-thin py-inset-lg last:border-b-0 desktop:grid-cols-[14rem_1fr]"
            >
              <div className="flex flex-col gap-stack-xs text-sm">
                <span className="font-medium">{role.label}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(className, className)}
                  className="w-fit rounded-sm font-mono text-xs text-text-link underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap"
                >
                  {className}
                </button>
                <span className="text-xs text-text-secondary">
                  {role.family} {role.style} ·{" "}
                  {role.size}px
                </span>
                <span className="text-xs text-text-secondary">
                  Line height {role.lineHeight} · tracking {role.letterSpacing}
                  {role.uppercase && " · uppercase"}
                </span>
              </div>
              <p className={cn(className, "min-w-0 break-words")}>
                {role.size >= 48
                  ? "Sotto cassa"
                  : role.name === "info"
                    ? "Giovedì · 23:00"
                    : "Ci vediamo sotto cassa, la notte comincia qui."}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Spacing ---------- */

// Literal class names per role so Tailwind generates each utility.
const SPACING_CLASS: Record<string, string> = {
  inset: "p-inset-{name}",
  gap: "gap-gap-{name}",
  stack: "gap-stack-{name}",
  section: "gap-section-{name}",
}

function ProximityExample() {
  return (
    <div className="grid gap-gap-lg desktop:grid-cols-[1fr_16rem]">
      <div className="preview-surface rounded-lg border-thin p-inset-lg">
        <div className="flex max-w-sm flex-col gap-stack-lg rounded-xl bg-surface-default p-inset-lg ring-thin ring-text-primary/10">
          <div className="flex flex-col gap-stack-md">
            <div className="flex flex-col gap-stack-xs">
              <h3 className="font-heading text-lg font-semibold">
                Prenota il tuo tavolo
              </h3>
              <p className="text-sm text-text-secondary">
                Giovedì, dalle 23:00 · Sotto cassa
              </p>
            </div>
            <div className="flex flex-col gap-stack-sm">
              <div className="flex flex-col gap-stack-xs">
                <Label htmlFor="proximity-name">Nome</Label>
                <Input id="proximity-name" placeholder="Ada Lovelace" />
              </div>
              <div className="flex flex-col gap-stack-xs">
                <Label htmlFor="proximity-guests">Ospiti</Label>
                <Input id="proximity-guests" placeholder="2" />
              </div>
            </div>
          </div>
          <div className="flex gap-gap-sm">
            <Button>Prenota</Button>
            <Button variant="outline">Annulla</Button>
          </div>
        </div>
      </div>
      <ol className="flex flex-col gap-stack-sm text-sm">
        {[
          [
            "stack-xs · 4px",
            "Title ↔ subtitle, label ↔ field: one piece of information.",
          ],
          ["stack-sm · 8px", "Field ↔ field: related, but separate items."],
          [
            "stack-md · 16px",
            "Title ↔ fields: header and content of the same form.",
          ],
          [
            "stack-lg · 24px",
            "Form ↔ CTA: the actions come after the content.",
          ],
          ["gap-sm · 8px", "Actions side by side."],
          ["inset-lg · 24px", "Padding of the container."],
          [
            "section-* · 48–128px",
            "Only between page sections, never inside a component.",
          ],
        ].map(([token, rule]) => (
          <li
            key={token}
            className="flex flex-col gap-gap-xs border-l-default border-action-primary pl-inset-sm"
          >
            <code className="font-mono text-xs">{token}</code>
            <span className="text-text-secondary">{rule}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function SpacingScale() {
  return (
    <div className="flex flex-col gap-stack-xl">
      <ProximityExample />

      <div className="grid gap-gap-lg tablet:grid-cols-2">
        {spacingRoles().map(({ group, description, roles }) => (
          <div
            key={group}
            className="flex flex-col gap-stack-sm rounded-xl border-thin p-inset-md"
          >
            <div className="flex flex-col gap-stack-xs">
              <span className="font-mono text-sm font-medium">{group}-*</span>
              <span className="text-xs text-text-secondary">
                {description}
              </span>
            </div>
            <ul className="flex flex-col gap-stack-xs">
              {roles.map((role) => {
                const className = SPACING_CLASS[group].replace(
                  "{name}",
                  role.name
                )
                return (
                  <li
                    key={role.name}
                    className="flex items-center gap-gap-md text-sm"
                  >
                    <button
                      type="button"
                      onClick={() => copyToClipboard(className, className)}
                      className="w-32 shrink-0 rounded-sm text-left font-mono text-xs text-text-link underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-3 focus-visible:ring-offset-focus-gap"
                    >
                      {className}
                    </button>
                    <span className="w-12 shrink-0 text-xs text-text-secondary tabular-nums">
                      {role.px}px
                    </span>
                    <span
                      className="h-3 rounded-sm bg-action-primary"
                      style={{ width: Math.max(role.px, 1) }}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-stack-sm">
        <span className="text-sm font-medium">Primitives · space/*</span>
        <div className="flex flex-wrap items-end gap-gap-md">
          {spacingPrimitives().map((px) => (
            <div key={px} className="flex flex-col items-center gap-stack-xs">
              <span
                className="bg-action-primary"
                style={{
                  width: Math.max(px / 2, 1),
                  height: Math.max(px / 2, 1),
                }}
              />
              <span className="font-mono text-xs text-text-secondary">
                {px}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Breakpoints & grid ---------- */

const PREFIX: Record<string, string> = {
  mobile: "(none)",
  tablet: "tablet:",
  desktop: "desktop:",
}

function GridScale() {
  return (
    <div className="flex flex-col gap-stack-md">
      <div className="overflow-x-auto rounded-lg border-thin">
        <table className="w-full type-body">
          <thead>
            <tr className="border-b-thin bg-surface-muted/40 text-left">
              <th className="px-inset-md py-inset-sm-md type-body-strong">Device</th>
              <th className="px-inset-md py-inset-sm-md type-body-strong">Prefix</th>
              <th className="px-inset-md py-inset-sm-md type-body-strong">From</th>
              <th className="px-inset-md py-inset-sm-md type-body-strong">Design width</th>
              <th className="px-inset-md py-inset-sm-md type-body-strong">Columns</th>
              <th className="px-inset-md py-inset-sm-md type-body-strong">Gutter</th>
              <th className="px-inset-md py-inset-sm-md type-body-strong">Margin</th>
              <th className="px-inset-md py-inset-sm-md type-body-strong">Container</th>
            </tr>
          </thead>
          <tbody>
            {gridModes().map((mode) => (
              <tr key={mode.name} className="border-b-thin last:border-b-0">
                <td className="px-inset-md py-inset-sm-md capitalize">{mode.name}</td>
                <td className="px-inset-md py-inset-sm-md font-mono type-caption">
                  {PREFIX[mode.name]}
                </td>
                <td className="px-inset-md py-inset-sm-md tabular-nums">{mode.minWidth}px</td>
                <td className="px-inset-md py-inset-sm-md tabular-nums">{mode.referenceWidth}px</td>
                <td className="px-inset-md py-inset-sm-md tabular-nums">{mode.columns}</td>
                <td className="px-inset-md py-inset-sm-md tabular-nums">{mode.gutter}px</td>
                <td className="px-inset-md py-inset-sm-md tabular-nums">{mode.margin}px</td>
                <td className="px-inset-md py-inset-sm-md tabular-nums">max {mode.containerMax}px</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-stack-xs">
        <span className="type-body-strong">Live grid · current device</span>
        <div className="layout-grid rounded-lg border-thin p-inset-sm">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="h-12 rounded-xs bg-action-secondary-surface [&:nth-child(n+5)]:hidden tablet:[&:nth-child(n+5)]:block tablet:[&:nth-child(n+9)]:hidden desktop:[&:nth-child(n+9)]:block"
            />
          ))}
        </div>
        <span className="type-caption text-text-secondary">
          <code className="font-mono">layout-container</code> centres the page ·{" "}
          <code className="font-mono">layout-grid</code> gives columns and gutter ·{" "}
          <code className="font-mono">gap-gutter</code> and{" "}
          <code className="font-mono">px-margin</code> reuse the same values.
        </span>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

export function FoundationsPage() {
  return (
    <div className="flex flex-col gap-section-md">
      <header className="flex flex-col gap-stack-sm">
        <Badge variant="outline">Foundations</Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Color, type, radius & spacing
        </h1>
        <p className="max-w-2xl text-text-secondary">
          The LOCAMIMI tokens behind every component. Colors come straight from
          the Figma exports in{" "}
          <code className="font-mono text-sm">tokens/</code>; contrast ratios
          are computed live from the rendered theme.
        </p>
      </header>

      <Section
        id="sample"
        title="In context"
        description="The Figma application example, rebuilt with the components in both themes."
      >
        <div className="flex flex-col gap-stack-xs">
          <div className="grid gap-gap-lg desktop:grid-cols-2">
            <BrandSample mode="light" />
            <BrandSample mode="dark" />
          </div>
          <p className="text-xs text-text-secondary">
            The primary button is shown in its focus state.
          </p>
        </div>
      </Section>

      <Section
        id="typography"
        title="Typography"
        description="Twelve roles from Figma (LOCAMIMI — Tipografia — Web). Social and Print keep their own sizes in Figma."
      >
        <TypeScale />
      </Section>

      <Section
        id="palette"
        title="Tonal scales"
        description="Five families, ten steps each. Click a swatch to copy its Tailwind class."
      >
        <Palette />
      </Section>

      <Section
        id="contrast"
        title="Theme contrast"
        description="How the shadcn/ui variables map onto the roles, checked against WCAG AA: 4.5:1 for text, 3:1 for control borders and focus rings."
      >
        <div className="grid gap-gap-lg desktop:grid-cols-2">
          <ContrastPanel mode="light" />
          <ContrastPanel mode="dark" />
        </div>
      </Section>

      <Section
        id="roles"
        title="Semantic roles"
        description="As defined in Figma (LOCAMIMI — Ruoli semantici)."
      >
        <SemanticRoles />
      </Section>

      <Section
        id="radius"
        title="Radius"
        description="One fixed scale from Figma (radius/*) for every component. Nested surfaces stay concentric: outer radius = inner radius + padding."
      >
        <RadiusScale />
      </Section>

      <Section
        id="spacing"
        title="Spacing"
        description="Distance expresses relationship: the more related two elements are, the closer they sit. Every value is on the 4px grid; use the role tokens, not raw numbers."
      >
        <SpacingScale />
      </Section>

      <Section
        id="grid"
        title="Breakpoints & grid"
        description="Three devices from Figma (Web — Breakpoint, Web — Griglie). Tailwind's default breakpoints are off: use tablet: and desktop:."
      >
        <GridScale />
      </Section>
    </div>
  )
}
