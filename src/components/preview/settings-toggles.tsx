"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const settings = [
  { id: "email-notifications", label: "Email Notifications", description: "Receive email updates", defaultChecked: true },
  { id: "push-notifications", label: "Push Notifications", description: "Mobile push alerts", defaultChecked: true },
  { id: "marketing", label: "Marketing", description: "Receive marketing emails", defaultChecked: false },
  { id: "two-factor-auth", label: "Two-factor Auth", description: "Extra security layer", defaultChecked: true },
  { id: "analytics", label: "Analytics", description: "Share usage data", defaultChecked: false },
]

export function SettingsToggles() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {settings.map((setting, index) => (
          <div key={setting.id}>
            {index > 0 && <Separator className="my-4" />}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={setting.id} className="text-sm font-medium">
                  {setting.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch id={setting.id} defaultChecked={setting.defaultChecked} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
