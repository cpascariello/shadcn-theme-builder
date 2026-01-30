# Tinte.dev Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Match tinte.dev's Bubblegum export by adding sidebar color variables, per-mode shadow colors, and full shadow tier CSS export.

**Architecture:** Three independent changes to the theme system: (1) extend `ThemeColors` with 8 sidebar keys and wire them through color editor + presets + export, (2) change `ShadowConfig.color` from a single string to per-mode `{ light: string, dark: string }` and update all consumers, (3) generate computed `--shadow-*` tier variables in the export dialog matching tinte.dev's format.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, shadcn/ui

---

### Task 1: Add sidebar color variables to ThemeColors

**Files:**
- Modify: `src/lib/theme-types.ts`

**Step 1: Add sidebar keys to ThemeColors interface**

Add these 8 keys after `ring` in the `ThemeColors` interface:

```ts
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
```

**Step 2: Add Sidebar color group**

Add a new group to `COLOR_GROUPS` array after "Border & Ring" and before "Charts":

```ts
  { label: "Sidebar", variables: ["sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"] },
```

**Step 3: Verify — run build**

Run: `npm run build`
Expected: Type errors in `presets.ts` (missing sidebar keys) — that's Task 2.

---

### Task 2: Add sidebar colors to all presets

**Files:**
- Modify: `src/lib/presets.ts`

**Step 1: Add sidebar values to Bubblegum preset**

Add to `bubblegum.light` (after `ring`):

```ts
      sidebar: "oklch(0.9140 0.0424 343.0913)",
      "sidebar-foreground": "oklch(0.3211 0 0)",
      "sidebar-primary": "oklch(0.6559 0.2118 354.3084)",
      "sidebar-primary-foreground": "oklch(1 0 0)",
      "sidebar-accent": "oklch(0.8228 0.1095 346.0183)",
      "sidebar-accent-foreground": "oklch(0.3211 0 0)",
      "sidebar-border": "oklch(0.9464 0.0327 307.1744)",
      "sidebar-ring": "oklch(0.6559 0.2118 354.3084)",
```

Add to `bubblegum.dark`:

```ts
      sidebar: "oklch(0.2303 0.0270 235.9743)",
      "sidebar-foreground": "oklch(0.9670 0.0029 264.5420)",
      "sidebar-primary": "oklch(0.6559 0.2118 354.3084)",
      "sidebar-primary-foreground": "oklch(1 0 0)",
      "sidebar-accent": "oklch(0.8228 0.1095 346.0183)",
      "sidebar-accent-foreground": "oklch(0.2781 0.0296 256.8480)",
      "sidebar-border": "oklch(0.3729 0.0306 259.7329)",
      "sidebar-ring": "oklch(0.6559 0.2118 354.3084)",
```

**Step 2: Add sidebar values to remaining presets**

For `default`, `warm`, `cool`, `green`, `high-contrast` — derive sidebar values from existing palette. Pattern: sidebar background slightly darker than `background`, sidebar foreground matches `foreground`, sidebar primary/accent reuse the theme's primary/accent.

Light mode template (adapt colors per theme):
```ts
      sidebar: /* slightly tinted background */,
      "sidebar-foreground": /* same as foreground */,
      "sidebar-primary": /* same as primary */,
      "sidebar-primary-foreground": /* same as primary-foreground */,
      "sidebar-accent": /* same as accent */,
      "sidebar-accent-foreground": /* same as accent-foreground */,
      "sidebar-border": /* same as border */,
      "sidebar-ring": /* same as ring */,
```

Dark mode: same pattern — sidebar is slightly lighter than card, others match their base equivalents.

**Step 3: Verify — run build**

Run: `npm run build`
Expected: PASS — all presets now have sidebar keys.

**Step 4: Commit**

```bash
git add src/lib/theme-types.ts src/lib/presets.ts
git commit -m "feat: add sidebar color variables to theme system"
```

---

### Task 3: Per-mode shadow colors

