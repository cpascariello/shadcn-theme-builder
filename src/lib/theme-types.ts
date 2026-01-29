export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
}

export interface FontConfig {
  sans: string;
  serif: string;
  mono: string;
}

export interface ShadowConfig {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  opacity: number;
}

export type ShadowPreset = "none" | "subtle" | "medium" | "strong" | "brutalist" | "custom";

export interface ThemeConfig {
  name: string;
  label: string;
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
  fonts: FontConfig;
  shadow: ShadowConfig;
  shadowPreset: ShadowPreset;
}

export interface ColorGroup {
  label: string;
  variables: (keyof ThemeColors)[];
}

export const COLOR_GROUPS: ColorGroup[] = [
  { label: "Base", variables: ["background", "foreground"] },
  { label: "Card", variables: ["card", "card-foreground"] },
  { label: "Popover", variables: ["popover", "popover-foreground"] },
  { label: "Primary", variables: ["primary", "primary-foreground"] },
  { label: "Secondary", variables: ["secondary", "secondary-foreground"] },
  { label: "Muted", variables: ["muted", "muted-foreground"] },
  { label: "Accent", variables: ["accent", "accent-foreground"] },
  { label: "Destructive", variables: ["destructive", "destructive-foreground"] },
  { label: "Border & Ring", variables: ["border", "input", "ring"] },
  { label: "Charts", variables: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
];
