import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CopyButton } from "@/gallery/components/code-block"
import { STATES, type StateMatrix as StateMatrixConfig } from "@/gallery/states"

export function StateMatrix({ matrix }: { matrix: StateMatrixConfig }) {
  const { columns, rows } = matrix

  return (
    <div className="overflow-x-auto rounded-lg border-thin">
      <table className="preview-surface w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-thin bg-muted/40">
            <th className="w-36 px-4 py-2.5 text-left font-medium text-muted-foreground">
              Variant
            </th>
            {columns.map((key) => {
              const state = STATES[key]
              return (
                <th key={key} className="px-4 py-2.5 text-left font-medium">
                  <span className="inline-flex items-center gap-gap-xs">
                    {state.label}
                    {state.hint && (
                      <Tooltip>
                        <TooltipTrigger
                          aria-label={state.hint}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <InfoIcon className="size-3.5" />
                        </TooltipTrigger>
                        <TooltipContent>{state.hint}</TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b-thin last:border-b-0">
              <th scope="row" className="px-4 py-4 text-left align-middle font-normal text-muted-foreground">
                {row.label}
              </th>
              {columns.map((key) => {
                const state = STATES[key]
                const rowProps = row.props ?? {}
                const code = matrix.code({ ...rowProps, ...state.code })
                return (
                  <td key={key} className="group/cell px-4 py-4 align-middle">
                    <div className="flex items-center gap-gap-xs">
                      {/* Forced states are visual only; keep them out of the tab order. */}
                      <div inert={key !== "default"} className="flex min-w-0 items-center">
                        {matrix.render(rowProps, state.render)}
                      </div>
                      <CopyButton
                        value={code}
                        label={`${row.label} · ${state.label}`}
                        className="opacity-40 group-hover/cell:opacity-100 focus-visible:opacity-100"
                      />
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
