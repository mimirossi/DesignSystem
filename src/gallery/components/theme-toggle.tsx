import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const OPTIONS = [
  { value: "light", label: "Light theme", Icon: SunIcon },
  { value: "dark", label: "Dark theme", Icon: MoonIcon },
  { value: "system", label: "System theme", Icon: MonitorIcon },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup
      value={[theme]}
      onValueChange={(value) => value[0] && setTheme(value[0] as (typeof OPTIONS)[number]["value"])}
      size="sm"
      spacing={0}
      variant="outline"
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <ToggleGroupItem key={value} value={value} aria-label={label}>
          <Icon />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
