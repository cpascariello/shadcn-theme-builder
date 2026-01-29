"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Rocket } from "lucide-react"

export function AlertBanner() {
  return (
    <Alert>
      <Rocket className="h-4 w-4" />
      <AlertTitle>New Update Available</AlertTitle>
      <AlertDescription>
        Version 2.4.0 includes performance improvements and new dashboard
        widgets. Update now to get the latest features.
      </AlertDescription>
    </Alert>
  )
}
