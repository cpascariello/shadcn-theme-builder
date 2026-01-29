"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, CheckCircle2 } from "lucide-react"

const files = [
  { name: "design-system.fig", size: "2.4 MB", status: "completed" as const },
  { name: "requirements.pdf", size: "1.8 MB", status: "completed" as const },
  { name: "assets.zip", size: "4.2 MB", status: "uploading" as const, progress: 67 },
]

export function FileUpload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm font-medium mt-2">Drag & drop files here</p>
          <p className="text-xs text-muted-foreground">or</p>
          <Button variant="outline" size="sm" className="mt-2">
            Browse Files
          </Button>
        </div>

        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.name} className="flex items-center gap-3">
              <File className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{file.name}</p>
                {file.status === "completed" ? (
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={file.progress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{file.progress}%</span>
                  </div>
                )}
              </div>
              {file.status === "completed" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              ) : (
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
