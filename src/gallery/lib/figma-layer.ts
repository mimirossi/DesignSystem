/*
 * Builds one self-contained .tsx for a Figma Sites code layer / code file.
 *
 * A code layer is a single file with its own Tailwind v4 (default theme),
 * npm packages installed on import, and no project CSS or "@/" alias. So the
 * file must carry everything:
 *   - the LOCAMIMI theme as CSS variables, computed from tokens/*.tokens.json
 *   - the component and every component it imports, inlined
 *   - classes rewritten to Tailwind's arbitrary-value form, pointing at those
 *     variables (bg-action-primary → bg-(color:--action-primary))
 *   - the gallery examples as exported, themed components to place on canvas
 */

type Json = Record<string, unknown>
type Token = { $value: unknown; $description?: string }

const tokenFiles = import.meta.glob<Json>("../../../tokens/*.tokens.json", {
  eager: true,
  import: "default",
})
const codeFiles = import.meta.glob<string>("../../components/**/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
})
const assetFiles = import.meta.glob<string>("../../assets/**/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
})

const tokens = (name: string) => tokenFiles[`../../../tokens/${name}.tokens.json`]

function flat(group: Json, prefix = ""): [string, Token][] {
  return Object.entries(group).flatMap(([key, value]) => {
    if (key.startsWith("$")) return []
    const v = value as Json
    return "$value" in v ? [[prefix + key, v as unknown as Token]] : flat(v, `${prefix}${key}-`)
  })
}

const hex = (t: Token) => (t.$value as { hex: string }).hex

/* ---------- Theme ---------- */

const FONT_SANS = "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif"
const FONT_DISPLAY = "'DAMN', 'Bricolage Grotesque', Impact, sans-serif"
const WEIGHT: Record<string, number> = { Regular: 400, Medium: 500, SemiBold: 600, Bold: 700 }
const DAMN_URL = "https://cdn.jsdelivr.net/gh/mimirossi/DesignSystem@main/src/assets/fonts/damn.ttf"

const SPACING_GROUPS = ["inset", "gap", "stack", "section"]

export const TYPE_ROLES = Object.keys(tokens("typography-web")).filter((k) => !k.startsWith("$"))
const COLOR_ROLES = flat(tokens("light")).map(([name]) => name)
const PALETTE = Object.keys(tokens("base")).filter((k) => !k.startsWith("$"))

function themeCss(): string {
  const vars = (entries: [string, string][]) => entries.map(([k, v]) => `  --${k}: ${v};`).join("\n")

  const palette = flat(tokens("base")).map(([k, t]): [string, string] => [`color-${k}`, hex(t)])
  const light = flat(tokens("light")).map(([k, t]): [string, string] => [k, hex(t)])
  const dark = flat(tokens("dark")).map(([k, t]): [string, string] => [k, hex(t)])
  const space = flat(tokens("spacing"))
  const spacing = space
    .filter(([k]) => SPACING_GROUPS.some((g) => k.startsWith(`${g}-`)))
    .map(([k, t]): [string, string] => [`spacing-${k}`, `${t.$value}px`])
  const radius = space.filter(([k]) => k.startsWith("radius-")).map(([k, t]): [string, string] => [`locamimi-${k}`, `${t.$value}px`])
  const stroke = space.filter(([k]) => k.startsWith("stroke-")).map(([k, t]): [string, string] => [k, `${t.$value}px`])

  const type = TYPE_ROLES.flatMap((role): [string, string][] => {
    const r = tokens("typography-web")[role] as Record<string, Token>
    const d = r["font-size"].$description ?? ""
    const leading = Number(d.match(/interlinea (-?[\d.]+)%/)?.[1] ?? 100) / 100
    const tracking = Number(d.match(/spaziatura (-?[\d.]+)%/)?.[1] ?? 0) / 100
    return [
      [`type-${role}-family`, r["font-family"].$value === "DAMN" ? FONT_DISPLAY : FONT_SANS],
      [`type-${role}-weight`, String(WEIGHT[String(r["font-style"].$value)] ?? 400)],
      [`type-${role}-size`, `${r["font-size"].$value}px`],
      [`type-${role}-leading`, String(leading)],
      [`type-${role}-tracking`, `${tracking}em`],
      [`type-${role}-case`, d.includes("maiuscolo") ? "uppercase" : "none"],
    ]
  })

  return `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap');
@font-face { font-family: 'DAMN'; src: url('${DAMN_URL}') format('truetype'); font-weight: 400; font-display: swap; }
/* On :root so popovers, menus and dialogs (rendered outside the layer) get it too. */
:root, .light {
${vars([...palette, ...light, ...spacing, ...radius, ...stroke, ...type])}
}
.dark {
${vars(dark)}
}
.locamimi, .dark {
  font-family: ${FONT_SANS};
  color: var(--text-primary);
}
/* Default border color, as the project sets globally. In Tailwind's base layer so utilities win. */
@layer base {
  :where(.locamimi, [data-slot]) :where(*, ::before, ::after), :where([data-slot]) {
    border-color: var(--border-default);
  }
}`
}

