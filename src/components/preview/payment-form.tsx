"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Lock } from "lucide-react"

export function PaymentForm() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter your payment information</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name-on-card">Name on card</Label>
            <Input id="name-on-card" placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-number">Card number</Label>
            <div className="relative">
              <Input
                id="card-number"
                placeholder="4242 4242 4242 4242"
                className="pr-10"
              />
              <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry</Label>
              <Select>
                <SelectTrigger id="expiry">
                  <SelectValue placeholder="MM/YY" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01/26">01/26</SelectItem>
                  <SelectItem value="02/26">02/26</SelectItem>
                  <SelectItem value="03/26">03/26</SelectItem>
                  <SelectItem value="04/26">04/26</SelectItem>
                  <SelectItem value="05/26">05/26</SelectItem>
                  <SelectItem value="06/26">06/26</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="San Francisco" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Zip</Label>
                <Input id="zip" placeholder="94103" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="save-payment" />
            <Label htmlFor="save-payment" className="font-normal">
              Save payment information for future purchases
            </Label>
          </div>

          <Button className="w-full">
            <Lock className="mr-2 h-4 w-4" />
            Pay $49.99
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
