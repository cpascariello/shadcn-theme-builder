"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone, Tablet } from "lucide-react"

const sessions = [
  {
    icon: Monitor,
    device: "MacBook Pro",
    location: "San Francisco, CA",
    status: "Active" as const,
  },
  {
    icon: Smartphone,
    device: "iPhone 15",
    location: "San Francisco, CA",
    status: "Idle" as const,
  },
  {
    icon: Tablet,
    device: "iPad Air",
    location: "New York, NY",
    status: "Idle" as const,
  },
]

export function ActiveSessions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.device} className="flex items-center gap-3">
              <session.icon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{session.device}</p>
                <p className="text-xs text-muted-foreground">{session.location}</p>
              </div>
              <Badge variant={session.status === "Active" ? "default" : "secondary"}>
                {session.status}
              </Badge>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-4 w-full">
          Revoke All
        </Button>
      </CardContent>
    </Card>
  )
}