/* ---------- Class rewriting ---------- */

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const alt = (list: string[]) => [...list].sort((a, b) => b.length - a.length).map(esc).join("|")
const B = "(?<![\\w-])" // token start (variants end with ":" so they still match)
const E = "(?![\\w-])"

const COLOR_PREFIX =
  "bg|text|border-[xytrblse]|border|ring-offset|ring|outline|fill|stroke|from|via|to|decoration|placeholder|caret|divide|shadow|inset-ring"
const SPACE_PREFIX = "p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap-x|gap-y|gap|space-x|space-y"

export function rewriteClasses(code: string): string {
  return (
    code
      // semantic colors: bg-action-primary/80 → bg-(color:--action-primary)/80
      .replace(
        new RegExp(`${B}(${COLOR_PREFIX})-(${alt(COLOR_ROLES)})(?=/|${E})`, "g"),
        "$1-(color:--$2)",
      )
      // palette colors: from-nero-900/90 → from-(color:--color-nero-900)/90
      .replace(
        new RegExp(`${B}(${COLOR_PREFIX})-(${alt(PALETTE)})-(\\d{2,3})(?=/|${E})`, "g"),
        "$1-(color:--color-$2-$3)",
      )
      // stroke: border-thin → border-(length:--stroke-thin)
      .replace(new RegExp(`${B}(border-[xytrblse]|border|ring|outline)-(thin|default|strong)${E}`, "g"), "$1-(length:--stroke-$2)")
      // spacing: px-inset-sm-md → px-(--spacing-inset-sm-md)
      .replace(
        new RegExp(`${B}(-?)(${SPACE_PREFIX})-(${SPACING_GROUPS.join("|")})-(none|xs|sm-md|sm|md|lg|xl|2xl)${E}`, "g"),
        "$1$2-(--spacing-$3-$4)",
      )
      // radius: rounded-t-xl → rounded-t-(--locamimi-radius-xl) (Tailwind owns --radius-*)
      .replace(new RegExp(`${B}rounded(-[trblse]{1,2})?-(xs|sm|md|lg|xl|2xl)${E}`, "g"), "rounded$1-(--locamimi-radius-$2)")
      // type roles → six arbitrary properties, each with the same variants
      .replace(new RegExp(`(?<=^|[\\s"'\`])([^\\s"'\`]*?:)?type-(${alt(TYPE_ROLES)})(?=$|[\\s"'\`])`, "gm"), (_m, variants = "", role) =>
        [
          ["font-family", "family"],
          ["font-weight", "weight"],
          ["font-size", "size"],
          ["line-height", "leading"],
          ["letter-spacing", "tracking"],
          ["text-transform", "case"],
        ]
          .map(([prop, part]) => `${variants}[${prop}:var(--type-${role}-${part})]`)
          .join(" "),
      )
      // breakpoints: LOCAMIMI tablet 768 / desktop 1024 = Tailwind md / lg
      .replace(/(?<![\w-])tablet:/g, "md:")
      .replace(/(?<![\w-])desktop:/g, "lg:")
      // shadcn custom variants that default Tailwind reads differently
      .replace(/data-(horizontal|vertical)(?=[:/])/g, "data-[orientation=$1]")
  )
}

/* ---------- Module assembly ---------- */

type Imports = Map<string, { named: Set<string>; namespace?: string; defaultName?: string }>

const IMPORT_RE = /^import\s+(type\s+)?([\s\S]+?)\s+from\s+["']([^"']+)["'];?[ \t]*$/gm

