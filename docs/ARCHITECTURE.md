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
│   ├── undo-redo-bar.tsx  # Undo/redo toolbar above preview
│   ├── top-bar.tsx        # Header with preset selector, save, cloud push, wallet connect
│   ├── wallet-provider.tsx # WagmiProvider + QueryClientProvider wrapper
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
│       ├── faq-accordion.tsx        # Accordion FAQ
│       └── sidebar-rail.tsx         # Icon rail sidebar (exercises --sidebar-* tokens)
├── hooks/
│   ├── use-saved-themes.ts  # localStorage CRUD for saved themes
│   └── use-aleph-sync.ts   # Aleph aggregate read/write via Reown wallet
├── context/
│   └── theme-context.tsx  # All theme state + setters + undo/redo history
└── lib/
    ├── theme-types.ts     # TypeScript interfaces
    ├── presets.ts         # Theme presets (Bubblegum, etc.)
    ├── fonts.ts           # Font options + loader
    ├── shadow-presets.ts  # Shadow presets + builder
    ├── color-utils.ts     # OKLCH ↔ Hex conversion + hue/lightness shift
    ├── reown-config.ts    # Reown AppKit setup (Wagmi + Solana adapters)
    ├── aleph.ts           # Aleph SDK aggregate read/write functions
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
**Approach:** Two layers: (1) `buildCssVariables()` creates inline `style` on page container for colors, radius, spacing, fonts, letter spacing. (2) `buildGlobalCssOverride()` generates a `<style>` tag on `:root` with the same variables plus shadow tier CSS variables (`--shadow-2xs` through `--shadow-2xl`). Tailwind shadow utilities resolve to themed values via these CSS variables. The `--spacing` variable controls Tailwind CSS 4's base spacing unit (default `0.25rem`), scaling all padding, margins, and gaps uniformly.
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
**Approach:** `CollapsibleSection` component with bordered card UI, uppercase title, chevron toggle. Semantic color groups: Backgrounds, Text, Accents, Borders, Charts, Sidebar. Non-color sections: Color Shifts, Fonts, Border Radius, Shadows, Letter Spacing.
**Key files:** `src/components/color-editor.tsx`
**Notes:** All sections default open except Color Shifts (collapsed by default). Search bar filters by both token name and section title. Light/dark mode controlled solely by the header toggle (`previewMode`).

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

### Color Shifts (Hue + Lightness)
**Date:** 2026-01-30
**Context:** Users want to explore color variations of a preset without manually editing every token
**Approach:** Two sliders in a "Color Shifts" collapsible card in the side panel: Hue (-180° to +180°) rotates OKLCH hue, Lightness (-0.15 to +0.15) shifts OKLCH lightness. Both are always applied together from the original preset colors via `applyColorShifts()` to avoid cumulative drift. Destructive colors and achromatic tokens (chroma < 0.001) are pinned for hue shift. Shadow colors are unaffected. Both values are included in `ThemeSnapshot` for undo/redo support.
**Key files:** `src/lib/color-utils.ts`, `src/context/theme-context.tsx`, `src/components/color-editor.tsx`
**Notes:** Uses `loadedTheme` (not `activePreset`) so the sliders survive non-color edits (shadows, radius, fonts) that set `activePreset` to "custom". Manual color edits (`setColor`) reset both shifts to 0. Loading a new preset resets both to 0. Card is collapsed by default.

### Sidebar Rail Preview
**Date:** 2026-01-30
**Context:** Sidebar theme tokens (--sidebar, --sidebar-foreground, etc.) were defined in presets and exported but never visually demonstrated
**Approach:** Icon-only vertical rail (56px) on the left edge of the preview pane. Uses all 8 sidebar CSS variables directly via inline styles. Self-contained in a single component for easy removal.
**Key files:** `src/components/preview/sidebar-rail.tsx`, `src/components/preview/dashboard-preview.tsx`
**Notes:** DashboardPreview wraps existing masonry content in a flex row with the rail. To remove: delete `sidebar-rail.tsx` and revert the wrapper in `dashboard-preview.tsx`.

