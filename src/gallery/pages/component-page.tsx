import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/gallery/components/code-block"
import utilsSource from "@/lib/utils.ts?raw"
import { Button } from "@/components/ui/button"
import { copyToClipboard } from "@/gallery/lib/copy"
import { buildCodeLayer } from "@/gallery/lib/figma-layer"
import { registry } from "@/gallery/registry"
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
          <FigmaLayerCopy entry={entry} />
          <SetupSteps />
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

      <aside className="sticky top-20 hidden h-fit w-44 shrink-0 desktop:block">
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

const INSTALL =
  "npm i @base-ui/react class-variance-authority cn lucide-react tw-animate-css shadcn @fontsource-variable/bricolage-grotesque"

const REPO = "https://github.com/mimirossi/DesignSystem/blob/main"

/** What a fresh project needs once before any copied component renders. */
function SetupSteps() {
  return (
    <details className="group rounded-lg border-thin border-border-default bg-surface-default">
      <summary className="cursor-pointer px-inset-md py-inset-sm-md type-body-strong">
        Setup, once per project — without it the classes have no values and nothing shows
      </summary>
      <ol className="flex list-decimal flex-col gap-stack-md px-inset-md pb-inset-md pl-inset-xl type-body">
        <li className="flex flex-col gap-stack-xs">
          <span>
            A React project with Tailwind CSS v4 and the <code className="font-mono type-caption">@/</code> alias
            to <code className="font-mono type-caption">src/</code> (the shadcn/ui setup). Then install:
          </span>
          <CodeBlock code={INSTALL} />
        </li>
        <li className="flex flex-col gap-stack-xs">
          <span>
            <code className="font-mono type-caption">src/lib/utils.ts</code> — class merging that knows the LOCAMIMI
            tokens. Replace the shadcn default: theirs drops <code className="font-mono type-caption">border-thin</code>{" "}
            and mixes up type roles.
          </span>
          <CodeBlock code={utilsSource} maxHeight="16rem" />
        </li>
        <li className="flex flex-col gap-stack-xs">
          <span>
            The theme: copy{" "}
            <a className="text-text-link underline underline-offset-4" href={`${REPO}/src/index.css`} target="_blank" rel="noreferrer">
              src/index.css
            </a>{" "}
            (colors, spacing, radius, stroke, type, breakpoints, grid) as your main CSS file, and the DAMN font{" "}
            <a className="text-text-link underline underline-offset-4" href={`${REPO}/src/assets/fonts/damn.ttf`} target="_blank" rel="noreferrer">
              src/assets/fonts/damn.ttf
            </a>
            . Every class in the component — <code className="font-mono type-caption">bg-action-primary</code>,{" "}
            <code className="font-mono type-caption">px-inset-sm-md</code>, <code className="font-mono type-caption">type-label</code> — is
            defined there.
          </span>
        </li>
      </ol>
    </details>
  )
}

function figmaLayerFor(entry: ComponentEntry) {
  return buildCodeLayer(
    entry.name,
    entry.sources.map((s) => s.file.replace(/^components\/ui\/|\.tsx$/g, "")),
    entry.examples.map((e) => ({ id: e.id, code: e.code })),
  )
}

// Lets scripts export every code layer at once (used to test the output).
;(window as unknown as Record<string, unknown>).__locamimiFigmaLayers = () =>
  Object.fromEntries(registry.map((e) => [e.slug, figmaLayerFor(e)]))

/** One file to paste into a Figma Sites code layer: theme, component, examples. */
function FigmaLayerCopy({ entry }: { entry: ComponentEntry }) {
  return (
    <div className="flex flex-col gap-stack-sm rounded-lg border-thin border-action-primary bg-action-secondary-surface p-inset-md tablet:flex-row tablet:items-center tablet:justify-between">
      <div className="flex flex-col gap-stack-xs">
        <span className="type-body-strong">Figma Sites code layer</span>
        <span className="type-body text-text-secondary">
          One file with the theme, the component and its examples. Paste it into the code layer as is — nothing else to copy.
        </span>
      </div>
      <Button className="shrink-0" onClick={() => copyToClipboard(figmaLayerFor(entry), `${entry.name} for Figma`)}>
        Copy for Figma code layer
      </Button>
    </div>
  )
}
