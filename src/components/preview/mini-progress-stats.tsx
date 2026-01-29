"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function MiniProgressStats() {
  const items = [
    { label: "Storage", value: 72 },
    { label: "Bandwidth", value: 45 },
    { label: "API Calls", value: 89 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-sm">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.value}%</span>
              </div>
              <Progress value={item.value} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
