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
│       ├── dashboard-preview.tsx    # Preview container (masonry layout)
│       ├── quick-stats.tsx          # Metric cards
│       ├── notification-center.tsx  # Avatar + badge notifications
│       ├── user-profile-card.tsx    # Avatar, name, badge
│       ├── revenue-chart.tsx        # Recharts AreaChart + Tabs
│       ├── quick-actions.tsx        # Icon button grid
│       ├── payment-form.tsx         # Form inputs, select, labels
│       ├── settings-toggles.tsx     # Switch controls
│       ├── active-sessions.tsx      # Device list with badges
│       ├── recent-activity-table.tsx # Table + badges + search
│       ├── search-command.tsx       # Search input with ⌘K hint
│       ├── team-members.tsx         # Avatar list with roles
│       ├── mini-progress-stats.tsx  # Progress bars
│       ├── alert-banner.tsx         # Alert component
│       ├── quick-links.tsx          # Link list
│       ├── upcoming-events.tsx      # Calendar-style event list
│       ├── pricing-table.tsx        # Pricing tiers
│       ├── login-form.tsx           # Auth form
│       ├── delete-dialog.tsx        # Confirmation dialog
│       ├── file-upload.tsx          # Upload dropzone
│       └── faq-accordion.tsx        # Accordion FAQ
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
**Date:** 2026-01-29, updated 2026-01-30
**Context:** Need to apply theme values to preview without rebuilding Tailwind
**Approach:** Two layers: (1) `buildCssVariables()` creates inline `style` on page container for colors, radius, fonts, letter spacing. (2) `buildGlobalCssOverride()` generates a `<style>` tag on `:root` with the same variables plus shadow tier CSS variables (`--shadow-2xs` through `--shadow-2xl`). Tailwind shadow utilities resolve to themed values via these CSS variables.
**Key files:** `src/app/page.tsx`, `src/app/globals.css`
**Notes:** Previous approach used a blunt `!important` override on `[class*="shadow"]` — replaced with proper CSS variable injection so different shadow intensities (shadow-sm vs shadow-xl) are preserved.

### Dynamic Font Loading
**Date:** 2026-01-29
**Context:** Google Fonts need to be loaded on-demand when selected
**Approach:** `loadGoogleFont()` injects `<link>` tags into document head. Tracks loaded fonts in Set to avoid duplicates. `useEffect` in ThemeProvider triggers loading when fonts change.
**Key files:** `src/lib/fonts.ts`, `src/context/theme-context.tsx`
**Notes:** Fonts load weights 400, 500, 600, 700. Falls back gracefully if load fails.

### Collapsible Sections
**Date:** 2026-01-29, updated 2026-01-30
**Context:** Color editor has many controls, needs organization
**Approach:** `CollapsibleSection` component with bordered card UI, uppercase title, chevron toggle. Semantic color groups: Backgrounds, Text, Accents, Borders, Charts, Sidebar. Non-color sections: Fonts, Border Radius, Shadows, Letter Spacing.
**Key files:** `src/components/color-editor.tsx`
**Notes:** All sections default open. Search bar filters by both token name and section title. Light/dark mode controlled solely by the header toggle (`previewMode`).

### Masonry Preview Layout
**Date:** 2026-01-29
**Context:** Preview pane needs to display 20 components at natural heights without forced equal rows
**Approach:** CSS `columns` layout with `break-inside-avoid` on each card. Two sections: 4-column masonry (14 components) and 2-column masonry (6 larger components). Responsive via `columns-1 md:columns-2 lg:columns-4`.
**Key files:** `src/components/preview/dashboard-preview.tsx`
**Notes:** CSS Grid was tried first but forces equal row heights. Flex columns were unbalanced. CSS `columns` gives masonry-like packing natively.

### Global Theme Override for Portals
**Date:** 2026-01-29, updated 2026-01-30
**Context:** Radix UI portals (Select, Dialog) render at `document.body`, outside the themed container
**Approach:** `buildGlobalCssOverride()` generates a `<style>` tag injected into the page that sets all CSS variables on `:root` — colors, fonts, radius, letter spacing, and shadow tiers. This ensures portaled content inherits theme values.
**Key files:** `src/app/page.tsx`
**Notes:** Inline styles on the wrapper div alone are insufficient — they don't cascade to portaled elements.

### Per-Mode Shadow System
**Date:** 2026-01-29, updated 2026-01-30
**Context:** Shadow colors need to adapt to light/dark mode; shadow tiers need to be themed at runtime
**Approach:** `ShadowConfig` stores `lightColor` and `darkColor` separately. `buildShadowTiers()` generates all 8 shadow tier CSS variables (`--shadow-2xs` through `--shadow-2xl`) from the shadow config and current mode. These are injected at runtime via `buildGlobalCssOverride()`, so Tailwind shadow utilities resolve to themed values. Shadow preset changes only modify geometry, preserving user-set colors. `loadedTheme` state tracks the last loaded theme for accurate reset.
**Key files:** `src/lib/shadow-presets.ts`, `src/context/theme-context.tsx`, `src/components/shadow-controls.tsx`
**Notes:** `loadedTheme` is separate from `activePreset` because the latter is set to "custom" on any user tweak. Export dialog uses the same `buildShadowTiers()` for CSS output.
