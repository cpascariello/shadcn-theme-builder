import type { ShadowConfig, ShadowPreset } from "./theme-types";

export const SHADOW_PRESETS: Record<Exclude<ShadowPreset, "custom">, ShadowConfig> = {
  none: {
    color: "oklch(0 0 0)",
    offsetX: 0,
    offsetY: 0,
    blur: 0,
    spread: 0,
    opacity: 0,
  },
  subtle: {
    color: "oklch(0.2 0 0)",
    offsetX: 0,
    offsetY: 1,
    blur: 3,
    spread: 0,
    opacity: 0.1,
  },
  medium: {
    color: "oklch(0.2 0 0)",
    offsetX: 0,
    offsetY: 4,
    blur: 6,
    spread: -1,
    opacity: 0.1,
  },
  strong: {
    color: "oklch(0.2 0 0)",
    offsetX: 0,
    offsetY: 10,
    blur: 15,
    spread: -3,
    opacity: 0.15,
  },
  brutalist: {
    color: "oklch(0.6258 0.1775 348.3615)",
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

  // Extract oklch values and add opacity
  const colorWithOpacity = color.replace(")", ` / ${opacity})`);
  return `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${colorWithOpacity}`;
}
