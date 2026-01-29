"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Users } from "lucide-react"

const stats = [
  {
    label: "Revenue",
    value: "$12,875",
    change: "+12%",
    changeColor: "text-green-600 dark:text-green-400",
    icon: DollarSign,
  },
  {
    label: "Users",
    value: "1,249",
    change: "+8%",
    changeColor: "text-green-600 dark:text-green-400",
    icon: Users,
  },
  {
    label: "Orders",
    value: "342",
    change: "-3%",
    changeColor: "text-destructive",
    icon: TrendingUp,
  },
]

export function QuickStats() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className={`text-xs font-medium ${stat.changeColor}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
