"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MapPin } from "lucide-react"

export function UserProfileCard() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center pt-6">
        <Avatar className="h-16 w-16">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h3 className="mt-4 text-lg font-semibold">Jane Cooper</h3>
        <p className="text-sm text-muted-foreground">Product Designer</p>
        <Badge className="mt-2">Pro</Badge>
        <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>San Francisco, CA</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>jane@example.com</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button>Message</Button>
          <Button variant="outline">Follow</Button>
        </div>
      </CardContent>
    </Card>
  )
}
