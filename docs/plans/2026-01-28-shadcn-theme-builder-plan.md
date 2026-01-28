# shadcn Theme Builder — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page shadcn/ui theme builder with a color editor, live dashboard preview, preset themes, and full `globals.css` export.

**Architecture:** Single Next.js 15 page with React context for theme state. Left sidebar has OKLCH color editor with color picker + text inputs. Main area renders a dashboard of real shadcn components with CSS variables applied via a wrapper div. Export generates a complete `globals.css` file.

**Tech Stack:** Next.js 15 (App Router), shadcn/ui, Tailwind CSS v4, TypeScript, recharts

**Note:** shadcn/ui now uses OKLCH color space (not HSL). The color editor uses a native HTML color picker (which works in hex/RGB) and converts to OKLCH for the CSS variable output. Users can also directly edit the OKLCH string.

---

### Task 1: Scaffold Next.js Project & Install Dependencies

**Files:**
- Create: project root via `create-next-app`
- Modify: `package.json` (add recharts)

**Step 1: Create Next.js project**

Run:
```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/shadcn-theme-builder
npx create-next-app@latest . --yes --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Expected: Project scaffolded with App Router, TypeScript, Tailwind CSS v4

**Step 2: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init -d
```

Expected: `components.json` created, `src/lib/utils.ts` created, `globals.css` updated

**Step 3: Install shadcn components we need**

Run:
```bash
npx shadcn@latest add button card badge alert input switch tabs table dialog select label separator slider popover avatar
```

Expected: Components added to `src/components/ui/`

**Step 4: Install recharts**

Run:
```bash
npm install recharts
```

Expected: recharts added to `package.json`

**Step 5: Verify dev server starts**

Run:
```bash
npm run dev
```

Expected: Server starts on `http://localhost:3000`

**Step 6: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js project with shadcn/ui and recharts"
```

---

### Task 2: Define Theme Types & Preset Data

**Files:**
- Create: `src/lib/theme-types.ts`
- Create: `src/lib/presets.ts`
- Create: `src/lib/color-utils.ts`

**Step 1: Create theme types**

Create `src/lib/theme-types.ts`:

```typescript
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

export interface ThemeConfig {
  name: string;
  label: string;
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
}

// The CSS variable groups for the editor UI
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
```

**Step 2: Create color utility functions**

Create `src/lib/color-utils.ts`:

```typescript
/**
 * Convert an oklch() string like "oklch(0.205 0 0)" to a hex color string for the color picker.
 * Parse the L, C, H values, convert to sRGB, then to hex.
 */
export function oklchToHex(oklch: string): string {
  // Parse "oklch(L C H)" or "oklch(L C H / alpha)"
  const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return "#000000";

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);

  // OKLCH -> OKLab
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);

  // OKLab -> linear sRGB (using the standard matrix)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  // Clamp and gamma correct
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  bl = Math.max(0, Math.min(1, bl));

  const toSRGB = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

  const rr = Math.round(toSRGB(r) * 255);
  const gg = Math.round(toSRGB(g) * 255);
  const bb = Math.round(toSRGB(bl) * 255);

  return `#${rr.toString(16).padStart(2, "0")}${gg.toString(16).padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`;
}

/**
 * Convert a hex color string to an oklch() CSS string.
 */
export function hexToOklch(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // sRGB -> linear RGB
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rl = toLinear(r);
  const gl = toLinear(g);
  const bl = toLinear(b);

  // Linear RGB -> LMS (cone response)
  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  // LMS -> OKLab
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  // OKLab -> OKLCH
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;

  // Round to 3 decimal places
  const Lr = Math.round(L * 1000) / 1000;
  const Cr = Math.round(C * 1000) / 1000;
  const Hr = Math.round(H * 1000) / 1000;

  return `oklch(${Lr} ${Cr} ${Hr})`;
}
```

**Step 3: Create preset themes**

Create `src/lib/presets.ts` with 5 preset themes. Each preset has full light + dark OKLCH color maps. Use the actual shadcn default (zinc) as the "Default" preset, and create Warm (stone), Cool (slate), Green, and High Contrast variants.

```typescript
import { ThemeConfig } from "./theme-types";

