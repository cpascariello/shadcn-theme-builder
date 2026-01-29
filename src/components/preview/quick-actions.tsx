"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download, Share2 } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full">
            <span className="flex items-center gap-2 justify-center">
              <Plus className="h-4 w-4" />
              New Item
            </span>
          </Button>
          <Button variant="outline" className="w-full">
            <span className="flex items-center gap-2 justify-center">
              <Upload className="h-4 w-4" />
              Upload
            </span>
          </Button>
          <Button variant="outline" className="w-full">
            <span className="flex items-center gap-2 justify-center">
              <Download className="h-4 w-4" />
              Export
            </span>
          </Button>
          <Button variant="outline" className="w-full">
            <span className="flex items-center gap-2 justify-center">
              <Share2 className="h-4 w-4" />
              Share
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
