import type * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock, CopyButton } from "@/gallery/components/code-block"

export function ExampleCard({
  id,
  title,
  description,
  code,
  children,
}: {
  id: string
  title: string
  description?: string
  code: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-heading text-base font-medium">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      <Tabs defaultValue="preview">
        <div className="flex items-center justify-between gap-2">
          <TabsList variant="line">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <CopyButton value={code} />
        </div>
        <TabsContent value="preview">
          <div className="preview-surface flex min-h-48 flex-wrap items-center justify-center gap-4 rounded-lg border p-6 sm:p-10">
            {children}
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={code} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