**Files:**
- Modify: `src/lib/theme-types.ts`
- Modify: `src/lib/shadow-presets.ts`
- Modify: `src/lib/presets.ts`
- Modify: `src/context/theme-context.tsx`
- Modify: `src/components/shadow-controls.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Change ShadowConfig to per-mode color**

In `src/lib/theme-types.ts`, change `ShadowConfig`:

```ts
export interface ShadowConfig {
  lightColor: string;
  darkColor: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  opacity: number;
}
```

**Step 2: Update shadow-presets.ts**

Update `SHADOW_PRESETS` — each preset uses the neutral defaults for both modes:

```ts
export const SHADOW_PRESETS: Record<Exclude<ShadowPreset, "custom">, ShadowConfig> = {
  none: {
    lightColor: SHADOW_COLOR_LIGHT,
    darkColor: SHADOW_COLOR_DARK,
    offsetX: 0, offsetY: 0, blur: 0, spread: 0, opacity: 0,
  },
  subtle: {
    lightColor: SHADOW_COLOR_LIGHT,
    darkColor: SHADOW_COLOR_DARK,
    offsetX: 0, offsetY: 1, blur: 3, spread: 0, opacity: 0.1,
  },
  // ... same pattern for medium, strong, brutalist
};
```

Update `buildShadowValue` to accept a mode parameter:

```ts
export function buildShadowValue(shadow: ShadowConfig, mode: "light" | "dark"): string {
  const color = mode === "light" ? shadow.lightColor : shadow.darkColor;
  // ... rest stays the same but uses `color` instead of `shadow.color`
}
```

Remove `getShadowColor()` function — no longer needed.

**Step 3: Update presets.ts**

Change Bubblegum shadow from `color` to `lightColor`/`darkColor`:

```ts
    shadow: {
      lightColor: "oklch(0.6258 0.1775 348.3615)",
      darkColor: "oklch(0.3885 0.0395 241.9310)",
      offsetX: 3, offsetY: 3, blur: 0, spread: 0, opacity: 1.0,
    },
```

All other presets: use neutral defaults:
```ts
    shadow: {
      lightColor: SHADOW_COLOR_LIGHT,
      darkColor: SHADOW_COLOR_DARK,
      offsetX: 0, offsetY: 4, blur: 6, spread: -1, opacity: 0.1,
    },
