"use client";

import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/theme-context";
import { oklchToHex, hexToOklch } from "@/lib/color-utils";
import { ThemeColors } from "@/lib/theme-types";

interface ColorRowProps {
  variableKey: keyof ThemeColors;
  mode: "light" | "dark";
}

export function ColorRow({ variableKey, mode }: ColorRowProps) {
  const { light, dark, setColor } = useTheme();

  const currentValue = mode === "light" ? light[variableKey] : dark[variableKey];
  const hexValue = oklchToHex(currentValue);

  return (
    <div className="space-y-1 py-1">
      <span className="text-xs text-muted-foreground">{variableKey}</span>
      <div className="flex items-center gap-2">
        {/* Color swatch with hidden native color picker layered on top */}
        <div className="relative h-8 w-8 shrink-0">
          <div
            className="absolute inset-0 rounded border border-border"
            style={{ backgroundColor: currentValue }}
          />
          <input
            type="color"
            className="absolute inset-0 opacity-0 cursor-pointer"
            value={hexValue}
            onChange={(e) => {
              const newOklch = hexToOklch(e.target.value);
              setColor(mode, variableKey, newOklch);
            }}
          />
        </div>

        {/* OKLCH text input */}
        <Input
          className="text-xs font-mono flex-1 shadow-xs"
          value={currentValue}
          onChange={(e) => setColor(mode, variableKey, e.target.value)}
        />
      </div>
    </div>
  );
}
