"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/context/theme-context";
import { ShadowPreset } from "@/lib/theme-types";

const PRESET_OPTIONS: { value: ShadowPreset; label: string }[] = [
  { value: "none", label: "None" },
  { value: "subtle", label: "Subtle" },
  { value: "medium", label: "Medium" },
  { value: "strong", label: "Strong" },
  { value: "brutalist", label: "Brutalist" },
  { value: "custom", label: "Custom" },
];

export function ShadowControls() {
  const { shadow, shadowPreset, setShadow, setShadowPreset } = useTheme();

  return (
    <div className="space-y-3">
      {/* Preset selector */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Preset</span>
        <Select value={shadowPreset} onValueChange={(v) => setShadowPreset(v as ShadowPreset)}>
          <SelectTrigger className="w-40 h-8 text-xs">
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
  const { shadow, setShadow } = useTheme();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setShadow({ color: hex });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShadow({ color: e.target.value });
  };

  return (
    <div className="flex items-center gap-2 flex-1">
      <input
        type="color"
        className="w-8 h-8 rounded border cursor-pointer"
        onChange={handleColorChange}
      />
      <input
        type="text"
        value={shadow.color}
        onChange={handleTextChange}
        className="flex-1 h-8 px-2 text-xs font-mono border rounded bg-background"
      />
    </div>
  );
}
