"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { presets } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TopBar() {
  const { activePreset, loadPreset, previewMode, setPreviewMode } = useTheme();

  return (
    <div className="flex items-center justify-between h-14 border-b px-4 bg-background">
      <span className="font-semibold">shadcn Theme Builder</span>

      <div className="flex items-center gap-2">
        <Select value={activePreset} onValueChange={loadPreset}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.name} value={preset.name}>
                {preset.label}
              </SelectItem>
            ))}
            {activePreset === "custom" && (
              <SelectItem value="custom" disabled>
                Custom
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setPreviewMode(previewMode === "light" ? "dark" : "light")
          }
        >
          {previewMode === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        <Button variant="default">Export</Button>
      </div>
    </div>
  );
}
