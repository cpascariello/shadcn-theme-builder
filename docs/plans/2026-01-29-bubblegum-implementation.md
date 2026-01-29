# Bubblegum Theme + Extended Controls - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply Bubblegum neo-brutalist theme and add Google Fonts picker + shadow controls with presets to the theme builder.

**Architecture:** Extend existing theme context with fonts/shadow state. Add new UI components for font dropdowns and shadow sliders. Dynamic Google Font loading via injected link tags. Shadow presets auto-populate sliders, manual adjustment switches to "custom".

**Tech Stack:** React 19, Next.js 16, Tailwind CSS 4, shadcn/ui components, Google Fonts API

---

## Task 1: Add Font and Shadow Types

**Files:**
- Modify: `src/lib/theme-types.ts`

**Step 1: Add the new type definitions**

Add after the existing `ThemeColors` interface:

```typescript
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
```

**Step 2: Update ThemeConfig interface**

Change the `ThemeConfig` interface to include fonts and shadow:

```typescript
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
```

**Step 3: Commit**

```bash
git add src/lib/theme-types.ts
git commit -m "feat: add Font and Shadow type definitions"
```

---

## Task 2: Create Font Definitions and Loader Hook

**Files:**
- Create: `src/lib/fonts.ts`

**Step 1: Create the fonts file with font lists and loader**

```typescript
export const FONT_OPTIONS = {
  sans: [
    { name: "Inter", value: "Inter" },
    { name: "Poppins", value: "Poppins" },
    { name: "Roboto", value: "Roboto" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Nunito", value: "Nunito" },
    { name: "Work Sans", value: "Work Sans" },
    { name: "DM Sans", value: "DM Sans" },
  ],
  serif: [
    { name: "Lora", value: "Lora" },
    { name: "Merriweather", value: "Merriweather" },
    { name: "Playfair Display", value: "Playfair Display" },
    { name: "Source Serif Pro", value: "Source Serif 4" },
    { name: "Crimson Text", value: "Crimson Text" },
    { name: "Libre Baskerville", value: "Libre Baskerville" },
  ],
  mono: [
    { name: "JetBrains Mono", value: "JetBrains Mono" },
    { name: "Fira Code", value: "Fira Code" },
    { name: "Source Code Pro", value: "Source Code Pro" },
    { name: "IBM Plex Mono", value: "IBM Plex Mono" },
    { name: "Roboto Mono", value: "Roboto Mono" },
  ],
} as const;

export type FontCategory = keyof typeof FONT_OPTIONS;

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontName: string): void {
  if (loadedFonts.has(fontName) || typeof document === "undefined") return;

  const linkId = `google-font-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(linkId)) {
    loadedFonts.add(fontName);
    return;
  }

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontName);
}

export function getFontStack(fontName: string, category: FontCategory): string {
  const fallbacks = {
    sans: "ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    mono: "ui-monospace, SFMono-Regular, monospace",
  };
  return `"${fontName}", ${fallbacks[category]}`;
}
```

**Step 2: Commit**

```bash
git add src/lib/fonts.ts
git commit -m "feat: add Google Fonts definitions and dynamic loader"
```

---

## Task 3: Create Shadow Preset Definitions

**Files:**
- Create: `src/lib/shadow-presets.ts`

**Step 1: Create the shadow presets file**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/lib/shadow-presets.ts
git commit -m "feat: add shadow preset definitions"
```

---

## Task 4: Add Bubblegum Preset to Presets List

**Files:**
- Modify: `src/lib/presets.ts`

**Step 1: Add imports at the top**

```typescript
import type { ThemeConfig } from "./theme-types";
```

**Step 2: Add Bubblegum as the FIRST preset in the array**

Insert at the beginning of the `presets` array (before "default"):

