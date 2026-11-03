import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

export function AlertDefault() {
  return (
    <Alert className="max-w-md">
      <CheckCircle2Icon />
      <AlertTitle>Changes saved</AlertTitle>
      <AlertDescription>Your profile has been updated successfully.</AlertDescription>
    </Alert>
  )
}

export function AlertDestructive() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>Please verify your billing information and try again.</AlertDescription>
    </Alert>
  )
}

export function AlertWithAction() {
  return (
    <Alert className="max-w-md">
      <InfoIcon />
      <AlertTitle>New version available</AlertTitle>
      <AlertDescription>Reload to get the latest features.</AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Reload
        </Button>
      </AlertAction>
    </Alert>
  )
}

export function ProgressValues() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <Progress value={0} aria-label="Not started" />
      <Progress value={33} aria-label="In progress" />
      <Progress value={100} aria-label="Complete" />
    </div>
  )
}

export function ProgressWithLabel() {
  return (
    <Progress value={56} className="w-full max-w-sm">
      <ProgressLabel>Uploading files</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
}

export function SkeletonCard() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  )
}

export function SkeletonMedia() {
  return (
    <div className="grid w-64 gap-3">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function ToastTypes() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Event has been created")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Profile updated")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("A new version is available")}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Your trial ends in 3 days")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Something went wrong")}>
        Error
      </Button>
    </div>
  )
}

export function ToastWithAction() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Message archived", {
          description: "Monday, November 3 at 9:00 AM",
          action: { label: "Undo", onClick: () => toast.success("Restored") },
        })
      }
    >
      Archive message
    </Button>
  )
}

export function ToastPromise() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
          loading: "Saving…",
          success: "Saved!",
          error: "Could not save",
        })
      }
    >
      Save with promise
    </Button>
  )
}
