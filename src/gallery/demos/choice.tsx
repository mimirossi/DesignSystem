import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export function CheckboxBasic() {
  return (
    <div className="flex items-center gap-gap-sm">
      <Checkbox id="checkbox-terms" />
      <Label htmlFor="checkbox-terms">Accept terms and conditions</Label>
    </div>
  )
}

export function CheckboxWithDescription() {
  return (
    <div className="flex items-start gap-gap-sm">
      <Checkbox id="checkbox-notifications" defaultChecked />
      <div className="grid gap-stack-xs">
        <Label htmlFor="checkbox-notifications">Enable notifications</Label>
        <p className="text-sm text-muted-foreground">You can change this at any time in settings.</p>
      </div>
    </div>
  )
}

export function CheckboxDisabled() {
  return (
    <div className="flex items-center gap-gap-sm">
      <Checkbox id="checkbox-disabled" disabled />
      <Label htmlFor="checkbox-disabled">Can't touch this</Label>
    </div>
  )
}

export function RadioGroupBasic() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-gap-sm">
        <RadioGroupItem value="default" id="radio-default" />
        <Label htmlFor="radio-default">Default</Label>
      </div>
      <div className="flex items-center gap-gap-sm">
        <RadioGroupItem value="comfortable" id="radio-comfortable" />
        <Label htmlFor="radio-comfortable">Comfortable</Label>
      </div>
      <div className="flex items-center gap-gap-sm">
        <RadioGroupItem value="compact" id="radio-compact" disabled />
        <Label htmlFor="radio-compact">Compact (disabled)</Label>
      </div>
    </RadioGroup>
  )
}

export function RadioGroupCards() {
  return (
    <RadioGroup defaultValue="pro" className="w-full max-w-sm">
      {[
        { value: "starter", title: "Starter", description: "For individuals getting started." },
        { value: "pro", title: "Pro", description: "For growing teams that need more." },
      ].map((plan) => (
        <Label
          key={plan.value}
          htmlFor={`plan-${plan.value}`}
          className="flex items-start gap-gap-sm rounded-lg border p-inset-md has-data-checked:border-primary has-data-checked:bg-muted/50"
        >
          <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} />
          <div className="grid gap-stack-xs">
            <span className="font-medium">{plan.title}</span>
            <span className="text-sm font-normal text-muted-foreground">{plan.description}</span>
          </div>
        </Label>
      ))}
    </RadioGroup>
  )
}

export function SwitchBasic() {
  return (
    <div className="flex items-center gap-gap-sm">
      <Switch id="switch-airplane" />
      <Label htmlFor="switch-airplane">Airplane mode</Label>
    </div>
  )
}

export function SwitchSizes() {
  return (
    <div className="flex items-center gap-gap-md">
      <Switch size="sm" defaultChecked aria-label="Small switch" />
      <Switch defaultChecked aria-label="Default switch" />
    </div>
  )
}
