// Turns the raw source of a demo file into a copy-pasteable snippet for one
// exported example: the example function plus only the imports it uses.

type ImportDecl = {
  module: string
  defaultName?: string
  namespace?: string
  named: { text: string; local: string }[]
  typeOnly: boolean
}

const IMPORT_RE = /^import\s+(type\s+)?([\s\S]+?)\s+from\s+["']([^"']+)["'];?\s*$/gm

function parseImports(source: string): ImportDecl[] {
  const imports: ImportDecl[] = []
  for (const match of source.matchAll(IMPORT_RE)) {
    const [, typeKeyword, clause, module] = match
    const decl: ImportDecl = { module, named: [], typeOnly: Boolean(typeKeyword) }

    const braces = clause.match(/\{([\s\S]*)\}/)
    if (braces) {
      for (const raw of braces[1].split(",")) {
        const text = raw.trim()
        if (!text) continue
        const local = text.replace(/^type\s+/, "").split(/\s+as\s+/).pop()!
        decl.named.push({ text, local })
      }
    }

    const rest = clause.replace(/\{[\s\S]*\}/, "").replace(/,/g, " ").trim()
    const namespace = rest.match(/\*\s+as\s+(\w+)/)
    if (namespace) decl.namespace = namespace[1]
    else if (rest) decl.defaultName = rest

    imports.push(decl)
  }
  return imports
}

function uses(body: string, identifier: string) {
  return new RegExp(`\\b${identifier}\\b`).test(body)
}

function printImport(decl: ImportDecl, body: string): string | null {
  const parts: string[] = []
  if (decl.defaultName && uses(body, decl.defaultName)) parts.push(decl.defaultName)
  if (decl.namespace && uses(body, decl.namespace)) parts.push(`* as ${decl.namespace}`)

  const named = decl.named.filter((n) => uses(body, n.local)).map((n) => n.text)
  if (named.length) parts.push(`{ ${named.join(", ")} }`)

  if (!parts.length) return null
  return `import ${decl.typeOnly ? "type " : ""}${parts.join(", ")} from "${decl.module}"`
}

/** Extracts `export function <name>` from a module's source, with the imports it needs. */
export function extractExample(source: string, name: string): string {
  const start = source.indexOf(`export function ${name}(`)
  if (start === -1) return `// Example "${name}" not found`

  const next = source.indexOf("\nexport ", start + 1)
  const body = source.slice(start, next === -1 ? undefined : next).trim()

  const imports = parseImports(source)
    .map((decl) => printImport(decl, body))
    .filter((line): line is string => line !== null)

  return [imports.join("\n"), body].filter(Boolean).join("\n\n")
}
