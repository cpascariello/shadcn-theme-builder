"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DeleteDialog() {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          This action cannot be undone. This will permanently delete your account
          and remove all your data from our servers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Type &apos;delete&apos; to confirm</Label>
          <Input placeholder="delete" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1">
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