export const presets: ThemeConfig[] = [
  {
    name: "default",
    label: "Default (Zinc)",
    radius: "0.625rem",
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.145 0 0)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.145 0 0)",
      primary: "oklch(0.205 0 0)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.97 0 0)",
      "secondary-foreground": "oklch(0.205 0 0)",
      muted: "oklch(0.97 0 0)",
      "muted-foreground": "oklch(0.556 0 0)",
      accent: "oklch(0.97 0 0)",
      "accent-foreground": "oklch(0.205 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
      "destructive-foreground": "oklch(0.985 0 0)",
      border: "oklch(0.922 0 0)",
      input: "oklch(0.922 0 0)",
      ring: "oklch(0.708 0 0)",
      "chart-1": "oklch(0.646 0.222 41.116)",
      "chart-2": "oklch(0.6 0.118 184.704)",
      "chart-3": "oklch(0.398 0.07 227.392)",
      "chart-4": "oklch(0.828 0.189 84.429)",
      "chart-5": "oklch(0.769 0.188 70.08)",
    },
    dark: {
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
      card: "oklch(0.205 0 0)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.205 0 0)",
      "popover-foreground": "oklch(0.985 0 0)",
      primary: "oklch(0.922 0 0)",
      "primary-foreground": "oklch(0.205 0 0)",
      secondary: "oklch(0.269 0 0)",
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.269 0 0)",
      "muted-foreground": "oklch(0.708 0 0)",
      accent: "oklch(0.269 0 0)",
      "accent-foreground": "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      "destructive-foreground": "oklch(0.985 0 0)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.556 0 0)",
      "chart-1": "oklch(0.488 0.243 264.376)",
      "chart-2": "oklch(0.696 0.17 162.48)",
      "chart-3": "oklch(0.769 0.188 70.08)",
      "chart-4": "oklch(0.627 0.265 303.9)",
      "chart-5": "oklch(0.645 0.246 16.439)",
    },
  },
  // ... Warm (stone-based), Cool (slate-based), Green, High Contrast presets
  // Follow same structure with different OKLCH values
];
```

Provide complete OKLCH values for all 5 presets. Use the stone palette from shadcn docs for Warm. Derive Cool, Green, and High Contrast by shifting hue/chroma/lightness appropriately.

**Step 4: Commit**

```bash
git add src/lib/theme-types.ts src/lib/color-utils.ts src/lib/presets.ts
git commit -m "feat: add theme types, color utilities, and preset themes"
```

---

### Task 3: Theme Context Provider

**Files:**
- Create: `src/context/theme-context.tsx`
- Modify: `src/app/layout.tsx` (wrap with provider)

**Step 1: Create the theme context**

Create `src/context/theme-context.tsx`:

```typescript
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ThemeColors, ThemeConfig } from "@/lib/theme-types";
import { presets } from "@/lib/presets";

interface ThemeContextValue {
  // Current theme state
  light: ThemeColors;
  dark: ThemeColors;
  radius: string;
  activeMode: "light" | "dark";
  previewMode: "light" | "dark";
  activePreset: string;

