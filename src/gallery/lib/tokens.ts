// Reads the Figma token exports in /tokens so the gallery documents exactly
// what the design file defines.

type ColorToken = {
  $type: "color"
  $value: { hex: string }
  $description?: string
  $extensions?: { "com.figma.aliasData"?: { targetVariableName: string } }
}
type TokenGroup = Record<string, Record<string, ColorToken>>

const files = import.meta.glob<TokenGroup>("../../../tokens/*.tokens.json", {
  eager: true,
  import: "default",
})
const load = (name: string) => files[`../../../tokens/${name}.tokens.json`]

export const FAMILIES = [
  { id: "rosa", label: "Rosa", code: "R", role: "Primary" },
  { id: "rosa-chiaro", label: "Rosa chiaro", code: "S", role: "Secondary" },
  { id: "verde", label: "Verde", code: "V", role: "Accent" },
  { id: "nero", label: "Nero", code: "N", role: "Neutral · dark" },
  { id: "crema", label: "Crema", code: "C", role: "Neutral · warm" },
] as const

export const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const

export function paletteHex(family: string, step: string) {
  return load("base")[family][step].$value.hex
}

export type SemanticRole = {
  group: string
  name: string
  light: { hex: string; alias: string }
  dark: { hex: string; alias: string }
}

/** Every semantic role defined in Figma, paired across the light and dark modes. */
export function semanticRoles(): SemanticRole[] {
  const light = load("light")
  const dark = load("dark")
  const alias = (token: ColorToken) =>
    token.$extensions?.["com.figma.aliasData"]?.targetVariableName ?? ""

  return Object.entries(light)
    .filter(([group]) => !group.startsWith("$"))
    .flatMap(([group, roles]) =>
      Object.entries(roles).map(([name, token]) => ({
        group,
        name,
        light: { hex: token.$value.hex, alias: alias(token) },
        dark: { hex: dark[group][name].$value.hex, alias: alias(dark[group][name]) },
      }))
    )
}

/** WCAG 2.x contrast ratio between two colors (same formula as the Figma file). */
export function contrast(a: string, b: string) {
  const luminance = (color: string) => {
    const [r, g, b] = parseColor(color).map((c) => {
      const v = c / 255
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Accepts #RRGGBB or the rgb()/rgba() strings returned by getComputedStyle. */
function parseColor(color: string): [number, number, number] {
  if (color.startsWith("#")) {
    const n = parseInt(color.slice(1, 7), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const [r, g, b] = color.match(/[\d.]+/g)!.map(Number)
  return [r, g, b]
}

type TypeToken = { $value: string | number; $description?: string }
type TypeRoleTokens = Record<string, Record<string, TypeToken>>

export type TypeRole = {
  name: string
  label: string
  family: string
  style: string
  size: number
  lineHeight: string
  letterSpacing: string
  uppercase: boolean
}

/** Type roles from tokens/typography.tokens.json, with the percentages from their descriptions. */
export function typeRoles(): TypeRole[] {
  const roles = files["../../../tokens/typography.tokens.json"] as unknown as TypeRoleTokens
  return Object.entries(roles)
    .filter(([name]) => !name.startsWith("$"))
    .map(([name, role]) => {
      const description = role["font-size"].$description ?? ""
      return {
        name,
        label: description.split(" · ")[0],
        family: String(role["font-family"].$value),
        style: String(role["font-style"].$value),
        size: Number(role["font-size"].$value),
        lineHeight: description.match(/interlinea (\d+%)/)?.[1] ?? "",
        letterSpacing: description.match(/spaziatura (-?[\d.]+%)/)?.[1] ?? "",
        uppercase: description.includes("maiuscolo"),
      }
    })
}

type SpacingTokens = Record<string, Record<string, { $value: number; $description?: string }>>

export type SpacingRole = { group: string; name: string; px: number; alias: string }

/** Semantic spacing from tokens/spacing.tokens.json, grouped as in Figma. */
export function spacingRoles(): { group: string; description: string; roles: SpacingRole[] }[] {
  const tokens = files["../../../tokens/spacing.tokens.json"] as unknown as SpacingTokens
  return Object.entries(tokens)
    .filter(([group]) => !group.startsWith("$"))
    .map(([group, steps]) => {
      const first = Object.values(steps)[0]
      return {
        group,
        description: (first.$description ?? "").split(".")[0],
        roles: Object.entries(steps).map(([name, token]) => ({
          group,
          name,
          px: token.$value,
          alias: `space/${token.$value}`,
        })),
      }
    })
}

/** Primitive 4px scale from tokens/spacing-base.tokens.json. */
export function spacingPrimitives(): number[] {
  const tokens = files["../../../tokens/spacing-base.tokens.json"] as unknown as SpacingTokens
  return Object.values(tokens.space).map((token) => token.$value)
}