function readImports(src: string, into: Imports) {
  for (const [, typeOnly, clause, mod] of src.matchAll(IMPORT_RE)) {
    if (mod.startsWith("@/")) continue
    const entry = into.get(mod) ?? { named: new Set<string>() }
    const braces = clause.match(/\{([\s\S]*)\}/)
    if (braces)
      for (const n of braces[1].split(",").map((s) => s.trim()).filter(Boolean))
        entry.named.add(typeOnly && !n.startsWith("type ") ? `type ${n}` : n)
    const rest = clause.replace(/\{[\s\S]*\}/, "").replace(/,/g, " ").trim()
    const ns = rest.match(/\*\s+as\s+(\w+)/)
    if (ns) entry.namespace = ns[1]
    else if (rest) entry.defaultName = rest
    into.set(mod, entry)
  }
}

function printImports(imports: Imports): string {
  const lines: string[] = []
  for (const [mod, e] of imports) {
    if (e.namespace) lines.push(`import * as ${e.namespace} from "${mod}"`)
    const parts = [e.defaultName, e.named.size ? `{ ${[...e.named].join(", ")} }` : ""].filter(Boolean)
    if (parts.length) lines.push(`import ${parts.join(", ")} from "${mod}"`)
  }
  return lines.join("\n")
}

const localDeps = (src: string) => [...src.matchAll(/from\s+["']@\/([^"']+)["']/g)].map((m) => m[1])

function body(src: string) {
  return src.replace(IMPORT_RE, "").replace(/^export\s+\{[^}]*\};?[ \t]*$/gm, "").replace(/^export\s+(?=(function|const|type|interface)\s)/gm, "").trim()
}

/** Moves local svg assets (`?raw` imports) into `assets`, declared once. */
function inlineAssets(src: string, assets: Map<string, string>) {
  return src.replace(/^import\s+(\w+)\s+from\s+["']@\/assets\/([^"'?]+)\?raw["'];?[ \t]*$/gm, (_m, name, path) => {
    assets.set(name, assetFiles[`../../assets/${path}`] ?? "")
    return ""
  })
}

export type LayerExample = { id: string; code: string }

/**
 * @param sourceFiles the component's own files, e.g. ["button"]
 * @param examples    gallery examples (extracted snippets) to export themed
 */
export function buildCodeLayer(name: string, sourceFiles: string[], examples: LayerExample[]): string {
  const imports: Imports = new Map()
  const seen = new Set<string>()
  const chunks: string[] = []

  const visit = (path: string) => {
    if (seen.has(path)) return
    seen.add(path)
    const src = codeFiles[`../../${path}.tsx`]
    if (!src) return
    localDeps(src).filter((d) => d.startsWith("components/")).forEach(visit)
    readImports(src, imports)
    chunks.push(`// ---- ${path}.tsx\n${body(src)}`)
  }

  const assets = new Map<string, string>()
  const exampleChunks = examples.map((ex) => {
    const src = inlineAssets(ex.code, assets)
    localDeps(src).filter((d) => d.startsWith("components/")).forEach(visit)
    readImports(src, imports)
    return body(src).replace(`function ${ex.id}(`, `function ${ex.id}Example(`)
  })
  sourceFiles.forEach((f) => visit(`components/ui/${f}`))

  imports.set("cn", { named: new Set(["cn"]) })
  if (!imports.has("react") || !imports.get("react")?.namespace) {
    const r = imports.get("react") ?? { named: new Set<string>() }
    r.namespace = "React"
    imports.set("react", r)
  }

  const wrappers = examples
    .map(
      (ex) => `/** Gallery example "${ex.id}" with the LOCAMIMI theme applied. */
export function ${ex.id}() {
  return (
    <LocamimiTheme>
      <${ex.id}Example />
    </LocamimiTheme>
  )
}`,
    )
    .join("\n\n")

  const code = `// LOCAMIMI · ${name} — self-contained file for a Figma Sites code layer.
// Generated from github.com/mimirossi/DesignSystem (tokens/*.tokens.json).
// Paste it as is: packages install on import; the theme is in LOCAMIMI_CSS.
// Each exported function is a themed example you can place on the canvas.
${printImports(imports)}

const LOCAMIMI_CSS = __LOCAMIMI_CSS__

/** Wraps content in the LOCAMIMI theme. Add className="dark" for the dark mode. */
function LocamimiTheme({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("locamimi", className)}>
      <style>{LOCAMIMI_CSS}</style>
      {children}
    </div>
  )
}

${chunks.join("\n\n")}

// ---- examples
${[...assets].map(([n, svg]) => `const ${n} = ${JSON.stringify(svg)}`).join("\n")}

${exampleChunks.join("\n\n")}

${wrappers}

export default ${examples[0]?.id ?? "LocamimiTheme"}
`
  return rewriteClasses(code).replace("__LOCAMIMI_CSS__", () => JSON.stringify(themeCss()))
}
