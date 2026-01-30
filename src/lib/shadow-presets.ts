import type { ShadowConfig, ShadowPreset } from "./theme-types";

// Shadow colors adapt to light/dark mode
export const SHADOW_COLOR_LIGHT = "oklch(0.2 0 0)";
export const SHADOW_COLOR_DARK = "oklch(0.9 0 0)";

// Preset geometry — color is applied dynamically based on mode
export const SHADOW_PRESETS: Record<Exclude<ShadowPreset, "custom">, ShadowConfig> = {
  none: {
    lightColor: SHADOW_COLOR_LIGHT,
    darkColor: SHADOW_COLOR_DARK,
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    spread: 0,
    opacity: 0,
  },
  subtle: {
    lightColor: SHADOW_COLOR_LIGHT,
    darkColor: SHADOW_COLOR_DARK,
    offsetX: 0,
    offsetY: 1,
    blur: 3,
    spread: 0,
    opacity: 0.1,
  },
  medium: {
    lightColor: SHADOW_COLOR_LIGHT,
    darkColor: SHADOW_COLOR_DARK,
    offsetX: 0,
    offsetY: 4,
    blur: 6,
    spread: -1,
    opacity: 0.1,
  },
  strong: {
    lightColor: SHADOW_COLOR_LIGHT,
    darkColor: SHADOW_COLOR_DARK,
    offsetX: 0,
    offsetY: 10,
    blur: 15,
    spread: -3,
    opacity: 0.15,
  },
  brutalist: {
    lightColor: SHADOW_COLOR_LIGHT,
    darkColor: SHADOW_COLOR_DARK,
    offsetX: 3,
    offsetY: 3,
    blur: 0,
    spread: 0,
    opacity: 1.0,
  },
};

export function buildShadowValue(shadow: ShadowConfig, mode: "light" | "dark"): string {
  const color = mode === "light" ? shadow.lightColor : shadow.darkColor;
  const { offsetX, offsetY, blur, spread, opacity } = shadow;
  if (opacity === 0) return "none";

  // Handle both oklch and hex color formats
  let colorWithOpacity: string;
  if (color.startsWith("oklch(")) {
    colorWithOpacity = color.replace(")", ` / ${opacity})`);
  } else if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    colorWithOpacity = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else {
    colorWithOpacity = color;
  }

  return `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${colorWithOpacity}`;
}

export function buildShadowTiers(shadow: ShadowConfig, mode: "light" | "dark"): Record<string, string> {
  const color = mode === "light" ? shadow.lightColor : shadow.darkColor;
  const { offsetX, offsetY, blur, spread, opacity } = shadow;

  if (opacity === 0) {
    return {
      "--shadow-2xs": "none",
      "--shadow-xs": "none",
      "--shadow-sm": "none",
      "--shadow": "none",
      "--shadow-md": "none",
      "--shadow-lg": "none",
      "--shadow-xl": "none",
      "--shadow-2xl": "none",
    };
  }

  const c = (op: number) => {
    if (color.startsWith("oklch(")) {
      return color.replace(")", ` / ${op.toFixed(2)})`);
    }
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${op})`;
    }
    return color;
  };

  const dimOp = opacity * 0.25;
  const fullOp = opacity;
  const x = offsetX;
  const y = offsetY;

  return {
    "--shadow-2xs": `${x}px ${y}px ${blur}px ${spread}px ${c(dimOp)}`,
    "--shadow-xs": `${x}px ${y}px ${blur}px ${spread}px ${c(dimOp)}`,
    "--shadow-sm": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 1px 2px -1px ${c(fullOp)}`,
    "--shadow": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 1px 2px -1px ${c(fullOp)}`,
    "--shadow-md": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 2px 4px -1px ${c(fullOp)}`,
    "--shadow-lg": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 4px 6px -1px ${c(fullOp)}`,
    "--shadow-xl": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 8px 10px -1px ${c(fullOp)}`,
    "--shadow-2xl": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp * 2.5)}`,
  };
}
