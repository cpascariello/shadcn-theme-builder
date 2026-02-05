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

## Decision #23 - 2026-02-05
**Context:** Mobile bottom sheet — sections open by default showed too much content
**Decision:** All collapsible sections start collapsed on mobile, open on desktop
**Rationale:** User feedback — collapsed sections give a better overview of all available options on the limited mobile screen. Added `defaultCollapsed` prop to `ColorEditorContent`.
**Alternatives considered:** Keep all open (too much scrolling on mobile)

## Decision #22 - 2026-02-05
**Context:** Mobile bottom sheet — drawer was darkening the preview and opening too high
**Decision:** Disable overlay (`showOverlay={false}`) and cap height at 50vh
**Rationale:** User feedback — the preview should stay visible and interactive while editing. Half-screen gives enough editor space while keeping preview context. Added `showOverlay` prop to drawer component.
**Alternatives considered:** Modal drawer with overlay (blocks preview interaction)

## Decision #21 - 2026-02-05
**Context:** Toolbar control ordering
**Decision:** Order: Preset dropdown → Light/dark toggle → (spacer) → Undo → Redo
**Rationale:** User preference — light/dark toggle next to preset selector makes sense as both affect the overall theme appearance. Undo/redo are editing actions, grouped on the right.
**Alternatives considered:** Toggle on far right after undo/redo (original layout)

## Decision #20 - 2026-02-05
**Context:** Mobile responsive redesign — where to put undo/redo on mobile
**Decision:** Keep undo/redo in the sticky toolbar header, alongside preset selector and light/dark toggle
**Rationale:** Always accessible without opening the bottom sheet. Adds slight clutter to the toolbar but undo/redo is used frequently enough to justify permanent visibility.
**Alternatives considered:** In bottom sheet header (only visible when editing), in hamburger (too much friction), keyboard shortcuts only (not discoverable)

## Decision #19 - 2026-02-05
**Context:** Mobile responsive redesign — how to open the color editor on mobile
**Decision:** Persistent bottom bar with "Edit Theme" that opens a Vaul Drawer (bottom sheet) to 50% viewport height
**Rationale:** Half-screen sheet keeps the preview visible above so users get instant visual feedback while editing. Persistent bar is always discoverable. Vaul gives native-feeling drag-to-close behavior.
**Alternatives considered:** Accordion inline above preview (pushes preview down, no live feedback), toggle panel (all-or-nothing, no partial view), FAB button (less discoverable)

## Decision #18 - 2026-02-05
**Context:** Mobile responsive redesign — header content on small screens
**Decision:** Hamburger menu for app-level actions (save, push, export, wallet), keep theme selector + light/dark toggle visible
**Rationale:** Theme selector and light/dark toggle directly affect the preview and are used constantly. Save, push, export, and wallet are session-level actions used less frequently — hamburger is fine.
**Alternatives considered:** Show all buttons (doesn't fit), show nothing (no quick access to common actions)

## Decision #17 - 2026-02-05
**Context:** Desktop toolbar reorganization — grouping controls by relevance
**Decision:** Split into AppBar (title, save, push, export, wallet) and Toolbar (preset selector, undo/redo, light/dark toggle). Same content on both desktop and mobile, different layouts.
**Rationale:** Groups "affects the preview" controls together. The UndoRedoBar was wasted space with only two buttons. Same content per bar on all breakpoints avoids conditional rendering — only CSS layout changes. Simpler code.
**Alternatives considered:** Mobile-only regrouping (requires breakpoint-conditional content, more complex), keep current layout (undo/redo bar underutilized, header crowded)

## Decision #16 - 2026-02-04
**Context:** Aleph aggregate format for storing themes
**Decision:** Single `themes` array key with full snapshot writes, after trying per-key format
**Rationale:** Per-key format (`{ [themeName]: ThemeConfig }`) leverages Aleph's key-level merge but leaves stale null keys on delete that accumulate forever. A single `themes` array means every push/delete writes a clean snapshot — no stale keys. The tradeoff is client-side merge on push (to preserve existing cloud themes not in localStorage), which is straightforward.
**Alternatives considered:** Per-key format with null tombstones (stale key accumulation), per-key format without delete (no way to remove themes)

## Decision #15 - 2026-02-04
**Context:** UX for local vs cloud themes after pushing to Aleph
**Decision:** Auto-remove local themes from localStorage after successful cloud push
**Rationale:** Having the same theme in both "My Themes" and "Cloud Themes" is confusing — users don't understand why they need to manually delete the local copy after pushing. Clearing localStorage after push moves themes cleanly to "Cloud Themes" section.
**Alternatives considered:** Keep both copies (confusing UX, requires manual cleanup)

## Decision #14 - 2026-02-04
**Context:** Wallet connect button in the top bar
**Decision:** Use a native shadcn Button that calls `appKit.open()` instead of the `<appkit-button>` web component
**Rationale:** The Reown web component has SSR hydration issues in Next.js 16 (renders unstyled, disappears on click). A native button is consistent with the rest of the UI and avoids web component lifecycle problems. Shows a Wallet icon when disconnected, icon + truncated address when connected.
**Alternatives considered:** `<appkit-button>` web component (SSR issues), `useAppKit()` hook (requires `createAppKit` to run before any render, fails during static prerendering)

## Decision #13 - 2026-02-04
**Context:** Choosing decentralized storage for cross-device theme sync
**Decision:** Aleph.im aggregate messages with Reown AppKit for wallet connection (ETH + SOL)
**Rationale:** Aggregates are key-value storage tied to a wallet address — reads are free (no signing), writes require a one-time signature. Same `ThemeConfig` shape as localStorage, no conversion needed. Reown AppKit handles both Ethereum and Solana wallets with a single modal.
**Alternatives considered:** IPFS (no key-value semantics), centralized backend (requires auth infrastructure), on-chain storage (expensive, overkill)

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
