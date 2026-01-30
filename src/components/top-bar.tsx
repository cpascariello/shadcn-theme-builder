"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { presets } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ExportDialog } from "@/components/export-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TopBar() {
  const { activePreset, loadPreset, previewMode, setPreviewMode, hueShift, setHueShift } = useTheme();

  return (
    <div className="flex items-center justify-between h-14 border-b px-4 bg-background">
      <span className="font-semibold">ShadCN Theme Builder</span>

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

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium shrink-0">Hue</label>
          <Slider
            value={[hueShift]}
            onValueChange={([v]) => setHueShift(v)}
            min={-180}
            max={180}
            step={1}
            className="w-28"
          />
          <span className="text-xs text-muted-foreground w-10 text-right font-mono tabular-nums">
            {hueShift}&deg;
          </span>
        </div>

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

        <ExportDialog />
      </div>
    </div>
  );
}
