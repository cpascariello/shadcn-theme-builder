"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

const members = [
  { name: "Alice Martin", role: "Lead Designer", initials: "AM" },
  { name: "Bob Smith", role: "Developer", initials: "BS" },
  { name: "Carol White", role: "PM", initials: "CW" },
  { name: "David Lee", role: "Developer", initials: "DL" },
  { name: "Eva Chen", role: "QA Engineer", initials: "EC" },
]

export function TeamMembers() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Team</CardTitle>
        <Button size="sm" variant="outline">
          <UserPlus className="h-4 w-4" />
          Invite
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.name} className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
