"use client"

import { Bell, MessageSquare, CheckCircle2, UserPlus, Rocket } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const notifications = [
  {
    initials: "SC",
    icon: MessageSquare,
    title: "New comment on your post",
    description: "Sarah Chen commented on \"Getting Started with Design Systems\"",
    time: "2m ago",
  },
  {
    initials: "PM",
    icon: CheckCircle2,
    title: "Payment received",
    description: "You received $1,200.00 from Patrick Miller",
    time: "15m ago",
  },
  {
    initials: "AJ",
    icon: UserPlus,
    title: "User joined team",
    description: "Alex Johnson accepted your invitation to the Engineering team",
    time: "1h ago",
  },
  {
    initials: "CI",
    icon: Rocket,
    title: "Deployment completed",
    description: "Production deploy #384 finished successfully",
    time: "3h ago",
  },
  {
    initials: "LW",
    icon: Bell,
    title: "New follower",
    description: "Lisa Wang started following you",
    time: "5h ago",
  },
]

export function NotificationCenter() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
          <Badge>5</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-0">
        {notifications.map((notification, index) => (
          <div key={index}>
            {index > 0 && <Separator className="my-3" />}
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage />
                <AvatarFallback className="text-xs">
                  {notification.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {notification.time}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
