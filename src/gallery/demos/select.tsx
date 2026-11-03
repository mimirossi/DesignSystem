import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function SelectBasic() {
  const fruits = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes" },
  ]

  return (
    <Select items={fruits}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {fruits.map((fruit) => (
            <SelectItem key={fruit.value} value={fruit.value}>
              {fruit.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function SelectGroups() {
  const timezones = [
    { label: "Eastern (ET)", value: "et", region: "North America" },
    { label: "Pacific (PT)", value: "pt", region: "North America" },
    { label: "Central European (CET)", value: "cet", region: "Europe" },
    { label: "Greenwich (GMT)", value: "gmt", region: "Europe" },
  ]

  return (
    <div className="grid gap-2">
      <Label>Timezone</Label>
      <Select items={timezones} defaultValue="cet">
        <SelectTrigger className="w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {["North America", "Europe"].map((region, index) => (
            <SelectGroup key={region}>
              {index > 0 && <SelectSeparator />}
              <SelectLabel>{region}</SelectLabel>
              {timezones
                .filter((tz) => tz.region === region)
                .map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function SelectSmall() {
  const sizes = [
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
  ]

  return (
    <Select items={sizes} defaultValue="md">
      <SelectTrigger size="sm" className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sizes.map((size) => (
          <SelectItem key={size.value} value={size.value}>
            {size.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function SliderBasic() {
  return <Slider defaultValue={50} max={100} step={1} className="w-full max-w-xs" aria-label="Volume" />
}

export function SliderRange() {
  return <Slider defaultValue={[25, 75]} max={100} step={5} className="w-full max-w-xs" aria-label="Price range" />
}

export function SliderDisabled() {
  return <Slider defaultValue={40} disabled className="w-full max-w-xs" aria-label="Disabled slider" />
}
