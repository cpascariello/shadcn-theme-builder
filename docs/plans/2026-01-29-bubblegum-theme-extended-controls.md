# Bubblegum Theme + Extended Controls

## Overview

Apply the Bubblegum theme (neo-brutalist style with pink borders, cream cards, hard shadows) and add font/shadow customization controls to the theme builder.

## Features

### 1. Bubblegum Theme as Default

Apply the Bubblegum color scheme from tweakUI:
- Pink/magenta primary and borders
- Cream/yellow cards and accents
- Teal secondary
- Hard offset shadows (3px 3px 0px)

Set as the default preset when app loads.

### 2. Font Controls

**Google Fonts with dynamic loading:**

| Category | Options |
|----------|---------|
| Sans | Inter, Poppins, Roboto, Open Sans, Nunito, Work Sans, DM Sans |
| Serif | Lora, Merriweather, Playfair Display, Source Serif Pro, Crimson Text, Libre Baskerville |
| Mono | JetBrains Mono, Fira Code, Source Code Pro, IBM Plex Mono, Roboto Mono |

- Inject `<link>` tags on-demand when font selected
- Load weights 400, 500, 600, 700
- Track loaded fonts to avoid duplicates

### 3. Shadow Controls

**Presets + full slider control:**

| Preset | offsetX | offsetY | blur | spread | opacity |
|--------|---------|---------|------|--------|---------|
| none | 0 | 0 | 0 | 0 | 0 |
| subtle | 0 | 1 | 3 | 0 | 0.1 |
| medium | 0 | 4 | 6 | -1 | 0.1 |
| strong | 0 | 10 | 15 | -3 | 0.15 |
| brutalist | 3 | 3 | 0 | 0 | 1.0 |

**Individual controls:**
- Shadow color (color picker + OKLCH input)
- Offset X (slider, -20 to 20px)
- Offset Y (slider, -20 to 20px)
- Blur (slider, 0 to 50px)
- Spread (slider, -20 to 20px)
- Opacity (slider, 0 to 100%)

Selecting preset populates sliders. Adjusting any slider switches to "custom" preset.

## State Changes

### theme-context.tsx

```typescript
interface ThemeContextValue {
  // Existing
  light: ThemeColors
  dark: ThemeColors
  radius: string
  activeMode: "light" | "dark"
  previewMode: "light" | "dark"
  activePreset: string

  // New
  fonts: {
    sans: string
    serif: string
    mono: string
  }
  shadow: {
    color: string      // OKLCH value
    offsetX: number    // px
    offsetY: number    // px
    blur: number       // px
    spread: number     // px
    opacity: number    // 0-1
  }
  shadowPreset: string

  // New setters
  setFont: (category: "sans" | "serif" | "mono", font: string) => void
  setShadow: (shadow: Partial<Shadow>) => void
  setShadowPreset: (preset: string) => void
}
```

## UI Layout

Color editor sidebar structure:

```
┌─────────────────────────────┐
│ [Light] [Dark] tabs         │
├─────────────────────────────┤
│ ▼ Colors                    │
│   (existing color groups)   │
├─────────────────────────────┤
│ ▼ Fonts          (shared)   │
│   Sans:  [Inter        ▼]   │
│   Serif: [Lora         ▼]   │
│   Mono:  [JetBrains    ▼]   │
├─────────────────────────────┤
│ ▼ Radius         (shared)   │
│   ○────────────● 0.4rem     │
├─────────────────────────────┤
│ ▼ Shadows        (shared)   │
│   Preset: [Brutalist   ▼]   │
│   Color:  [■] oklch(...)    │
│   X: ○──● 3px               │
│   Y: ○──● 3px               │
│   Blur: ○● 0px              │
│   Spread: ○● 0px            │
│   Opacity: ○────────● 100%  │
└─────────────────────────────┘
```

