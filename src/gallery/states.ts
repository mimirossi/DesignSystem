import type { ReactNode } from "react"
import type { JsxProps } from "@/gallery/lib/jsx"

export type StateKey = "default" | "hover" | "focus" | "active" | "disabled" | "invalid"

export type StateDef = {
  label: string
  /** Props applied to the rendered preview to force the state. */
  render: Record<string, unknown>
  /** Props that belong in the copied code (interaction states need none). */
  code: JsxProps
  hint?: string
}

// data-force-* attributes are matched by the custom variants in index.css.
export const STATES: Record<StateKey, StateDef> = {
  default: { label: "Default", render: {}, code: {} },
  hover: {
    label: "Hover",
    render: { "data-force-hover": "" },
    code: {},
    hint: "Applied on :hover",
  },
  focus: {
    label: "Focus",
    render: { "data-force-focus": "" },
    code: {},
    hint: "Applied on :focus-visible (keyboard focus)",
  },
  active: {
    label: "Active",
    render: { "data-force-active": "" },
    code: {},
    hint: "Applied on :active (while pressed)",
  },
  disabled: { label: "Disabled", render: { disabled: true }, code: { disabled: true } },
  invalid: {
    label: "Invalid",
    render: { "aria-invalid": true },
    code: { "aria-invalid": true },
    hint: "Set aria-invalid when validation fails",
  },
}

export type StateMatrix = {
  columns: StateKey[]
  rows: { label: string; props?: JsxProps }[]
  /** Renders one cell. `stateProps` must be spread onto the element that carries the styles. */
  render: (rowProps: JsxProps, stateProps: Record<string, unknown>) => ReactNode
  /** Code copied for one cell. */
  code: (props: JsxProps) => string
}