```typescript
{
  name: "bubblegum",
  label: "Bubblegum",
  light: {
    background: "oklch(0.9399 0.0203 345.6984)",
    foreground: "oklch(0.4712 0 0)",
    card: "oklch(0.9498 0.0500 86.8891)",
    "card-foreground": "oklch(0.4712 0 0)",
    popover: "oklch(1 0 0)",
    "popover-foreground": "oklch(0.4712 0 0)",
    primary: "oklch(0.6209 0.1801 348.1385)",
    "primary-foreground": "oklch(1 0 0)",
    secondary: "oklch(0.8095 0.0694 198.1863)",
    "secondary-foreground": "oklch(0.3211 0 0)",
    muted: "oklch(0.8800 0.0504 212.0952)",
    "muted-foreground": "oklch(0.5795 0 0)",
    accent: "oklch(0.9195 0.0801 87.6670)",
    "accent-foreground": "oklch(0.3211 0 0)",
    destructive: "oklch(0.7091 0.1697 21.9551)",
    "destructive-foreground": "oklch(1 0 0)",
    border: "oklch(0.6209 0.1801 348.1385)",
    input: "oklch(0.9189 0 0)",
    ring: "oklch(0.7002 0.1597 350.7532)",
    "chart-1": "oklch(0.7002 0.1597 350.7532)",
    "chart-2": "oklch(0.8189 0.0799 212.0892)",
    "chart-3": "oklch(0.9195 0.0801 87.6670)",
    "chart-4": "oklch(0.7998 0.1110 348.1791)",
    "chart-5": "oklch(0.6197 0.1899 353.9091)",
  },
  dark: {
    background: "oklch(0.2497 0.0305 234.1628)",
    foreground: "oklch(0.9306 0.0197 349.0784)",
    card: "oklch(0.2902 0.0299 233.5352)",
    "card-foreground": "oklch(0.9306 0.0197 349.0784)",
    popover: "oklch(0.2902 0.0299 233.5352)",
    "popover-foreground": "oklch(0.9306 0.0197 349.0784)",
    primary: "oklch(0.9195 0.0801 87.6670)",
    "primary-foreground": "oklch(0.2497 0.0305 234.1628)",
    secondary: "oklch(0.7794 0.0803 4.1330)",
    "secondary-foreground": "oklch(0.2497 0.0305 234.1628)",
    muted: "oklch(0.2713 0.0086 255.5780)",
    "muted-foreground": "oklch(0.7794 0.0803 4.1330)",
    accent: "oklch(0.6699 0.0988 356.9762)",
    "accent-foreground": "oklch(0.9306 0.0197 349.0784)",
    destructive: "oklch(0.6702 0.1806 350.3599)",
    "destructive-foreground": "oklch(0.2497 0.0305 234.1628)",
    border: "oklch(0.3907 0.0399 242.2181)",
    input: "oklch(0.3093 0.0305 232.0027)",
    ring: "oklch(0.6998 0.0896 201.8673)",
    "chart-1": "oklch(0.6998 0.0896 201.8673)",
    "chart-2": "oklch(0.7794 0.0803 4.1330)",
    "chart-3": "oklch(0.6699 0.0988 356.9762)",
    "chart-4": "oklch(0.4408 0.0702 217.0848)",
    "chart-5": "oklch(0.2713 0.0086 255.5780)",
  },
  radius: "0.4rem",
  fonts: {
    sans: "Inter",
    serif: "Georgia",
    mono: "JetBrains Mono",
  },
  shadow: {
    color: "oklch(0.6258 0.1775 348.3615)",
    offsetX: 3,
    offsetY: 3,
    blur: 0,
    spread: 0,
    opacity: 1.0,
  },
  shadowPreset: "brutalist",
},
```

**Step 3: Add fonts and shadow to ALL existing presets**

Add these properties to each existing preset (default, warm, cool, green, high-contrast):

```typescript
fonts: {
  sans: "Inter",
  serif: "Georgia",
  mono: "JetBrains Mono",
},
shadow: {
  color: "oklch(0.2 0 0)",
  offsetX: 0,
  offsetY: 4,
  blur: 6,
  spread: -1,
  opacity: 0.1,
},
shadowPreset: "medium",
```

**Step 4: Commit**

```bash
git add src/lib/presets.ts
git commit -m "feat: add Bubblegum preset as default, add fonts/shadow to all presets"
```

---

## Task 5: Extend Theme Context with Fonts and Shadow State

**Files:**
- Modify: `src/context/theme-context.tsx`

