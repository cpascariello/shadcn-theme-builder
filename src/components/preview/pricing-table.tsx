"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check } from "lucide-react"

export function PricingTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Plans</CardTitle>
        <CardDescription>
          Choose the plan that works best for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Free Plan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Free</h3>
            <Badge variant="secondary">Current</Badge>
          </div>
          <p className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Up to 3 projects
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Basic analytics
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Community support
            </li>
          </ul>
          <Button variant="outline" disabled className="w-full">
            Current Plan
          </Button>
        </div>

        <Separator />

        {/* Pro Plan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Pro</h3>
            <Badge>Popular</Badge>
          </div>
          <p className="text-3xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Unlimited projects
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Advanced analytics
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Priority support
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Custom domains
            </li>
            <li className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              Team collaboration
            </li>
          </ul>
          <Button className="w-full">Upgrade to Pro</Button>
        </div>
      </CardContent>
    </Card>
  )
}
