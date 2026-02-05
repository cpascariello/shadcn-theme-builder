# Mobile Responsive Design

**Date:** 2026-02-05
**Status:** Approved

## Goal

Make the shadcn Theme Builder fully usable on mobile while improving toolbar organization on all screen sizes.

## Breakpoint

`md` (768px). Below = mobile layout. Above = desktop layout.

---

## Phase 1A: Desktop Regrouping

Reorganize the header and undo/redo bar to group controls by relevance.

### Current Desktop Layout

```
┌─────────────────────────────────────────────────────────┐
│ Title | Preset | Save | Push | ◐/☀ | Export | Wallet    │ TopBar
├───────────┬─────────────────────────────────────────────┤
│           │  ↩ 🔄                                       │ UndoRedoBar
│ ColorEdit ├─────────────────────────────────────────────┤
│  (w-96)   │  SidebarRail + Preview                      │
└───────────┴─────────────────────────────────────────────┘
```

### New Desktop Layout

```
┌─────────────────────────────────────────────────────────┐
│ Title          | Save | Push to Cloud | Export | Wallet  │ AppBar
├───────────┬─────────────────────────────────────────────┤
│           │  Preset ▾ | ↩ 🔄 | ◐/☀                     │ Toolbar
│ ColorEdit ├─────────────────────────────────────────────┤
│  (w-96)   │  SidebarRail + Preview                      │
└───────────┴─────────────────────────────────────────────┘
```

### What Moves

- **Theme selector** (preset dropdown) → Toolbar
- **Light/Dark toggle** → Toolbar
- **Undo/Redo** stays in Toolbar (renamed from UndoRedoBar)

### What Stays in AppBar

- Title/branding
- Save Theme
- Push to Cloud
- Export CSS
- Wallet Connect

### Rationale

- Groups "affects the current preview" controls together in the Toolbar
- Declutters the header — app-level actions stay up top
- The UndoRedoBar was wasted space with only two buttons
- Same content in both bars regardless of breakpoint = simpler component code

---

## Phase 1B: Mobile Layout (below `md`)

### Default State

```
┌──────────────────────────────┐
│ ☰                            │  AppBar (sticky, slim)
├──────────────────────────────┤
│ Preset ▾  |  ↩ 🔄  |  ◐/☀  │  Toolbar (sticky, below AppBar)
├──────────────────────────────┤
│                              │
│    Preview (full width)      │
│    No sidebar rail           │
│    Masonry 1-col             │
│                              │
├──────────────────────────────┤
│  ═══  Edit Theme             │  Bottom bar (fixed to bottom)
└──────────────────────────────┘
```

### Bottom Sheet Open (50% viewport height)

```
┌──────────────────────────────┐
│ ☰                            │  AppBar (sticky)
├──────────────────────────────┤
│ Preset ▾  |  ↩ 🔄  |  ◐/☀  │  Toolbar (sticky)
├──────────────────────────────┤
│    Preview (still visible)   │
├──────────────────────────────┤
│  ═══  Edit Theme         ✕   │  Sheet header + handle
│  🔍 Search tokens...        │
│ ┌──────────────────────────┐ │
│ │ ▸ Color Shifts           │ │
│ │ ▸ Backgrounds            │ │  Scrollable inside sheet
│ │ ▸ Text Colors            │ │
│ │ ▸ Fonts / Shadows / etc  │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

### Mobile AppBar (Hamburger)

The AppBar on mobile collapses to a hamburger icon. Tapping it opens a dropdown menu with:

- App title / branding
- Save Theme
- Push to Cloud
- Export CSS
- Connect Wallet

### Mobile Toolbar (Sticky)

Same content as desktop, sits directly below the hamburger row:

- Theme selector (preset dropdown)
- Undo / Redo buttons
- Light/Dark toggle

### Bottom Sheet Behavior

- Persistent bottom bar with handle grip + "Edit Theme" label — always visible
- Tap or swipe up to open the sheet to ~50% viewport height
- Preview remains visible and live in the top half — changes reflect immediately
- Sheet content scrolls internally (search bar + collapsible sections)
- Tap handle or "✕" to close, returning to full-screen preview

### Sidebar Rail

Hidden entirely on mobile (`hidden md:flex`). The icons are decorative preview elements only.

---

## Component Changes

| Component | Desktop Change | Mobile Change |
|---|---|---|
| `TopBar` → `AppBar` | Remove preset dropdown, light/dark toggle | Becomes hamburger-only row |
| `UndoRedoBar` → `Toolbar` | Add preset dropdown + light/dark toggle | Same content, sticky below AppBar |
| `ColorEditor` | No change (stays `w-96` sidebar) | Moves into bottom sheet |
| `SidebarRail` | No change | Hidden (`hidden md:flex`) |
| `DashboardPreview` | No change | Full width, respects bottom bar spacing |
| **New: `BottomSheet`** | Not rendered | Sheet with handle, search, collapsible sections |
| **New: `HamburgerMenu`** | Not rendered | Dropdown menu with app-level actions |

## Implementation Approach

- **Bottom sheet:** Use shadcn `Sheet` component (Radix Dialog) configured to slide from bottom
- **Hamburger menu:** Use shadcn `DropdownMenu` component
- **Responsive toggling:** Tailwind classes (`hidden md:flex` / `flex md:hidden`)
- **No new dependencies** — all built from existing shadcn/ui primitives
- **ColorEditor content reuse:** Extract the scrollable section content into a shared component used by both the desktop sidebar and the mobile bottom sheet

## Phasing

- **Phase 1A:** Desktop regrouping (rename TopBar→AppBar, UndoRedoBar→Toolbar, move controls)
- **Phase 1B:** Mobile layout (hamburger, bottom sheet, responsive hide/show, preview adjustments)
- **Phase 2:** Revert desktop regrouping if it doesn't feel right after testing (low risk fallback)
