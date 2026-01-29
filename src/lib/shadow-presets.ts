import type { ShadowConfig, ShadowPreset } from "./theme-types";

// Shadow colors adapt to light/dark mode
export const SHADOW_COLOR_LIGHT = "oklch(0.2 0 0)";
export const SHADOW_COLOR_DARK = "oklch(0.9 0 0)";

export function getShadowColor(mode: "light" | "dark"): string {
  return mode === "light" ? SHADOW_COLOR_LIGHT : SHADOW_COLOR_DARK;
}

// Preset geometry — color is applied dynamically based on mode
export const SHADOW_PRESETS: Record<Exclude<ShadowPreset, "custom">, ShadowConfig> = {
  none: {
    color: SHADOW_COLOR_LIGHT,
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    spread: 0,
    opacity: 0,
  },
  subtle: {
    color: SHADOW_COLOR_LIGHT,
    offsetX: 0,
    offsetY: 1,
    blur: 3,
    spread: 0,
    opacity: 0.1,
  },
  medium: {
    color: SHADOW_COLOR_LIGHT,
    offsetX: 0,
    offsetY: 4,
    blur: 6,
    spread: -1,
    opacity: 0.1,
  },
  strong: {
    color: SHADOW_COLOR_LIGHT,
    offsetX: 0,
    offsetY: 10,
    blur: 15,
    spread: -3,
    opacity: 0.15,
  },
  brutalist: {
    color: SHADOW_COLOR_LIGHT,
    offsetX: 3,
    offsetY: 3,
    blur: 0,
    spread: 0,
    opacity: 1.0,
  },
};

export function buildShadowValue(shadow: ShadowConfig): string {
  const { color, offsetX, offsetY, blur, spread, opacity } = shadow;
  if (opacity === 0) return "none";

  // Handle both oklch and hex color formats
  let colorWithOpacity: string;
  if (color.startsWith("oklch(")) {
    colorWithOpacity = color.replace(")", ` / ${opacity})`);
  } else if (color.startsWith("#")) {
    // Hex color - use rgba format for opacity
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    colorWithOpacity = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else {
    // Fallback - assume it can take opacity
    colorWithOpacity = color;
  }

  return `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${colorWithOpacity}`;
}
