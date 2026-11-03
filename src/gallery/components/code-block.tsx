import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { copyToClipboard } from "@/gallery/lib/copy"
import { highlight } from "@/gallery/lib/highlight"

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Copy ${label ?? "code"}`}
      className={className}
      onClick={async () => setCopied(await copyToClipboard(value, label))}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  )
}

export function CodeBlock({
  code,
  lang = "tsx",
  className,
  maxHeight = "28rem",
}: {
  code: string
  lang?: "tsx" | "bash"
  className?: string
  maxHeight?: string
}) {
  const [html, setHtml] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    highlight(code, lang).then((result) => {
      if (!cancelled) setHtml(result)
    })
    return () => {
      cancelled = true
    }
  }, [code, lang])

  return (
    <div className={cn("group/code relative rounded-lg border bg-muted/40", className)}>
      <CopyButton value={code} className="absolute top-2 right-2 z-10 bg-background/80" />
      <div className="code-block overflow-auto p-4 pr-12 font-mono text-[0.8rem] leading-relaxed" style={{ maxHeight }}>
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre>
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
