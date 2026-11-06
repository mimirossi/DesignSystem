import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/gallery/components/code-block"
import { ExampleCard } from "@/gallery/components/example-card"
import { StateMatrix } from "@/gallery/components/state-matrix"
import type { ComponentEntry } from "@/gallery/registry"

function SectionHeading({ id, title, children }: { id: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-stack-xs">
      <h2 id={id} className="scroll-mt-20 font-heading text-xl font-medium tracking-tight">
        {title}
      </h2>
      {children && <p className="text-sm text-text-secondary">{children}</p>}
    </div>
  )
}

export function ComponentPage({ entry }: { entry: ComponentEntry }) {
  const toc = [
    entry.states && { id: "states", title: "States" },
    { id: "examples", title: "Examples" },
    ...entry.examples.map((example) => ({ id: example.id, title: example.title, nested: true })),
    { id: "source", title: "Source" },
  ].filter(Boolean) as { id: string; title: string; nested?: boolean }[]

  return (
    <div className="flex gap-gap-2xl">
      <article className="flex min-w-0 flex-1 flex-col gap-section-md">
        <header className="flex flex-col gap-stack-sm">
          <Badge variant="outline">{entry.category}</Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">{entry.name}</h1>
          <p className="max-w-2xl text-text-secondary">{entry.description}</p>
        </header>

        {entry.states && (
          <section className="flex flex-col gap-stack-md">
            <SectionHeading id="states" title="States">
              Every variant in every state. Hover, focus and active are forced here for review — in your
              app they apply automatically, so their copied code matches the default.
            </SectionHeading>
            <StateMatrix matrix={entry.states} />
          </section>
        )}

        <section className="flex flex-col gap-stack-xl">
          <SectionHeading id="examples" title="Examples" />
          {entry.examples.map(({ id, title, description, Component, code }) => (
            <ExampleCard key={id} id={id} title={title} description={description} code={code}>
              <Component />
            </ExampleCard>
          ))}
        </section>

        <section className="flex flex-col gap-stack-md">
          <SectionHeading id="source" title="Source">
            Copy the component into your project, e.g. <code className="font-mono text-xs">src/{entry.sources[0].file}</code>.
          </SectionHeading>
          {entry.sources.length === 1 ? (
            <CodeBlock code={entry.sources[0].code} maxHeight="32rem" />
          ) : (
            <Tabs defaultValue={entry.sources[0].file}>
              <TabsList variant="line">
                {entry.sources.map((source) => (
                  <TabsTrigger key={source.file} value={source.file} className="font-mono text-xs">
                    {source.file.split("/").pop()}
                  </TabsTrigger>
                ))}
              </TabsList>
              {entry.sources.map((source) => (
                <TabsContent key={source.file} value={source.file}>
                  <CodeBlock code={source.code} maxHeight="32rem" />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </section>
      </article>

      <aside className="sticky top-20 hidden h-fit w-44 shrink-0 xl:block">
        <p className="mb-stack-sm text-xs font-medium tracking-wide text-text-secondary uppercase">On this page</p>
        <ul className="flex flex-col gap-stack-xs text-sm">
          {toc.map((item) => (
            <li key={item.id} className={item.nested ? "pl-inset-sm-md" : undefined}>
              <button
                type="button"
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
                className="text-left text-text-secondary hover:text-text-primary"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