```

**Step 4: Update theme-context.tsx**

- Remove the `useEffect` that auto-swaps shadow color on mode change (lines 56-65) — no longer needed since colors are per-mode.
- Update `setShadowPreset` callback: when applying a preset, keep both `lightColor` and `darkColor` (same as before but with two fields).
- Update `resetShadow`: restore both colors from the loaded theme preset.

**Step 5: Update shadow-controls.tsx**

The `ShadowColorPicker` needs to read/write the correct color for the current mode. It needs `previewMode` from context:

```ts
function ShadowColorPicker() {
  const { shadow, setShadow, previewMode } = useTheme();
  const colorKey = previewMode === "light" ? "lightColor" : "darkColor";
  const color = shadow[colorKey] ?? "";
  // ... onChange updates { [colorKey]: newValue }
}
```

**Step 6: Update page.tsx**

Pass `previewMode` to `buildShadowValue`:

```ts
const shadowValue = buildShadowValue(shadow, previewMode);
```

**Step 7: Verify — run build**

Run: `npm run build`
Expected: PASS

**Step 8: Commit**

```bash
git add src/lib/theme-types.ts src/lib/shadow-presets.ts src/lib/presets.ts src/context/theme-context.tsx src/components/shadow-controls.tsx src/app/page.tsx
git commit -m "feat: per-mode shadow colors (light/dark each get their own)"
```

---

### Task 4: Full shadow tier export in CSS

**Files:**
- Modify: `src/components/export-dialog.tsx`
- Modify: `src/lib/shadow-presets.ts`

**Step 1: Add shadow tier generator to shadow-presets.ts**

Add a function that generates all `--shadow-*` tiers from a `ShadowConfig` + mode, matching tinte.dev's format:

```ts
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
    // hex fallback
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${op})`;
  };

  const halfOp = opacity * 0.5;
  const fullOp = opacity;
  const x = offsetX;
  const y = offsetY;

  return {
    "--shadow-2xs": `${x}px ${y}px ${blur}px ${spread}px ${c(halfOp)}`,
    "--shadow-xs": `${x}px ${y}px ${blur}px ${spread}px ${c(halfOp)}`,
    "--shadow-sm": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 1px 2px -1px ${c(fullOp)}`,
    "--shadow": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 1px 2px -1px ${c(fullOp)}`,
    "--shadow-md": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 2px 4px -1px ${c(fullOp)}`,
    "--shadow-lg": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 4px 6px -1px ${c(fullOp)}`,
    "--shadow-xl": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp)}, ${x}px 8px 10px -1px ${c(fullOp)}`,
    "--shadow-2xl": `${x}px ${y}px ${blur}px ${spread}px ${c(fullOp * 2.5)}`,
  };
}
```

**Step 2: Update export-dialog.tsx**

Update `generateGlobalsCss` to accept `ShadowConfig` and `FontConfig`, and output the full tinte.dev format:

```ts
function generateGlobalsCss(
  light: ThemeColors,
  dark: ThemeColors,
  radius: string,
  fonts: FontConfig,
  shadow: ShadowConfig,
): string {
  const formatColorVars = (colors: ThemeColors, indent: string) => {
    return Object.entries(colors)
      .map(([key, value]) => `${indent}--${key}: ${value};`)
      .join("\n");
  };

  const formatShadowVars = (shadow: ShadowConfig, mode: "light" | "dark", indent: string) => {
    const tiers = buildShadowTiers(shadow, mode);
    const color = mode === "light" ? shadow.lightColor : shadow.darkColor;
    let css = `${indent}--shadow-x: ${shadow.offsetX}px;\n`;
    css += `${indent}--shadow-y: ${shadow.offsetY}px;\n`;
    css += `${indent}--shadow-blur: ${shadow.blur}px;\n`;
    css += `${indent}--shadow-spread: ${shadow.spread}px;\n`;
    css += `${indent}--shadow-opacity: ${shadow.opacity.toFixed(1)};\n`;
    css += `${indent}--shadow-color: ${color};\n`;
    css += Object.entries(tiers)
      .map(([key, value]) => `${indent}${key}: ${value};`)
      .join("\n");
    return css;
  };

  const fontSans = getFontStack(fonts.sans, "sans");
  const fontSerif = getFontStack(fonts.serif, "serif");
  const fontMono = getFontStack(fonts.mono, "mono");

  return `:root {
${formatColorVars(light, "  ")}
  --radius: ${radius};
  --font-sans: ${fontSans};
  --font-serif: ${fontSerif};
  --font-mono: ${fontMono};
${formatShadowVars(shadow, "light", "  ")}
}

.dark {
${formatColorVars(dark, "  ")}
${formatShadowVars(shadow, "dark", "  ")}
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}
`;
}
```

Update the component to pass the new params:

```ts
const { light, dark, radius, fonts, shadow } = useTheme();
const css = generateGlobalsCss(light, dark, radius, fonts, shadow);
```

**Step 3: Verify — run build**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/lib/shadow-presets.ts src/components/export-dialog.tsx
git commit -m "feat: full shadow tier + font + sidebar export matching tinte.dev format"
```

---

### Task 5: Update backlog

**Files:**
- Modify: `docs/BACKLOG.md`

**Step 1: Move completed items to archive**

Move these to the "Completed / Rejected" section:
- "Export dialog: include fonts and shadows" — DONE
- "Shadow color picker: hex to OKLCH conversion" — NOT DONE (keeping)
- "Sidebar colors in theme" — DONE

**Step 2: Commit**

```bash
git add docs/BACKLOG.md
git commit -m "docs: update backlog - sidebar colors and export items completed"
```