**Step 1: Update imports**

```typescript
"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { ThemeColors, FontConfig, ShadowConfig, ShadowPreset } from "@/lib/theme-types";
import { presets } from "@/lib/presets";
import { loadGoogleFont } from "@/lib/fonts";
import { SHADOW_PRESETS } from "@/lib/shadow-presets";
```

**Step 2: Update ThemeContextValue interface**

```typescript
interface ThemeContextValue {
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
  activeMode: "light" | "dark";
  previewMode: "light" | "dark";
  activePreset: string;
  fonts: FontConfig;
  shadow: ShadowConfig;
  shadowPreset: ShadowPreset;

  setColor: (mode: "light" | "dark", key: keyof ThemeColors, value: string) => void;
  setRadius: (radius: string) => void;
  setActiveMode: (mode: "light" | "dark") => void;
  setPreviewMode: (mode: "light" | "dark") => void;
  loadPreset: (presetName: string) => void;
  setFont: (category: keyof FontConfig, font: string) => void;
  setShadow: (updates: Partial<ShadowConfig>) => void;
  setShadowPreset: (preset: ShadowPreset) => void;
}
```

**Step 3: Update ThemeProvider with new state and functions**

```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  const defaultPreset = presets[0];
  const [light, setLight] = useState<ThemeColors>(defaultPreset.light);
  const [dark, setDark] = useState<ThemeColors>(defaultPreset.dark);
  const [radius, setRadiusState] = useState(defaultPreset.radius);
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [activePreset, setActivePreset] = useState(defaultPreset.name);
  const [fonts, setFonts] = useState<FontConfig>(defaultPreset.fonts);
  const [shadow, setShadowState] = useState<ShadowConfig>(defaultPreset.shadow);
  const [shadowPreset, setShadowPresetState] = useState<ShadowPreset>(defaultPreset.shadowPreset);

  // Load Google Fonts when fonts change
  useEffect(() => {
    loadGoogleFont(fonts.sans);
    loadGoogleFont(fonts.serif);
    loadGoogleFont(fonts.mono);
  }, [fonts]);

  const setColor = useCallback(
    (mode: "light" | "dark", key: keyof ThemeColors, value: string) => {
      if (mode === "light") {
        setLight((prev) => ({ ...prev, [key]: value }));
      } else {
        setDark((prev) => ({ ...prev, [key]: value }));
      }
      setActivePreset("custom");
    },
    []
  );

  const setRadius = useCallback((r: string) => {
    setRadiusState(r);
    setActivePreset("custom");
  }, []);

  const setFont = useCallback((category: keyof FontConfig, font: string) => {
    setFonts((prev) => ({ ...prev, [category]: font }));
    setActivePreset("custom");
  }, []);

  const setShadow = useCallback((updates: Partial<ShadowConfig>) => {
    setShadowState((prev) => ({ ...prev, ...updates }));
    setShadowPresetState("custom");
    setActivePreset("custom");
  }, []);

  const setShadowPreset = useCallback((preset: ShadowPreset) => {
    setShadowPresetState(preset);
    if (preset !== "custom") {
      setShadowState(SHADOW_PRESETS[preset]);
    }
    setActivePreset("custom");
  }, []);

  const loadPreset = useCallback((presetName: string) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      setLight(preset.light);
      setDark(preset.dark);
      setRadiusState(preset.radius);
      setFonts(preset.fonts);
      setShadowState(preset.shadow);
      setShadowPresetState(preset.shadowPreset);
      setActivePreset(preset.name);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        light, dark, radius, activeMode, previewMode, activePreset,
        fonts, shadow, shadowPreset,
        setColor, setRadius, setActiveMode, setPreviewMode, loadPreset,
        setFont, setShadow, setShadowPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
```

**Step 4: Commit**

```bash
git add src/context/theme-context.tsx
git commit -m "feat: extend theme context with fonts and shadow state"
```

---

## Task 6: Create Font Picker Component

**Files:**
- Create: `src/components/font-picker.tsx`

**Step 1: Create the font picker component**

