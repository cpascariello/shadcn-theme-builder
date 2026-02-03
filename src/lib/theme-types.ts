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
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
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
  lightColor: string;
  darkColor: string;
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
  spacing: string;
  letterSpacing: string;
  fonts: FontConfig;
  shadow: ShadowConfig;
  shadowPreset: ShadowPreset;
}

export interface ColorGroup {
  label: string;
  variables: (keyof ThemeColors)[];
}

export const COLOR_GROUPS: ColorGroup[] = [
  { label: "Backgrounds", variables: ["background", "card", "card-foreground", "popover", "popover-foreground", "muted", "muted-foreground"] },
  { label: "Text", variables: ["foreground", "primary-foreground", "secondary-foreground", "accent-foreground", "destructive-foreground", "sidebar-foreground", "sidebar-primary-foreground", "sidebar-accent-foreground"] },
  { label: "Accents", variables: ["primary", "secondary", "accent", "destructive", "sidebar-primary", "sidebar-accent"] },
  { label: "Borders", variables: ["border", "input", "ring", "sidebar-border", "sidebar-ring"] },
  { label: "Charts", variables: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  { label: "Sidebar", variables: ["sidebar"] },
];
