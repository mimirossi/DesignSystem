/** A raw JavaScript expression, printed as `name={source}`. */
export type Expr = { expr: string }

export type JsxValue = string | number | boolean | Expr | undefined
export type JsxProps = Record<string, JsxValue>

export const expr = (source: string): Expr => ({ expr: source })

function printProp(name: string, value: JsxValue) {
  if (value === undefined || value === false) return null
  if (value === true) return name
  if (typeof value === "string") return `${name}="${value}"`
  if (typeof value === "object") return `${name}={${value.expr}}`
  return `${name}={${value}}`
}

/** The opening tag only, e.g. `<Select items={fruits}>`. */
export function jsxOpen(tag: string, props: JsxProps = {}) {
  const attrs = Object.entries(props)
    .map(([name, value]) => printProp(name, value))
    .filter(Boolean)
    .join(" ")
  return attrs ? `<${tag} ${attrs}>` : `<${tag}>`
}

/** Serializes a single element, e.g. `<Button variant="outline">Save</Button>`. */
export function jsx(tag: string, props: JsxProps = {}, children?: string) {
  const open = jsxOpen(tag, props)
  return children ? `${open}${children}</${tag}>` : `${open.slice(0, -1)} />`
}