```typescript
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FONT_OPTIONS, FontCategory } from "@/lib/fonts";
import { useTheme } from "@/context/theme-context";

interface FontPickerProps {
  category: FontCategory;
  label: string;
}

export function FontPicker({ category, label }: FontPickerProps) {
  const { fonts, setFont } = useTheme();
  const options = FONT_OPTIONS[category];
  const currentValue = fonts[category];

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Select value={currentValue} onValueChange={(v) => setFont(category, v)}>
        <SelectTrigger className="w-40 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((font) => (
            <SelectItem key={font.value} value={font.value} className="text-xs">
              <span style={{ fontFamily: `"${font.value}", sans-serif` }}>
                {font.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/font-picker.tsx
git commit -m "feat: add FontPicker component for Google Fonts selection"
```

---

## Task 7: Create Shadow Controls Component

**Files:**
- Create: `src/components/shadow-controls.tsx`

**Step 1: Create the shadow controls component**

```typescript
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
import { ColorRow } from "./color-row";

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

  // Simple color input for shadow color - reuse logic from color-row
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert hex to oklch (simplified - in production use proper conversion)
    const hex = e.target.value;
    // For now, store as-is and let the user also type oklch
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
```

**Step 2: Commit**

```bash
git add src/components/shadow-controls.tsx
git commit -m "feat: add ShadowControls component with presets and sliders"
```

---

## Task 8: Update Color Editor with New Sections

**Files:**
- Modify: `src/components/color-editor.tsx`

**Step 1: Replace the entire file with updated version**

```typescript
"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { COLOR_GROUPS } from "@/lib/theme-types";
import { ColorRow } from "./color-row";
import { FontPicker } from "./font-picker";
import { ShadowControls } from "./shadow-controls";
import { useTheme } from "@/context/theme-context";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 w-full text-left text-sm font-medium mb-2 hover:text-primary transition-colors"
      >
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {title}
      </button>
      {isOpen && (
        <>
          <Separator className="mb-3" />
          {children}
        </>
      )}
    </div>
  );
}

export function ColorEditor() {
  const { activeMode, setActiveMode, radius, setRadius } = useTheme();

  return (
    <div className="w-80 border-r flex flex-col h-full bg-background">
      {/* Mode tabs at top */}
      <div className="p-3 border-b">
        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "light" | "dark")}>
          <TabsList className="w-full">
            <TabsTrigger value="light" className="flex-1">Light</TabsTrigger>
            <TabsTrigger value="dark" className="flex-1">Dark</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Colors section (inside tabs - mode-specific) */}
        <CollapsibleSection title="Colors">
          <div className="space-y-4">
            {COLOR_GROUPS.map((group) => (
              <div key={group.label}>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">{group.label}</h4>
                {group.variables.map((varKey) => (
                  <ColorRow key={varKey} variableKey={varKey} mode={activeMode} />
                ))}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Fonts section (shared across modes) */}
        <CollapsibleSection title="Fonts">
          <div className="space-y-3">
            <FontPicker category="sans" label="Sans" />
            <FontPicker category="serif" label="Serif" />
            <FontPicker category="mono" label="Mono" />
          </div>
        </CollapsibleSection>

        {/* Radius section (shared) */}
        <CollapsibleSection title="Radius">
          <div className="flex items-center gap-3">
            <Slider
              value={[parseFloat(radius)]}
              onValueChange={([v]) => setRadius(`${v}rem`)}
              min={0}
              max={1}
              step={0.025}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-14 text-right font-mono">
              {radius}
            </span>
          </div>
        </CollapsibleSection>

        {/* Shadows section (shared) */}
        <CollapsibleSection title="Shadows">
          <ShadowControls />
        </CollapsibleSection>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/color-editor.tsx
git commit -m "feat: update ColorEditor with collapsible sections for fonts and shadows"
```

---

## Task 9: Update Dashboard Preview to Apply Fonts and Shadows

**Files:**
- Modify: `src/components/preview/dashboard-preview.tsx`

**Step 1: Update imports and buildCssVariables function**

