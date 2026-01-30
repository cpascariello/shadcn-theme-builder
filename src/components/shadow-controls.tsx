"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";
import { ShadowPreset } from "@/lib/theme-types";
import { oklchToHex } from "@/lib/color-utils";
import { RotateCcw } from "lucide-react";

const PRESET_OPTIONS: { value: ShadowPreset; label: string }[] = [
  { value: "none", label: "None" },
  { value: "subtle", label: "Subtle" },
  { value: "medium", label: "Medium" },
  { value: "strong", label: "Strong" },
  { value: "brutalist", label: "Brutalist" },
  { value: "custom", label: "Custom" },
];

export function ShadowControls() {
  const { shadow, shadowPreset, setShadow, setShadowPreset, resetShadow } = useTheme();

  return (
    <div className="space-y-3">
      {/* Preset selector + reset */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">Preset</span>
        <div className="flex items-center gap-2">
          <Select value={shadowPreset} onValueChange={(v) => setShadowPreset(v as ShadowPreset)}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESET_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetShadow} title="Reset shadow">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Shadow color */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-16">Color</span>
        <ShadowColorPicker />
      </div>

      {/* Offset X */}
      <SliderRow
        label="X"
        value={shadow.offsetX}
        min={-20}
        max={20}
        unit="px"
        onChange={(v) => setShadow({ offsetX: v })}
      />

      {/* Offset Y */}
      <SliderRow
        label="Y"
        value={shadow.offsetY}
        min={-20}
        max={20}
        unit="px"
        onChange={(v) => setShadow({ offsetY: v })}
      />

      {/* Blur */}
      <SliderRow
        label="Blur"
        value={shadow.blur}
        min={0}
        max={50}
        unit="px"
        onChange={(v) => setShadow({ blur: v })}
      />

      {/* Spread */}
      <SliderRow
        label="Spread"
        value={shadow.spread}
        min={-20}
        max={20}
        unit="px"
        onChange={(v) => setShadow({ spread: v })}
      />

      {/* Opacity */}
      <SliderRow
        label="Opacity"
        value={shadow.opacity * 100}
        min={0}
        max={100}
        unit="%"
        onChange={(v) => setShadow({ opacity: v / 100 })}
      />
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-16">{label}</span>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={1}
        className="flex-1"
      />
      <span className="text-xs text-muted-foreground w-12 text-right font-mono">
        {Math.round(value)}{unit}
      </span>
    </div>
  );
}

function ShadowColorPicker() {
  const { shadow, setShadow, previewMode } = useTheme();
  const colorKey = previewMode === "light" ? "lightColor" : "darkColor";
  const color = shadow[colorKey] ?? "";

  const hexValue = color.startsWith("#")
    ? color
    : oklchToHex(color) || "#000000";

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShadow({ [colorKey]: e.target.value });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShadow({ [colorKey]: e.target.value });
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      <input
        type="color"
        value={hexValue}
        className="w-8 h-8 rounded border cursor-pointer"
        onChange={handleColorChange}
      />
      <input
        type="text"
        value={color}
        onChange={handleTextChange}
        className="flex-1 h-8 px-2 text-xs font-mono border rounded bg-background"
      />
    </div>
  );
}
