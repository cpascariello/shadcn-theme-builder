"use client";

import { useRef } from "react";
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
  const colorInputRef = useRef<HTMLInputElement>(null);

  const currentValue = mode === "light" ? light[variableKey] : dark[variableKey];
  const hexValue = oklchToHex(currentValue);

  return (
    <div className="flex items-center gap-2 py-1">
      {/* Label - the variable key name, smaller text */}
      <span className="text-xs text-muted-foreground w-28 truncate">{variableKey}</span>

      {/* Color swatch button - clickable, opens hidden native color picker */}
      <button
        className="h-6 w-6 rounded border border-border shrink-0 cursor-pointer"
        style={{ backgroundColor: currentValue }}
        onClick={() => colorInputRef.current?.click()}
        title="Pick color"
      />

      {/* Hidden native color input */}
      <input
        ref={colorInputRef}
        type="color"
        className="sr-only"
        value={hexValue}
        onChange={(e) => {
          const newOklch = hexToOklch(e.target.value);
          setColor(mode, variableKey, newOklch);
        }}
      />

      {/* OKLCH text input */}
      <Input
        className="h-7 text-xs font-mono flex-1"
        value={currentValue}
        onChange={(e) => setColor(mode, variableKey, e.target.value)}
      />
    </div>
  );
}
