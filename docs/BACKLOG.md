# Backlog

Ideas and scope creep captured for later consideration.

---

## How Items Get Here

- Scope drift detected during focused work (active interrupt)
- Ideas that come up but aren't current priority
- "We should also..." moments
- Features identified but deferred

---

## Open Items

### 2026-01-30 - Import external themes by pasting CSS
**Source:** User idea
**Description:** Allow users to paste globals.css from other shadcn theme builders (e.g. tinte.dev, ui.shadcn.com) and have the builder parse the CSS variables into a live theme. Would need to extract OKLCH/hex color values, radius, fonts, shadows, etc. from `:root` and `.dark` blocks.
**Priority:** Medium

### 2026-01-30 - Create themes from Coolors.co palettes
**Source:** User idea
**Description:** Generate theme presets from Coolors.co color palette URLs (e.g. `https://coolors.co/palette/0c0f0a-ff206e-fbff12-41ead4-ffffff`). Parse the hex colors from the URL, convert to OKLCH, and map them to theme tokens (background, foreground, primary, accent, etc.). Could be an import feature or used to expand the preset library.
**Priority:** Medium

---

## Completed / Rejected

<details>
<summary>Archived items</summary>

### 2026-01-30 - Export dialog: include fonts and shadows ✅
**Source:** Identified during Bubblegum theme implementation
**Completed:** Export now includes font stacks, shadow parameters, computed shadow tiers (--shadow-2xs through --shadow-2xl), sidebar colors, and @theme inline block matching tinte.dev format.

### 2026-01-30 - Sidebar colors in theme ✅
**Source:** Original Bubblegum CSS included sidebar variables
**Completed:** Added 8 sidebar color variables to ThemeColors, all presets, color editor UI, and CSS export. Bubblegum uses exact tinte.dev values.

### 2026-02-03 - Shadow color picker: hex to OKLCH conversion ✅
**Source:** Identified during shadow controls testing
**Completed:** Native color picker now converts hex to OKLCH via `hexToOklch()` before storing, keeping shadow colors consistent with all other theme values.

### 2026-02-03 - Save custom themes ✅
**Source:** User idea
**Completed:** Save/load/delete custom themes via localStorage. Floppy disk icon button opens name input popover with overwrite confirmation. Saved themes appear in "My Themes" section of the preset dropdown with inline delete (two-click confirm). Also fixed: `loadedTheme` replaced with `loadedThemeConfig` (full ThemeConfig) so hue/lightness shifts and shadow reset work correctly with saved themes.

### 2026-02-04 - Aleph Cloud sync with Reown wallet ✅
**Source:** User idea, planned and implemented
**Completed:** Save/load themes to Aleph.im aggregate messages via Reown AppKit wallet connection (ETH + SOL). Auto-pulls on connect, push merges local into cloud and auto-clears localStorage. Cloud themes deletable with two-click confirm. Push button shows helpful tooltip when disabled. Aggregate uses single `themes` array key for clean snapshots.

### 2026-02-03 - Global spacing slider ✅
**Source:** User idea, brainstormed and designed
**Completed:** Added `--spacing` slider (0.15–0.4rem) controlling Tailwind CSS 4's base spacing unit. Sits next to border radius. Included in export, undo/redo, and all presets. Per-component overrides (buttons, form fields) deferred — not exportable without brittle selector overrides.

### 2026-02-05 - Mobile responsive layout ✅
**Source:** User request, brainstormed and planned
**Completed:** Reorganized desktop bars (AppBar for app actions, Toolbar for editing controls). Mobile: hamburger menu, Vaul bottom sheet editor at 50vh without overlay, sections collapsed by default, hidden sidebar rail, full-width preview. Extracted reusable components (PresetDropdown, LightDarkToggle, ColorEditorContent).

</details>
