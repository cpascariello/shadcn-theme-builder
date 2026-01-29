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
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
          <span className="text-sm text-primary cursor-pointer hover:underline">
            Forgot password?
          </span>
        </div>
        <Button className="w-full">Sign In</Button>
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or continue with</span>
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">GitHub</Button>
          <Button variant="outline">Google</Button>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span className="font-medium text-primary cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