Fonts, Radius, and Shadows are outside the Light/Dark tabs (shared across modes).

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/fonts.ts` | New: font list, useFontLoader hook |
| `src/lib/shadow-presets.ts` | New: shadow preset definitions |
| `src/lib/presets.ts` | Add Bubblegum preset, set as default |
| `src/lib/theme-types.ts` | Add Font and Shadow types |
| `src/context/theme-context.tsx` | Extend state with fonts, shadow, shadowPreset |
| `src/components/color-editor.tsx` | Add collapsible sections, integrate new controls |
| `src/components/font-picker.tsx` | New: font dropdown component |
| `src/components/shadow-controls.tsx` | New: shadow preset + sliders component |
| `src/components/preview/dashboard-preview.tsx` | Apply font/shadow CSS variables |
| `src/app/globals.css` | Bubblegum theme values + shadow/font variables |

## Backlog

- Export dialog: include font `<link>` instructions and shadow variables in output

## Bubblegum Theme Values

### Light Mode
```css
:root {
  --background: oklch(0.9399 0.0203 345.6984);
  --foreground: oklch(0.4712 0.0000 0.0000);
  --card: oklch(0.9498 0.0500 86.8891);
  --card-foreground: oklch(0.4712 0.0000 0.0000);
  --popover: oklch(1.0000 0.0000 0.0000);
  --popover-foreground: oklch(0.4712 0.0000 0.0000);
  --primary: oklch(0.6209 0.1801 348.1385);
  --primary-foreground: oklch(1.0000 0.0000 0.0000);
  --secondary: oklch(0.8095 0.0694 198.1863);
  --secondary-foreground: oklch(0.3211 0.0000 0.0000);
  --muted: oklch(0.8800 0.0504 212.0952);
  --muted-foreground: oklch(0.5795 0.0000 0.0000);
  --accent: oklch(0.9195 0.0801 87.6670);
  --accent-foreground: oklch(0.3211 0.0000 0.0000);
  --destructive: oklch(0.7091 0.1697 21.9551);
  --destructive-foreground: oklch(1.0000 0.0000 0.0000);
  --border: oklch(0.6209 0.1801 348.1385);
  --input: oklch(0.9189 0.0000 0.0000);
  --ring: oklch(0.7002 0.1597 350.7532);
  --chart-1: oklch(0.7002 0.1597 350.7532);
  --chart-2: oklch(0.8189 0.0799 212.0892);
  --chart-3: oklch(0.9195 0.0801 87.6670);
  --chart-4: oklch(0.7998 0.1110 348.1791);
  --chart-5: oklch(0.6197 0.1899 353.9091);
  --sidebar: oklch(0.9140 0.0424 343.0913);
  --sidebar-foreground: oklch(0.3211 0.0000 0.0000);
  --sidebar-primary: oklch(0.6559 0.2118 354.3084);
  --sidebar-primary-foreground: oklch(1.0000 0.0000 0.0000);
  --sidebar-accent: oklch(0.8228 0.1095 346.0183);
  --sidebar-accent-foreground: oklch(0.3211 0.0000 0.0000);
  --sidebar-border: oklch(0.9464 0.0327 307.1744);
  --sidebar-ring: oklch(0.6559 0.2118 354.3084);
  --radius: 0.4rem;
}
```

### Dark Mode
```css
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
  --sidebar-primary-foreground: oklch(1.0000 0.0000 0.0000);
  --sidebar-accent: oklch(0.8228 0.1095 346.0183);
  --sidebar-accent-foreground: oklch(0.2781 0.0296 256.8480);
  --sidebar-border: oklch(0.3729 0.0306 259.7329);
  --sidebar-ring: oklch(0.6559 0.2118 354.3084);
}
```

### Shadow (Bubblegum default - brutalist)
```css
:root {
  --shadow-color: oklch(0.6258 0.1775 348.3615);
  --shadow-x: 3px;
  --shadow-y: 3px;
  --shadow-blur: 0px;
  --shadow-spread: 0px;
  --shadow-opacity: 1.0;
}

.dark {
  --shadow-color: oklch(0.3885 0.0395 241.9310);
}
```

### Fonts (Bubblegum default)
```css
:root {
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-serif: Georgia, Cambria, "Times New Roman", serif;
  --font-mono: JetBrains Mono, ui-monospace, SFMono-Regular, monospace;
}
```
