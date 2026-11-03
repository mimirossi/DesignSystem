import type * as React from "react"
import { BoldIcon } from "lucide-react"
import cuorePalpebre from "@/assets/covers/cuore-palpebre.svg"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardMedia, CardOverlay, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { expr, jsx, jsxOpen } from "@/gallery/lib/jsx"
import { extractExample } from "@/gallery/lib/source"
import type { StateMatrix } from "@/gallery/states"

// Demo modules are loaded twice: once as components to render, once as raw
// text so the copied code is always exactly what renders on screen.
const demoModules = import.meta.glob<Record<string, React.ComponentType>>("./demos/*.tsx", {
  eager: true,
})
const demoSources = import.meta.glob<string>("./demos/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
})
const uiSources = import.meta.glob<string>("../components/ui/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
})

export type Example = {
  id: string
  title: string
  description?: string
  Component: React.ComponentType
  code: string
}

export type ComponentEntry = {
  slug: string
  name: string
  category: Category
  description: string
  examples: Example[]
  states?: StateMatrix
  /** Source files of the component itself, keyed by file name. */
  sources: { file: string; code: string }[]
}

export const CATEGORIES = ["Actions", "Forms", "Feedback", "Overlays", "Display & layout"] as const
export type Category = (typeof CATEGORIES)[number]

type ExampleSpec = [id: string, title: string, description?: string]

function examples(file: string, specs: ExampleSpec[]): Example[] {
  const module = demoModules[`./demos/${file}.tsx`]
  const source = demoSources[`./demos/${file}.tsx`]
  return specs.map(([id, title, description]) => ({
    id,
    title,
    description,
    Component: module[id],
    code: extractExample(source, id),
  }))
}

function sources(...files: string[]) {
  return files.map((file) => ({
    file: `components/ui/${file}.tsx`,
    code: uiSources[`../components/ui/${file}.tsx`],
  }))
}

/** Splits one prop off, e.g. to move it from an inner element to its wrapper. */
function pick<T extends Record<string, unknown>>(props: T, key: string) {
  const { [key]: value, ...rest } = props
  return [value as T[string], rest as T] as const
}

const BUTTON_VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"]

