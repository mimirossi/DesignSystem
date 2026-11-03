import { toast } from "sonner"

export async function copyToClipboard(text: string, label = "Code") {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
    return true
  } catch {
    toast.error("Could not access the clipboard")
    return false
  }
}
