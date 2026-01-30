# Decisions Log

Key decisions made during development. When you wonder "why did we do X?", the answer should be here.

---

## How Decisions Are Logged

Decisions are captured when these phrases appear:
- "decided" / "let's go with" / "rejected"
- "choosing X because" / "not doing X because"
- "actually, let's" / "changed my mind"

Each entry includes:
- Context (what we were working on)
- Decision (what was chosen)
- Rationale (why - the most important part)

---

## Decision #12 - 2026-01-30
**Context:** Sidebar tokens existed in presets/export but no preview component used them
**Decision:** Add an icon rail (56px) to the left edge of the preview pane rather than a full sidebar
**Rationale:** The preview pane already shares horizontal space with the color editor. A full nav sidebar would squeeze the masonry grid. An icon rail exercises all 8 sidebar tokens (background, foreground, primary, accent, border, ring) with minimal space cost.
**Alternatives considered:** Full nav sidebar (too wide for available space), standalone sidebar card in masonry grid (less realistic context)

## Decision #11 - 2026-01-30
**Context:** Default theme and mode when landing on the page
**Decision:** Changed default preset from Bubblegum to Retro, and default preview mode from light to dark
**Rationale:** Retro dark better showcases the builder's current direction. Overrides Decision #1 (Bubblegum default).
**Alternatives considered:** Keeping Bubblegum (no longer the focus)

## Decision #10 - 2026-01-30
**Context:** Hue shift slider broke when user edited shadows, radius, fonts, or spacing
**Decision:** Use `loadedTheme` (not `activePreset`) as the base for hue shifting, and only reset hue shift on manual color edits
**Rationale:** Non-color edits (shadows, radius, fonts, spacing) all set `activePreset` to "custom", which disabled the slider. `loadedTheme` survives customization, so the slider stays functional. Only `setColor` resets hue shift because it directly modifies colors that the slider controls.
**Alternatives considered:** Disabling slider on any customization (original plan — too restrictive, broke on shadow edits)

## Decision #9 - 2026-01-29
**Context:** Shadow reset needed to remember which theme was loaded
**Decision:** Track `loadedTheme` separately from `activePreset`
**Rationale:** `activePreset` gets set to "custom" on any tweak (color, font, shadow, radius). Reset needs to know the original theme (e.g., "Green") to restore its shadow config. A separate `loadedTheme` state preserves this across customizations.
**Alternatives considered:** Using a ref (wouldn't trigger re-render of resetShadow callback)

## Decision #8 - 2026-01-29
**Context:** Shadow color management across light/dark mode
**Decision:** Mode-aware shadow colors with opt-out for theme-specific colors
**Rationale:** Neutral shadow presets auto-swap between light (`oklch(0.2 0 0)`) and dark (`oklch(0.9 0 0)`) on mode change. Themes with custom shadow colors (e.g., Bubblegum pink) keep their color. Shadow preset changes only modify geometry, never color.
**Alternatives considered:** Always auto-swap (breaks themed colors), Never auto-swap (dark shadows invisible on dark mode)

## Decision #7 - 2026-01-29
**Context:** Radix UI portaled content (dropdowns, dialogs) not inheriting theme
**Decision:** Inject theme CSS variables into `:root` via global `<style>` tag
**Rationale:** Radix portals content to `document.body`, outside the themed wrapper div. Inline styles on the wrapper don't cascade to portaled elements. A `<style>` targeting `:root` ensures all portaled UI inherits theme variables.
**Alternatives considered:** Radix Portal container prop (limited support), CSS-in-JS (unnecessary complexity)

## Decision #6 - 2026-01-29
**Context:** Preview components had forced equal row heights in CSS Grid
**Decision:** CSS `columns` layout for masonry-like packing
**Rationale:** CSS Grid forces rows to match the tallest item's height, creating large gaps. CSS `columns` with `break-inside-avoid` lets each card take its natural height, producing a dense masonry layout without JavaScript.
**Alternatives considered:** CSS Grid with row-span (gaps persist), Flex columns (unbalanced), Masonry JS library (overkill)

## Decision #5 - 2026-01-29
**Context:** Preview pane redesign — layout and component count
**Decision:** 20 preview components in two sections: 4-column masonry (14 components) + 2-column masonry (6 components)
**Rationale:** More components showcase a wider range of shadcn/ui primitives (Card, Table, Avatar, Badge, Progress, Switch, Accordion, etc.). Two sections with different column counts add visual variety. Inspired by ui.jln.dev and tinte.dev.
**Alternatives considered:** 4-column CSS Grid (equal height issues), 3-column flex (unbalanced), Single masonry section (too uniform)

## Decision #4 - 2026-01-29
**Context:** Layout - header scrolling with content
**Decision:** Fixed header, independently scrollable left/right panes
**Rationale:** Better UX - header always accessible, each pane scrolls within its bounds without affecting the other
**Alternatives considered:** Single scroll container (rejected - causes white space issues, harder to navigate)

## Decision #3 - 2026-01-29
**Context:** Shadow controls UI design
**Decision:** Presets dropdown + full individual sliders for fine-tuning
**Rationale:** Quick access to common shadow styles (none, subtle, brutalist) while allowing detailed customization. Preset auto-selects when slider values match.
**Alternatives considered:** Presets only (too limited), Sliders only (no quick selection), Simplified presets with one slider (not enough control)

## Decision #2 - 2026-01-29
**Context:** Font selection approach
**Decision:** Curated Google Fonts list (5-8 per category) with dynamic loading
**Rationale:** Small list keeps UI clean, covers 90% of use cases. Dynamic loading via `<link>` injection avoids bundling all fonts.
**Alternatives considered:** Web-safe fonts only (too limited), Large font library (slower, overwhelming), Custom font upload (complexity)

## Decision #1 - 2026-01-29
**Context:** Default theme for the builder
**Decision:** Bubblegum (neo-brutalist) as default instead of neutral Zinc
**Rationale:** Showcases the builder's capabilities better - distinctive pink borders, cream cards, hard shadows make the theming features obvious. Users can switch to neutral if preferred.
**Alternatives considered:** Keep Zinc default (boring, doesn't showcase features)