  // Actions
  setColor: (mode: "light" | "dark", key: keyof ThemeColors, value: string) => void;
  setRadius: (radius: string) => void;
  setActiveMode: (mode: "light" | "dark") => void;
  setPreviewMode: (mode: "light" | "dark") => void;
  loadPreset: (presetName: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const defaultPreset = presets[0];
  const [light, setLight] = useState<ThemeColors>(defaultPreset.light);
  const [dark, setDark] = useState<ThemeColors>(defaultPreset.dark);
  const [radius, setRadiusState] = useState(defaultPreset.radius);
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [activePreset, setActivePreset] = useState(defaultPreset.name);

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

  const loadPreset = useCallback((presetName: string) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      setLight(preset.light);
      setDark(preset.dark);
      setRadiusState(preset.radius);
      setActivePreset(preset.name);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        light,
        dark,
        radius,
        activeMode,
        previewMode,
        activePreset,
        setColor,
        setRadius,
        setActiveMode,
        setPreviewMode,
        loadPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

**Step 2: Wrap layout with ThemeProvider**

Modify `src/app/layout.tsx` — wrap `{children}` with `<ThemeProvider>`.

```tsx
import { ThemeProvider } from "@/context/theme-context";

// In the body:
<ThemeProvider>{children}</ThemeProvider>
```

**Step 3: Verify dev server still starts**

Run: `npm run dev`
Expected: No errors

**Step 4: Commit**

```bash
git add src/context/theme-context.tsx src/app/layout.tsx
git commit -m "feat: add theme context provider with preset loading"
```

---

### Task 4: Top Bar Component

**Files:**
- Create: `src/components/top-bar.tsx`

**Step 1: Build the top bar**

Create `src/components/top-bar.tsx`:

The top bar contains:
- App title "shadcn Theme Builder" on the left
- Preset selector (shadcn `Select` component) showing current preset name, listing all presets + "Custom" option
- Preview mode toggle (shadcn `Button` with Sun/Moon icons from lucide-react) to switch light/dark preview
- "Export" button (shadcn `Button` variant="default") — wired up in a later task

Use `useTheme()` to read `activePreset`, `previewMode`, and call `loadPreset()`, `setPreviewMode()`.

Layout: `flex items-center justify-between` with `h-14 border-b px-4`.

**Step 2: Verify it renders**

Temporarily render `<TopBar />` in `src/app/page.tsx` to check it displays.

Run: `npm run dev`
Expected: Top bar renders with preset dropdown and mode toggle

**Step 3: Commit**

```bash
git add src/components/top-bar.tsx src/app/page.tsx
git commit -m "feat: add top bar with preset selector and mode toggle"
```

---

### Task 5: Color Editor Sidebar

**Files:**
- Create: `src/components/color-editor.tsx`
- Create: `src/components/color-row.tsx`

**Step 1: Create the ColorRow component**

Create `src/components/color-row.tsx`:

Each row shows:
- A label (e.g. "primary")
- A small square color swatch (rendered as a `<button>` with background set via the OKLCH value) that, when clicked, opens a native `<input type="color">` (hidden, triggered by ref click)
- An OKLCH text input (shadcn `Input`, smaller text, monospace) showing the raw OKLCH string, editable

When the native color picker changes: convert hex to OKLCH using `hexToOklch()`, call `setColor()`.
When the text input changes: call `setColor()` directly with the typed OKLCH string.
Set the swatch background using the OKLCH value directly (modern browsers support `oklch()` in CSS).

Props: `variableKey: keyof ThemeColors`, `mode: "light" | "dark"`.

**Step 2: Create the ColorEditor sidebar**

Create `src/components/color-editor.tsx`:

Layout:
- Fixed width `w-80` sidebar with `overflow-y-auto h-full`
- Two shadcn `Tabs` at top: "Light" / "Dark" — controls `activeMode` via `useTheme()`
- Below tabs: iterate over `COLOR_GROUPS`, render each group as a section with:
  - A small `<h3>` label (e.g. "Primary")
  - A `Separator` below it
  - `ColorRow` for each variable in the group
- At the bottom: "Radius" section with a shadcn `Slider` (range 0-1, step 0.025, value mapped from rem to number), showing the current rem value as text

**Step 3: Verify it renders**

Add `<ColorEditor />` to `src/app/page.tsx` alongside the top bar.

Run: `npm run dev`
Expected: Sidebar renders with all color groups, swatches show correct colors, clicking a swatch opens color picker, text inputs are editable

**Step 4: Commit**

```bash
git add src/components/color-editor.tsx src/components/color-row.tsx src/app/page.tsx
git commit -m "feat: add color editor sidebar with color picker and OKLCH inputs"
```

---

### Task 6: Dashboard Preview — Layout & Stat Cards

**Files:**
- Create: `src/components/preview/dashboard-preview.tsx`
- Create: `src/components/preview/stat-cards.tsx`

**Step 1: Create the preview wrapper**

Create `src/components/preview/dashboard-preview.tsx`:

This is the container that applies theme CSS variables. It:
- Reads `previewMode`, `light`, `dark`, `radius` from `useTheme()`
- Picks the correct color set based on `previewMode`
- Builds a `style` object mapping `--background`, `--foreground`, etc. to the OKLCH values
- Also sets `--radius` from the radius value
- Applies these as inline styles on a wrapper `<div>`
- Sets `background-color: var(--background)` and `color: var(--foreground)` on the wrapper
- If `previewMode === "dark"`, adds the `dark` class to the wrapper div
- Contains child preview components inside

Layout: `flex-1 overflow-y-auto p-6` with a max-width container inside.

**Step 2: Create stat cards**

Create `src/components/preview/stat-cards.tsx`:

A row of 4 cards in a `grid grid-cols-2 lg:grid-cols-4 gap-4`:
- "Total Revenue" — $45,231.89, +20.1% from last month
- "Subscriptions" — +2,350, +180.1% from last month
- "Active Users" — +12,234, +19% from last month
- "Pending" — +573, +201 since last hour

Each uses shadcn `Card`, `CardHeader`, `CardTitle`, `CardContent`. Use lucide-react icons (DollarSign, Users, CreditCard, Activity).

**Step 3: Wire into page**

Update `src/app/page.tsx` to show the full layout:
```
<TopBar />
<div className="flex flex-1 overflow-hidden">
  <ColorEditor />
  <DashboardPreview>
    <StatCards />
  </DashboardPreview>
</div>
```

**Step 4: Verify**

Run: `npm run dev`
Expected: Stat cards render with the current theme's colors. Changing a color in the sidebar immediately updates the preview.

**Step 5: Commit**

```bash
git add src/components/preview/ src/app/page.tsx
git commit -m "feat: add dashboard preview wrapper and stat cards"
```

---

### Task 7: Dashboard Preview — Chart Card

**Files:**
- Create: `src/components/preview/chart-card.tsx`

**Step 1: Build the chart card**

Create `src/components/preview/chart-card.tsx`:

A `Card` containing a simple bar chart using recharts `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`.

Sample data: 6 months of revenue data.

**Important:** The bars should use CSS variables for fill colors. Use `var(--chart-1)` through `var(--chart-5)` via the `fill` prop. Since recharts needs actual color values (not CSS vars in all cases), read the computed style from the preview container ref, or pass OKLCH values directly (modern browsers handle `oklch()` in SVG fill).

Actually, the simplest approach: use the OKLCH strings directly from theme context as the `fill` prop values for recharts bars. Recharts passes fill to SVG, and modern browsers support `oklch()` in SVG attributes.

Card title: "Revenue Overview"

**Step 2: Add to DashboardPreview**

Place below stat cards in a two-column grid (chart left, recent sales right — sales added in next task).

**Step 3: Verify**

Run: `npm run dev`
Expected: Bar chart renders with theme chart colors

**Step 4: Commit**

```bash
git add src/components/preview/chart-card.tsx src/components/preview/dashboard-preview.tsx
git commit -m "feat: add revenue chart card with recharts"
```

---

### Task 8: Dashboard Preview — Recent Sales & Data Table

**Files:**
- Create: `src/components/preview/recent-sales.tsx`
- Create: `src/components/preview/data-table-card.tsx`

**Step 1: Build recent sales card**

Create `src/components/preview/recent-sales.tsx`:

A `Card` with title "Recent Sales" showing 5 items. Each item has:
- A colored avatar circle (initials, using `Avatar` from shadcn if installed, or a simple div with `rounded-full`)
- Name and email on the left
- Amount on the right (e.g. "+$1,999.00")

**Step 2: Build data table card**

Create `src/components/preview/data-table-card.tsx`:

A `Card` with title "Recent Orders" containing a shadcn `Table` with columns: Order, Status, Amount, Date.

5 sample rows with different statuses. Use `Badge` for status column (variant: default for "Completed", secondary for "Processing", destructive for "Failed", outline for "Pending").

**Step 3: Add both to DashboardPreview**

- Chart and Recent Sales side by side in a two-column grid
- Data table card full-width below

**Step 4: Verify**

Run: `npm run dev`
Expected: Recent sales and data table render with themed colors

**Step 5: Commit**

```bash
git add src/components/preview/recent-sales.tsx src/components/preview/data-table-card.tsx src/components/preview/dashboard-preview.tsx
git commit -m "feat: add recent sales list and data table card"
```

---

### Task 9: Dashboard Preview — Component Showcase Section

**Files:**
- Create: `src/components/preview/component-showcase.tsx`

**Step 1: Build component showcase**

Create `src/components/preview/component-showcase.tsx`:

A `Card` titled "Component Showcase" containing a grid of various shadcn components to demonstrate all theme colors:

- **Buttons row:** Default, Secondary, Destructive, Outline, Ghost variants side by side
- **Inputs row:** A text `Input` with `Label`, a `Switch` with label
- **Alerts:** One default `Alert` and one destructive `Alert`
- **Tabs:** A small `Tabs` component with 3 tabs, showing sample content in each
- **Badges:** Default, Secondary, Destructive, Outline badges in a row

**Step 2: Add to DashboardPreview**

Place below the data table card.

**Step 3: Verify**

Run: `npm run dev`
Expected: All component variants render with correct theme colors

**Step 4: Commit**

```bash
git add src/components/preview/component-showcase.tsx src/components/preview/dashboard-preview.tsx
git commit -m "feat: add component showcase section to dashboard preview"
```

---

### Task 10: Export Dialog

**Files:**
- Create: `src/components/export-dialog.tsx`
- Modify: `src/components/top-bar.tsx` (wire export button)

**Step 1: Create the CSS generator function**

In `src/components/export-dialog.tsx`, create a function `generateGlobalsCss(light: ThemeColors, dark: ThemeColors, radius: string): string` that returns the full `globals.css` content:

```css
@import "tailwindcss";

:root {
  --radius: {radius};
  --background: {light.background};
  --foreground: {light.foreground};
  /* ... all light theme variables ... */
}

.dark {
  --background: {dark.background};
  --foreground: {dark.foreground};
  /* ... all dark theme variables ... */
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Step 2: Build the export dialog**

Create the `ExportDialog` component:

- Uses shadcn `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`
- Content: A `<pre>` block with the generated CSS, styled with monospace font, `overflow-auto`, max-height
- A "Copy" button (shadcn `Button`) at top right of the code block
- On click: `navigator.clipboard.writeText(css)` then show "Copied!" for 2 seconds (toggle button text)

**Step 3: Wire into top bar**

In `src/components/top-bar.tsx`, replace the placeholder Export button with `<ExportDialog />`.

**Step 4: Verify**

Run: `npm run dev`
Expected: Clicking Export opens dialog with valid CSS. Copy button copies to clipboard.

**Step 5: Commit**

```bash
git add src/components/export-dialog.tsx src/components/top-bar.tsx
git commit -m "feat: add export dialog with full globals.css generation and copy"
```

---

### Task 11: Page Layout & Final Assembly

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css` (minimal app styles)
- Modify: `src/app/layout.tsx` (metadata)

**Step 1: Finalize page layout**

Update `src/app/page.tsx` to be the complete assembled page:

```tsx
export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <ColorEditor />
        <DashboardPreview />
      </div>
    </div>
  );
}
```

Mark as `"use client"` since it uses context.

**Step 2: Clean up globals.css**

Ensure `src/app/globals.css` has the Tailwind import and default shadcn theme variables (for the app's own UI — the sidebar and top bar). The preview area uses inline CSS variables, so it's isolated.

**Step 3: Update layout metadata**

In `src/app/layout.tsx`, set:
- `title: "shadcn Theme Builder"`
- `description: "Build and export custom shadcn/ui themes"`

**Step 4: Verify full flow**

Run: `npm run dev`

Test:
1. Page loads with Default (Zinc) preset
2. Switching presets updates all colors in editor and preview
3. Editing a color via picker updates preview immediately
4. Editing OKLCH text input updates preview
5. Light/Dark tab in sidebar switches editing mode
6. Preview mode toggle switches the preview appearance
7. Radius slider changes border radius in preview
8. Export dialog shows valid CSS with correct values
9. Copy button works

**Step 5: Commit**

```bash
git add src/app/page.tsx src/app/globals.css src/app/layout.tsx
git commit -m "feat: assemble final page layout and polish"
```

---

### Task 12: Remaining Preset Themes & Polish

**Files:**
- Modify: `src/lib/presets.ts` (complete all 5 presets)
- General polish pass

**Step 1: Complete preset data**

Ensure all 5 presets in `src/lib/presets.ts` have complete, valid OKLCH values for both light and dark modes:

1. **Default (Zinc)** — already done from shadcn docs
2. **Warm (Stone)** — use the stone palette from shadcn docs (already provided in research)
3. **Cool (Slate)** — blue/slate tones, shift hue toward ~250-265
4. **Green** — nature-inspired, shift primary hue to ~145-155 (green range in OKLCH)
5. **High Contrast** — maximize lightness difference (L=0 vs L=1), use vivid chroma for accents

**Step 2: Polish pass**

- Ensure the sidebar scrolls properly on smaller screens
- Ensure the preview area scrolls independently
- Add hover states and transitions where needed
- Verify no TypeScript errors: `npx tsc --noEmit`

**Step 3: Build check**

Run:
```bash
npm run build
```

Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete all preset themes and polish UI"
```

---

### Task 13: Final Verification

**Step 1: Clean start test**

```bash
rm -rf .next && npm run build && npm run start
```

Expected: Production build succeeds, app runs correctly on `http://localhost:3000`

**Step 2: Manual test checklist**

- [ ] Default preset loads on first visit
- [ ] All 5 presets load correctly
- [ ] Color picker changes update preview in real-time
- [ ] OKLCH text input editing works
- [ ] Light/Dark editing tabs work independently
- [ ] Preview mode toggle works
- [ ] Radius slider updates border-radius in preview
- [ ] Export dialog shows correct CSS
- [ ] Copy button copies to clipboard
- [ ] Sidebar and preview scroll independently
- [ ] No console errors

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final verification and cleanup"
```
