# Architecture

Technical patterns and decisions.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, shadcn/ui (Radix primitives) |
| Styling | Tailwind CSS 4 |
| State | React Context API |
| Color Format | OKLCH |
| Fonts | Google Fonts (dynamic loading) |
| Charts | Recharts |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main page - applies theme, layout
│   ├── layout.tsx         # Root layout with ThemeProvider
│   └── globals.css        # Tailwind config + default theme
├── components/
│   ├── ui/                # shadcn/ui components (button, card, etc.)
│   ├── color-editor.tsx   # Left sidebar with all controls
│   ├── color-row.tsx      # Individual color picker row
│   ├── font-picker.tsx    # Google Font dropdown
│   ├── shadow-controls.tsx # Shadow presets + sliders
│   ├── top-bar.tsx        # Header with preset selector
│   ├── export-dialog.tsx  # CSS export modal
│   └── preview/
│       ├── dashboard-preview.tsx  # Preview container
│       ├── stat-cards.tsx
│       ├── chart-card.tsx
│       ├── recent-sales.tsx
│       ├── data-table-card.tsx
│       └── component-showcase.tsx
├── context/
│   └── theme-context.tsx  # All theme state + setters
└── lib/
    ├── theme-types.ts     # TypeScript interfaces
    ├── presets.ts         # Theme presets (Bubblegum, etc.)
    ├── fonts.ts           # Font options + loader
    ├── shadow-presets.ts  # Shadow presets + builder
    ├── color-utils.ts     # OKLCH ↔ Hex conversion
    └── utils.ts           # cn() helper
```

---

## Patterns

### Theme Context Pattern
**Date:** 2026-01-29
**Context:** Need centralized state for colors, fonts, shadows, radius across all components
**Approach:** Single React Context (`ThemeContext`) holds all theme state. Components consume via `useTheme()` hook. State changes trigger re-render of preview.
**Key files:** `src/context/theme-context.tsx`
**Notes:** Presets load all values at once. Individual changes set `activePreset` to "custom".

### CSS Variable Injection
**Date:** 2026-01-29
**Context:** Need to apply theme values to preview without rebuilding Tailwind
**Approach:** Build CSS variables object from theme state, apply as inline `style` on page container. All components use `var(--color-name)` which resolves to injected values.
**Key files:** `src/app/page.tsx`, `src/app/globals.css`
**Notes:** Shadow override uses injected `<style>` tag with `!important` to override compiled Tailwind shadow classes.

### Dynamic Font Loading
**Date:** 2026-01-29
**Context:** Google Fonts need to be loaded on-demand when selected
**Approach:** `loadGoogleFont()` injects `<link>` tags into document head. Tracks loaded fonts in Set to avoid duplicates. `useEffect` in ThemeProvider triggers loading when fonts change.
**Key files:** `src/lib/fonts.ts`, `src/context/theme-context.tsx`
**Notes:** Fonts load weights 400, 500, 600, 700. Falls back gracefully if load fails.

### Collapsible Sections
**Date:** 2026-01-29
**Context:** Color editor has many controls, needs organization
**Approach:** `CollapsibleSection` component with chevron toggle. Sections: Colors, Fonts, Radius, Shadows.
**Key files:** `src/components/color-editor.tsx`
**Notes:** All sections default to open. Fonts/Radius/Shadows are shared across light/dark modes.
