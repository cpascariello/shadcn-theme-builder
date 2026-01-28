# shadcn Theme Builder — Design Document

## Overview

A focused shadcn/ui theme builder: pick/edit colors with HSL inputs and color pickers, see live shadcn component previews in a dashboard layout, and export a complete `globals.css` file.

## Tech Stack

- Next.js 15 (App Router)
- shadcn/ui
- Tailwind CSS v4
- TypeScript
- recharts (for chart preview)

## Layout

Single-page app with three zones:

- **Top bar** — App title, preset theme selector (dropdown), light/dark mode toggle for preview, "Export" button
- **Left sidebar (~320px)** — Color editor panel with Light/Dark tabs
- **Main area** — Live dashboard preview using real shadcn components

## Color Editor Panel

### Variables by Category

| Category | Variables |
|----------|-----------|
| Base | `background`, `foreground` |
| Card | `card`, `card-foreground` |
| Popover | `popover`, `popover-foreground` |
| Primary | `primary`, `primary-foreground` |
| Secondary | `secondary`, `secondary-foreground` |
| Muted | `muted`, `muted-foreground` |
| Accent | `accent`, `accent-foreground` |
| Destructive | `destructive`, `destructive-foreground` |
| Border | `border`, `input`, `ring` |
| Radius | `radius` (slider, not a color) |

### Each Color Row

- Label (e.g. "Primary")
- Small color swatch (clickable, opens color picker popover)
- HSL text input (editable, e.g. `222.2 47.4% 11.2%`)

### Mode Tabs

Light / Dark tabs at top of sidebar switch which mode you're editing. Both stored independently in state.

### Radius

Simple slider (0px to 1rem) at bottom of panel.

## Dashboard Preview

Wrapped in a container div with theme CSS variables applied as inline styles (isolated from rest of app).

### Layout

- **Top:** 3-4 stat cards (Total Revenue, Subscriptions, Active Users) using Card components
- **Middle left:** Larger card with bar/line chart (recharts)
- **Middle right:** Card with "Recent Sales" list (avatars, names, amounts)
- **Bottom:** Card with data Table + action buttons (default, secondary, destructive, outline, ghost variants) + Badge, Alert, Input, Switch, Tabs components

### Mode Toggle

Top bar toggle switches preview between light/dark by swapping CSS variables on the preview container.

## State Management

React context holds full theme state (light + dark color maps). Color changes update CSS variables on the preview container in real-time.

No backend, no database. Purely client-side.

## Preset Themes

| Preset | Description |
|--------|-------------|
| Default | Standard shadcn zinc-based theme |
| Warm | Earthy stone/amber palette |
| Cool | Blue/slate palette |
| Green | Nature-inspired green/emerald |
| High Contrast | Sharp black/white with vivid accents |

Each preset is a plain object with full light + dark color maps. Selecting a preset replaces current theme state.

## Export

- "Export" button opens a Dialog
- Shows full `globals.css` file in a code block
- Generated file includes: Tailwind v4 import, `:root` block (light), `.dark` block (dark), base layer styles
- Copy button with "Copied!" confirmation

## Out of Scope (v1)

- No save/load/URL sharing
- No backend or database
- No multi-platform export (VSCode, terminals, etc.)
