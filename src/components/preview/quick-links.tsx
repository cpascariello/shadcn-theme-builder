"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, HelpCircle, Settings, BookOpen, ExternalLink } from "lucide-react"

const links = [
  { icon: FileText, label: "Documentation" },
  { icon: HelpCircle, label: "Help Center" },
  { icon: BookOpen, label: "API Reference" },
  { icon: Settings, label: "System Status" },
]

export function QuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {links.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