const entries: (Omit<ComponentEntry, "sources"> & { files: string[] })[] = [
  // Actions
  {
    slug: "button",
    name: "Button",
    category: "Actions",
    description: "Triggers an action or event, such as submitting a form or opening a dialog.",
    files: ["button"],
    states: {
      columns: ["default", "hover", "focus", "active", "disabled"],
      rows: BUTTON_VARIANTS.map((variant) => ({
        label: variant[0].toUpperCase() + variant.slice(1),
        props: variant === "default" ? {} : { variant },
      })),
      render: (row, state) => <Button {...row} {...state}>Button</Button>,
      code: (props) => jsx("Button", props, "Button"),
    },
    examples: examples("button", [
      ["ButtonVariants", "Variants"],
      ["ButtonSizes", "Sizes"],
      ["ButtonWithIcon", "With icon", "Mark icons with data-icon so padding adjusts automatically."],
      ["ButtonIconOnly", "Icon only", "Always provide an aria-label for icon-only buttons."],
      ["ButtonLoading", "Loading"],
      ["ButtonAsLink", "As link", "Use the render prop to render the button styles on another element."],
    ]),
  },
  {
    slug: "badge",
    name: "Badge",
    category: "Actions",
    description: "Displays a short status, count or label.",
    files: ["badge"],
    examples: examples("badge", [
      ["BadgeVariants", "Variants"],
      ["BadgeWithIcon", "With icon & counters"],
      ["BadgeHighlight", "Highlight", "Green V300 with N900 text. Always pair it with an icon or label — never color alone."],
      ["BadgeAsLink", "As link"],
    ]),
  },
  {
    slug: "toggle",
    name: "Toggle",
    category: "Actions",
    description: "A two-state button that can be on or off, alone or as part of a group.",
    files: ["toggle", "toggle-group"],
    states: {
      columns: ["default", "hover", "focus", "disabled"],
      rows: [
        { label: "Default · off", props: {} },
        { label: "Default · on", props: { defaultPressed: true } },
        { label: "Outline · off", props: { variant: "outline" } },
        { label: "Outline · on", props: { variant: "outline", defaultPressed: true } },
      ],
      render: (row, state) => (
        <Toggle aria-label="Toggle bold" {...row} {...state}>
          <BoldIcon />
        </Toggle>
      ),
      code: (props) => jsx("Toggle", { ...props, "aria-label": "Toggle bold" }, "<BoldIcon />"),
    },
    examples: examples("toggle", [
      ["ToggleDefault", "Default"],
      ["ToggleOutlineWithText", "Outline with text"],
      ["ToggleSizes", "Sizes"],
      ["ToggleGroupMultiple", "Toggle group · multiple"],
      ["ToggleGroupSingle", "Toggle group · single, attached"],
    ]),
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    category: "Actions",
    description: "A menu of actions or options, opened from a trigger button.",
    files: ["dropdown-menu"],
    examples: examples("dropdown-menu", [
      ["DropdownMenuBasic", "Basic", "Includes shortcuts, a disabled item, a submenu and a destructive item."],
      ["DropdownMenuCheckboxes", "Checkbox items"],
      ["DropdownMenuRadio", "Radio items"],
    ]),
  },

  // Forms
  {
    slug: "input",
    name: "Input",
    category: "Forms",
    description: "A single-line text field.",
    files: ["input", "label"],
    states: {
      columns: ["default", "focus", "disabled", "invalid"],
      rows: [
        { label: "Placeholder", props: { placeholder: "Email" } },
        { label: "Filled", props: { defaultValue: "ada@example.com" } },
      ],
      render: (row, state) => <Input className="w-44" {...row} {...state} />,
      code: (props) => jsx("Input", props),
    },
    examples: examples("input", [
      ["InputDefault", "Default"],
      ["InputWithLabel", "With label & help text"],
      ["InputInvalid", "Invalid", "Pair aria-invalid with a message linked by aria-describedby."],
      ["InputWithButton", "With icon & button"],
      ["InputFile", "File"],
    ]),
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "Forms",
    description: "A multi-line text field.",
    files: ["textarea"],
    states: {
      columns: ["default", "focus", "disabled", "invalid"],
      rows: [
        { label: "Placeholder", props: { placeholder: "Your message" } },
        { label: "Filled", props: { defaultValue: "Hello there!" } },
      ],
      render: (row, state) => <Textarea className="w-48" {...row} {...state} />,
      code: (props) => jsx("Textarea", props),
    },
    examples: examples("input", [
      ["TextareaDefault", "Default"],
      ["TextareaWithLabel", "With label & button"],
    ]),
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "Forms",
    description: "Lets the user toggle an option on or off.",
    files: ["checkbox"],
    states: {
      columns: ["default", "focus", "disabled", "invalid"],
      rows: [
        { label: "Unchecked", props: {} },
        { label: "Checked", props: { defaultChecked: true } },
      ],
      render: (row, state) => <Checkbox aria-label="Checkbox" {...row} {...state} />,
      code: (props) => jsx("Checkbox", { ...props, "aria-label": "Checkbox" }),
    },
    examples: examples("choice", [
      ["CheckboxBasic", "With label"],
      ["CheckboxWithDescription", "With description"],
      ["CheckboxDisabled", "Disabled"],
    ]),
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    category: "Forms",
    description: "A set of options where only one can be selected at a time.",
    files: ["radio-group"],
    states: {
      columns: ["default", "focus", "disabled", "invalid"],
      rows: [
        { label: "Unselected", props: {} },
        { label: "Selected", props: { defaultValue: "a" } },
      ],
      render: (row, state) => {
        const [defaultValue] = pick(row, "defaultValue")
        return (
          <RadioGroup defaultValue={defaultValue as string | undefined}>
            <RadioGroupItem value="a" aria-label="Option" {...state} />
          </RadioGroup>
        )
      },
      code: (props) => {
        const [defaultValue, itemProps] = pick(props, "defaultValue")
        return [
          jsxOpen("RadioGroup", { defaultValue }),
          `  ${jsx("RadioGroupItem", { value: "a", "aria-label": "Option", ...itemProps })}`,
          "</RadioGroup>",
        ].join("\n")
      },
    },
    examples: examples("choice", [
      ["RadioGroupBasic", "Basic"],
      ["RadioGroupCards", "Card options"],
    ]),
  },
  {
    slug: "switch",
    name: "Switch",
    category: "Forms",
    description: "A control that toggles a setting on or off immediately.",
    files: ["switch"],
    states: {
      columns: ["default", "focus", "disabled", "invalid"],
      rows: [
        { label: "Off", props: {} },
        { label: "On", props: { defaultChecked: true } },
        { label: "Small · on", props: { size: "sm", defaultChecked: true } },
      ],
      render: (row, state) => <Switch aria-label="Switch" {...row} {...state} />,
      code: (props) => jsx("Switch", { ...props, "aria-label": "Switch" }),
    },
    examples: examples("choice", [
      ["SwitchBasic", "With label"],
      ["SwitchSizes", "Sizes"],
    ]),
  },
  {
    slug: "select",
    name: "Select",
    category: "Forms",
    description: "Lets the user pick one value from a list of options.",
    files: ["select"],
    states: {
      columns: ["default", "hover", "focus", "disabled", "invalid"],
      rows: [
        { label: "Placeholder", props: {} },
        { label: "With value", props: { defaultValue: "apple" } },
      ],
      render: (row, state) => {
        const [disabled, triggerState] = pick(state, "disabled")
        const items = [
          { label: "Apple", value: "apple" },
          { label: "Banana", value: "banana" },
        ]
        return (
          <Select items={items} defaultValue={row.defaultValue as string | undefined} disabled={Boolean(disabled)}>
            <SelectTrigger className="w-36" {...triggerState}>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      },
      code: (props) => {
        const [invalid, rootProps] = pick(props, "aria-invalid")
        return `${jsxOpen("Select", { items: expr("fruits"), ...rootProps })}
  ${jsxOpen("SelectTrigger", { className: "w-36", "aria-invalid": invalid })}
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    {fruits.map((fruit) => (
      <SelectItem key={fruit.value} value={fruit.value}>
        {fruit.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>`
      },
    },
    examples: examples("select", [
      ["SelectBasic", "Basic"],
      ["SelectGroups", "Groups with label"],
      ["SelectSmall", "Small"],
    ]),
  },
  {
    slug: "slider",
    name: "Slider",
    category: "Forms",
    description: "Lets the user select a value or range from within a given range.",
    files: ["slider"],
    states: {
      columns: ["default", "disabled"],
      rows: [
        { label: "Single", props: { defaultValue: 50 } },
        { label: "Range", props: { defaultValue: expr("[25, 75]") } },
      ],
      render: (row, state) => (
        <Slider
          className="w-40"
          aria-label="Slider"
          defaultValue={typeof row.defaultValue === "number" ? row.defaultValue : [25, 75]}
          {...state}
        />
      ),
      code: (props) => jsx("Slider", { ...props, className: "w-40", "aria-label": "Slider" }),
    },
    examples: examples("select", [
      ["SliderBasic", "Basic"],
      ["SliderRange", "Range"],
      ["SliderDisabled", "Disabled"],
    ]),
  },

  // Feedback
  {
    slug: "alert",
    name: "Alert",
    category: "Feedback",
    description: "Displays a callout for important, contextual information.",
    files: ["alert"],
    examples: examples("feedback", [
      ["AlertDefault", "Default"],
      ["AlertDestructive", "Destructive"],
      ["AlertWithAction", "With action"],
    ]),
  },
  {
    slug: "progress",
    name: "Progress",
    category: "Feedback",
    description: "Shows the completion progress of a task.",
    files: ["progress"],
    examples: examples("feedback", [
      ["ProgressValues", "Values", "0%, 33% and 100%."],
      ["ProgressWithLabel", "With label & value"],
    ]),
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "Feedback",
    description: "A placeholder shown while content is loading.",
    files: ["skeleton"],
    examples: examples("feedback", [
      ["SkeletonCard", "Profile"],
      ["SkeletonMedia", "Media card"],
    ]),
  },
  {
    slug: "toast",
    name: "Toast",
    category: "Feedback",
    description: "A brief, non-blocking notification. Mount <Toaster /> once at the root of your app.",
    files: ["sonner"],
    examples: examples("feedback", [
      ["ToastTypes", "Types"],
      ["ToastWithAction", "With description & action"],
      ["ToastPromise", "Promise"],
    ]),
  },

  // Overlays
  {
    slug: "dialog",
    name: "Dialog",
    category: "Overlays",
    description: "A modal window that interrupts the user and requires a response.",
    files: ["dialog"],
    examples: examples("overlay", [
      ["DialogBasic", "Form dialog"],
      ["DialogConfirm", "Confirmation", "Hide the close button when the user must choose an action."],
    ]),
  },
  {
    slug: "popover",
    name: "Popover",
    category: "Overlays",
    description: "Rich content in a floating panel, anchored to a trigger.",
    files: ["popover"],
    examples: examples("overlay", [["PopoverBasic", "With form"]]),
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Overlays",
    description: "A short label shown on hover or keyboard focus. Wrap your app in <TooltipProvider />.",
    files: ["tooltip"],
    examples: examples("overlay", [
      ["TooltipBasic", "Basic"],
      ["TooltipSides", "Sides"],
    ]),
  },

  // Display & layout
  {
    slug: "card",
    name: "Card",
    category: "Display & layout",
    description: "Groups related content and actions in a container. The cover variant is a square, record-sleeve card for images.",
    files: ["card"],
    states: {
      columns: ["default", "hover"],
      rows: [
        { label: "Cover · image", props: { media: true } },
        { label: "Cover · surface", props: {} },
      ],
      render: (row, state) => (
        <Card variant="cover" size="sm" className={row.media ? "w-44" : "w-44 bg-rosa-chiaro-200"} {...state}>
          {row.media && <CardMedia src={cuorePalpebre} alt="" />}
          <CardOverlay>
            <div className="grid gap-1">
              <CardTitle>Sotto cassa</CardTitle>
              <CardDescription>Giovedì 23:00</CardDescription>
            </div>
            <Button size="sm">Biglietti</Button>
          </CardOverlay>
        </Card>
      ),
      code: (props) =>
        [
          props.media ? '<Card variant="cover">' : '<Card variant="cover" className="bg-rosa-chiaro-200">',
          props.media && '  <CardMedia src={cover} alt="" />',
          "  <CardOverlay>",
          '    <div className="grid gap-1">',
          "      <CardTitle>Sotto cassa</CardTitle>",
          "      <CardDescription>Giovedì 23:00</CardDescription>",
          "    </div>",
          '    <Button size="sm">Biglietti</Button>',
          "  </CardOverlay>",
          "</Card>",
        ]
          .filter(Boolean)
          .join("\n"),
    },
    examples: examples("display", [
      ["CardBasic", "With header action & footer"],
      ["CardForm", "Login form"],
      ["CardSmall", "Small"],
      ["CardCoverImage", "Cover · image", "Square, record-sleeve card. Hover or focus reveals title and subtitle at the top and the CTA at the bottom-left. On touch screens the details are always visible."],
      ["CardCoverSurface", "Cover · surface color", "No media: any surface or palette color works as the background."],
      ["CardCoverGrid", "Cover · grid"],
    ]),
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "Display & layout",
    description: "An image representing a user, with a fallback.",
    files: ["avatar"],
    examples: examples("display", [
      ["AvatarBasic", "Image, fallback & badge"],
      ["AvatarSizes", "Sizes"],
      ["AvatarGroupDemo", "Group"],
    ]),
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "Display & layout",
    description: "Vertically stacked headings that reveal a section of content.",
    files: ["accordion"],
    examples: examples("display", [
      ["AccordionBasic", "Single", "The third item is disabled."],
      ["AccordionMultiple", "Multiple"],
    ]),
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Display & layout",
    description: "Layered sections of content, displayed one at a time.",
    files: ["tabs"],
    examples: examples("display", [
      ["TabsDefault", "Default", "The Billing tab is disabled."],
      ["TabsLine", "Line"],
      ["TabsVertical", "Vertical"],
    ]),
  },
  {
    slug: "separator",
    name: "Separator",
    category: "Display & layout",
    description: "Visually or semantically separates content.",
    files: ["separator"],
    examples: examples("display", [["SeparatorDemo", "Horizontal & vertical"]]),
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    category: "Display & layout",
    description: "Native scrolling with custom, theme-aware scrollbars.",
    files: ["scroll-area"],
    examples: examples("display", [
      ["ScrollAreaVertical", "Vertical"],
      ["ScrollAreaHorizontal", "Horizontal"],
    ]),
  },
]

export const registry: ComponentEntry[] = entries.map(({ files, ...entry }) => ({
  ...entry,
  sources: sources(...files),
}))

export function findComponent(slug: string) {
  return registry.find((entry) => entry.slug === slug)
}