```typescript
"use client";

import { useTheme } from "@/context/theme-context";
import { ThemeColors, FontConfig, ShadowConfig } from "@/lib/theme-types";
import { getFontStack } from "@/lib/fonts";
import { buildShadowValue } from "@/lib/shadow-presets";
import { StatCards } from "./stat-cards";
import { ChartCard } from "./chart-card";
import { RecentSales } from "./recent-sales";
import { DataTableCard } from "./data-table-card";
import { ComponentShowcase } from "./component-showcase";

function buildCssVariables(
  colors: ThemeColors,
  radius: string,
  fonts: FontConfig,
  shadow: ShadowConfig
): React.CSSProperties {
  const shadowValue = buildShadowValue(shadow);

  const vars: Record<string, string> = {
    "--radius": radius,
    "--font-sans": getFontStack(fonts.sans, "sans"),
    "--font-serif": getFontStack(fonts.serif, "serif"),
    "--font-mono": getFontStack(fonts.mono, "mono"),
    "--shadow": shadowValue,
    "--shadow-sm": shadowValue,
    "--shadow-md": shadowValue,
    "--shadow-lg": shadowValue,
  };

  for (const [key, value] of Object.entries(colors)) {
    vars[`--${key}`] = value;
  }

  return vars as React.CSSProperties;
}

export function DashboardPreview() {
  const { previewMode, light, dark, radius, fonts, shadow } = useTheme();
  const colors = previewMode === "light" ? light : dark;
  const cssVars = buildCssVariables(colors, radius, fonts, shadow);

  return (
    <div
      className={`flex-1 overflow-y-auto ${previewMode === "dark" ? "dark" : ""}`}
      style={{
        ...cssVars,
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <StatCards />
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div className="lg:col-span-4">
            <ChartCard />
          </div>
          <div className="lg:col-span-3">
            <RecentSales />
          </div>
        </div>
        <DataTableCard />
        <ComponentShowcase />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/preview/dashboard-preview.tsx
git commit -m "feat: apply fonts and shadow CSS variables to dashboard preview"
```

---

## Task 10: Update globals.css with Bubblegum Theme and Shadow Variables

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Replace the entire file with Bubblegum theme**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
  --shadow-2xs: var(--shadow);
  --shadow-xs: var(--shadow);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-lg);
  --shadow-2xl: var(--shadow-lg);
}

:root {
  --radius: 0.4rem;
  --background: oklch(0.9399 0.0203 345.6984);
  --foreground: oklch(0.4712 0 0);
  --card: oklch(0.9498 0.0500 86.8891);
  --card-foreground: oklch(0.4712 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.4712 0 0);
  --primary: oklch(0.6209 0.1801 348.1385);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.8095 0.0694 198.1863);
  --secondary-foreground: oklch(0.3211 0 0);
  --muted: oklch(0.8800 0.0504 212.0952);
  --muted-foreground: oklch(0.5795 0 0);
  --accent: oklch(0.9195 0.0801 87.6670);
  --accent-foreground: oklch(0.3211 0 0);
  --destructive: oklch(0.7091 0.1697 21.9551);
  --destructive-foreground: oklch(1 0 0);
  --border: oklch(0.6209 0.1801 348.1385);
  --input: oklch(0.9189 0 0);
  --ring: oklch(0.7002 0.1597 350.7532);
  --chart-1: oklch(0.7002 0.1597 350.7532);
  --chart-2: oklch(0.8189 0.0799 212.0892);
  --chart-3: oklch(0.9195 0.0801 87.6670);
  --chart-4: oklch(0.7998 0.1110 348.1791);
  --chart-5: oklch(0.6197 0.1899 353.9091);
  --sidebar: oklch(0.9140 0.0424 343.0913);
  --sidebar-foreground: oklch(0.3211 0 0);
  --sidebar-primary: oklch(0.6559 0.2118 354.3084);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.8228 0.1095 346.0183);
  --sidebar-accent-foreground: oklch(0.3211 0 0);
  --sidebar-border: oklch(0.9464 0.0327 307.1744);
  --sidebar-ring: oklch(0.6559 0.2118 354.3084);
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Georgia", ui-serif, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --shadow: 3px 3px 0px 0px oklch(0.6258 0.1775 348.3615 / 1);
  --shadow-sm: 3px 3px 0px 0px oklch(0.6258 0.1775 348.3615 / 1);
  --shadow-md: 3px 3px 0px 0px oklch(0.6258 0.1775 348.3615 / 1);
  --shadow-lg: 3px 3px 0px 0px oklch(0.6258 0.1775 348.3615 / 1);
}

