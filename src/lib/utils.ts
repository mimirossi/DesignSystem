import { createCn } from "cn/config"

/*
 * Class merging that knows the LOCAMIMI tokens (Figma → tokens/*.json).
 * Without this, the merger reads `border-thin` as a border *color* and drops
 * it next to `border-border-input`, and keeps both `type-label` and
 * `type-caption` instead of letting the later one win.
 */

// stroke/* → border-*, ring-*, outline-* widths
const STROKE = ["thin", "default", "strong"]

// inset/*, gap/*, stack/*, section/* + grid gutter and margin
const SPACING = [
  ...["none", "xs", "sm", "sm-md", "md", "lg", "xl", "2xl"].map((s) => `inset-${s}`),
  ...["none", "xs", "sm", "sm-md", "md", "lg", "xl", "2xl"].map((s) => `gap-${s}`),
  ...["none", "xs", "sm", "md", "lg", "xl", "2xl"].map((s) => `stack-${s}`),
  ...["sm", "md", "lg", "xl"].map((s) => `section-${s}`),
  "gutter",
  "margin",
]

// LOCAMIMI — Tipografia — Web
const TYPE_ROLES = [
  "display-xl",
  "display-l",
  "titolo-1",
  "titolo-2",
  "titolo-3",
  "sottotitolo",
  "lead",
  "body",
  "body-strong",
  "caption",
  "info",
  "label",
]

const TYPE_PARTS = ["font-size", "font-weight", "font-family", "leading", "tracking", "text-transform"] as const

export const cn = createCn<"type">({
  extend: {
    theme: { spacing: SPACING },
    classGroups: {
      type: [{ type: TYPE_ROLES }],
      "border-w": [{ border: STROKE }],
      "border-w-x": [{ "border-x": STROKE }],
      "border-w-y": [{ "border-y": STROKE }],
      "border-w-s": [{ "border-s": STROKE }],
      "border-w-e": [{ "border-e": STROKE }],
      "border-w-t": [{ "border-t": STROKE }],
      "border-w-r": [{ "border-r": STROKE }],
      "border-w-b": [{ "border-b": STROKE }],
      "border-w-l": [{ "border-l": STROKE }],
      "ring-w": [{ ring: STROKE }],
      "outline-w": [{ outline: STROKE }],
    },
    conflictingClassGroups: {
      // a type role sets size, weight, family, leading, tracking and case together
      type: [...TYPE_PARTS],
    },
  },
})