### Undo/Redo History
**Date:** 2026-01-30
**Context:** Users need to revert theme edits without manually tracking values
**Approach:** `ThemeProvider` maintains a history stack (max 50 `ThemeSnapshot` entries) and an index pointer. Every setter calls a debounced (300ms) `pushHistory()` before mutating, so slider drags and rapid color picks coalesce into one entry. `undo()`/`redo()` apply snapshots via `applySnapshot()`, guarded by `isRestoringRef` to prevent recursive pushes. Keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z, Cmd/Ctrl+Y) are registered in a `useEffect`. Loading a preset resets history to a single entry.
**Key files:** `src/context/theme-context.tsx`, `src/components/undo-redo-bar.tsx`, `src/app/page.tsx`
**Notes:** Refs (`historyRef`, `historyIndexRef`, `currentSnapshotRef`) mirror state to avoid stale closures in the debounced callback. `previewMode` is intentionally excluded from snapshots — it's a view toggle, not a theme edit.

### Saved Themes (localStorage)
**Date:** 2026-02-03
**Context:** Users want to save and reload custom themes across sessions
**Approach:** `useSavedThemes()` hook manages a JSON array of `ThemeConfig` objects in localStorage under `shadcn-theme-builder-saved`. Save button (floppy disk icon) in the top bar opens a popover with name input. Saved themes appear in a "My Themes" section in the preset dropdown with inline delete (two-click confirm). Loading a saved theme uses `loadThemeConfig()` which accepts a `ThemeConfig` directly.
**Key files:** `src/hooks/use-saved-themes.ts`, `src/components/top-bar.tsx`, `src/context/theme-context.tsx`
**Notes:** `loadedTheme` (string) was replaced with `loadedThemeConfig` (full `ThemeConfig`) so that hue/lightness shifts and shadow reset work correctly with saved themes — they reference the stored config directly instead of looking up from the built-in presets array.

### Aleph Cloud Sync (Wallet-Connected Storage)
**Date:** 2026-02-04
**Context:** Users want to sync saved themes across devices via decentralized storage
**Approach:** Reown AppKit provides wallet connection (ETH + SOL) via `createAppKit()` with `WagmiAdapter` and `SolanaAdapter`. `WalletProvider` wraps the app with `WagmiProvider` + `QueryClientProvider`. Aleph SDK reads/writes theme data as aggregate messages (key: `shadcn-theme-builder-themes`, channel: `shadcn-theme-builder`). Aggregate stores `{ themes: ThemeConfig[] }` — a single `themes` key with the full array as a clean snapshot. Reads are free (no signing), writes trigger a wallet signature popup. `useAlephSync()` hook auto-pulls on wallet connect and exposes `pushToAleph`/`pullFromAleph`/`deleteFromAleph`. Push merges local themes into existing cloud themes client-side before writing the full snapshot. Delete fetches current cloud state, filters out the target, and pushes back. After a successful push, local themes are cleared from localStorage and appear under "Cloud Themes". The preset dropdown shows three sections: built-in presets, "My Themes" (local), and "Cloud Themes" (remote-only, with delete). Push button shows a helpful tooltip when disabled.
**Key files:** `src/lib/reown-config.ts`, `src/lib/aleph.ts`, `src/hooks/use-aleph-sync.ts`, `src/components/wallet-provider.tsx`, `src/components/top-bar.tsx`
**Notes:** Dynamic imports for Aleph SDK and ethers5 keep the main bundle small. Chain detection uses CAIP address prefix (`eip155:` vs `solana:`). Solana provider needs wrapping into `{ publicKey, signMessage, connected, connect }` for Aleph SDK's `getAccountFromProvider()`. ethers5 is aliased (`ethers5@npm:ethers@^5.7.2`) to avoid v6 conflicts. Fetch handles both the primary `{ themes: [...] }` format and a legacy per-key format from an intermediate version, deduplicating by name.
