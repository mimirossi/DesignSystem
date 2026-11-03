import type { HighlighterCore } from "shiki/core"

let highlighter: Promise<HighlighterCore> | null = null

function getHighlighter() {
  highlighter ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
      await Promise.all([import("shiki/core"), import("shiki/engine/javascript")])
    return createHighlighterCore({
      themes: [import("shiki/themes/github-light.mjs"), import("shiki/themes/github-dark.mjs")],
      langs: [import("shiki/langs/tsx.mjs"), import("shiki/langs/bash.mjs")],
      engine: createJavaScriptRegexEngine(),
    })
  })()
  return highlighter
}

/** Returns HTML for `code`, with light and dark colors exposed as CSS variables. */
export async function highlight(code: string, lang: "tsx" | "bash" = "tsx") {
  const shiki = await getHighlighter()
  return shiki.codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
}