.dark {
  --background: oklch(0.2497 0.0305 234.1628);
  --foreground: oklch(0.9306 0.0197 349.0784);
  --card: oklch(0.2902 0.0299 233.5352);
  --card-foreground: oklch(0.9306 0.0197 349.0784);
  --popover: oklch(0.2902 0.0299 233.5352);
  --popover-foreground: oklch(0.9306 0.0197 349.0784);
  --primary: oklch(0.9195 0.0801 87.6670);
  --primary-foreground: oklch(0.2497 0.0305 234.1628);
  --secondary: oklch(0.7794 0.0803 4.1330);
  --secondary-foreground: oklch(0.2497 0.0305 234.1628);
  --muted: oklch(0.2713 0.0086 255.5780);
  --muted-foreground: oklch(0.7794 0.0803 4.1330);
  --accent: oklch(0.6699 0.0988 356.9762);
  --accent-foreground: oklch(0.9306 0.0197 349.0784);
  --destructive: oklch(0.6702 0.1806 350.3599);
  --destructive-foreground: oklch(0.2497 0.0305 234.1628);
  --border: oklch(0.3907 0.0399 242.2181);
  --input: oklch(0.3093 0.0305 232.0027);
  --ring: oklch(0.6998 0.0896 201.8673);
  --chart-1: oklch(0.6998 0.0896 201.8673);
  --chart-2: oklch(0.7794 0.0803 4.1330);
  --chart-3: oklch(0.6699 0.0988 356.9762);
  --chart-4: oklch(0.4408 0.0702 217.0848);
  --chart-5: oklch(0.2713 0.0086 255.5780);
  --sidebar: oklch(0.2303 0.0270 235.9743);
  --sidebar-foreground: oklch(0.9670 0.0029 264.5420);
  --sidebar-primary: oklch(0.6559 0.2118 354.3084);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.8228 0.1095 346.0183);
  --sidebar-accent-foreground: oklch(0.2781 0.0296 256.8480);
  --sidebar-border: oklch(0.3729 0.0306 259.7329);
  --sidebar-ring: oklch(0.6559 0.2118 354.3084);
  --shadow: 3px 3px 0px 0px oklch(0.3885 0.0395 241.9310 / 1);
  --shadow-sm: 3px 3px 0px 0px oklch(0.3885 0.0395 241.9310 / 1);
  --shadow-md: 3px 3px 0px 0px oklch(0.3885 0.0395 241.9310 / 1);
  --shadow-lg: 3px 3px 0px 0px oklch(0.3885 0.0395 241.9310 / 1);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
  }
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: apply Bubblegum theme with shadow variables to globals.css"
```

---

## Task 11: Test the Implementation

**Step 1: Run the development server**

```bash
npm run dev
```

**Step 2: Verify in browser**

- Open http://localhost:3000
- Confirm Bubblegum theme loads (pink borders, cream cards)
- Test font pickers (change sans/serif/mono fonts)
- Test shadow preset dropdown
- Test individual shadow sliders
- Switch between Light/Dark preview modes
- Load different presets from dropdown

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Bubblegum theme with font and shadow controls"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add Font and Shadow types | `theme-types.ts` |
| 2 | Create font definitions and loader | `fonts.ts` |
| 3 | Create shadow preset definitions | `shadow-presets.ts` |
| 4 | Add Bubblegum preset | `presets.ts` |
| 5 | Extend theme context | `theme-context.tsx` |
| 6 | Create FontPicker component | `font-picker.tsx` |
| 7 | Create ShadowControls component | `shadow-controls.tsx` |
| 8 | Update ColorEditor with sections | `color-editor.tsx` |
| 9 | Update DashboardPreview | `dashboard-preview.tsx` |
| 10 | Update globals.css | `globals.css` |
| 11 | Test implementation | Manual testing |
