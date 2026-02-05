# Mobile Responsive Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the theme builder fully usable on mobile with a bottom sheet editor, hamburger menu, and reorganized toolbar — while also improving desktop toolbar grouping.

**Architecture:** Extract shared components (PresetDropdown, LightDarkToggle, ColorEditorContent) from existing monolithic components, then compose them differently for desktop vs mobile layouts. Desktop gets a cleaner toolbar grouping. Mobile gets a hamburger menu, persistent bottom bar with a Vaul Drawer, and a full-width preview.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui (Drawer via Vaul, DropdownMenu via Radix), existing component library.

**Design doc:** `docs/plans/2026-02-05-mobile-responsive-design.md`

---

## Phase 1A: Desktop Regrouping

### Task 1: Install shadcn dependencies

We need the Drawer (for mobile bottom sheet) and DropdownMenu (for hamburger) components. Neither exists in the project yet.

**Step 1: Install drawer and dropdown-menu**

Run:
```bash
npx shadcn@latest add drawer dropdown-menu
```

Expected: Creates `src/components/ui/drawer.tsx` and `src/components/ui/dropdown-menu.tsx`. May also install `vaul` as a dependency.

**Step 2: Verify build**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 3: Commit**

```bash
git add src/components/ui/drawer.tsx src/components/ui/dropdown-menu.tsx package.json package-lock.json
git commit -m "chore: add shadcn drawer and dropdown-menu components"
```

---

### Task 2: Extract PresetDropdown component

The preset dropdown is ~140 lines inside `top-bar.tsx` (lines 98–240). It manages preset selection, saved themes, and cloud themes. Extract it into its own component so it can be used in the new Toolbar.

**Files:**
- Create: `src/components/preset-dropdown.tsx`
- Modify: `src/components/top-bar.tsx`

**Step 1: Create `preset-dropdown.tsx`**

This component encapsulates the entire Popover-based preset selector. It uses the same hooks (`useTheme`, `useSavedThemes`, `useAlephSync`) directly, so it's self-contained.

```tsx
"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Trash2, Cloud, Loader2 } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { useSavedThemes } from "@/hooks/use-saved-themes";
import { useAlephSync } from "@/hooks/use-aleph-sync";
import { presets } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function PresetDropdown() {
  const { activePreset, loadPreset, loadThemeConfig } = useTheme();
  const { savedThemes } = useSavedThemes();
  const { isSyncing, remoteThemes, deleteFromAleph } = useAlephSync();
  const [presetOpen, setPresetOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmCloudDelete, setConfirmCloudDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const cloudOnly = useMemo(() => {
    if (!remoteThemes) return [];
    return remoteThemes.filter(
      (r) => !savedThemes.some((l) => l.name === r.name),
    );
  }, [remoteThemes, savedThemes]);

  const activeLabel =
    presets.find((p) => p.name === activePreset)?.label
    ?? savedThemes.find((t) => t.name === activePreset)?.label
    ?? cloudOnly.find((t) => t.name === activePreset)?.label
    ?? "Custom";

  // Paste the entire Popover JSX from top-bar.tsx lines 98–240 here,
  // replacing references to use local state.
  // The JSX is identical — just moved into this component.
  return (
    <Popover open={presetOpen} onOpenChange={(open) => { setPresetOpen(open); if (!open) { setConfirmDelete(null); setConfirmCloudDelete(null); } }}>
      {/* ... exact same PopoverTrigger + PopoverContent from top-bar.tsx lines 99–239 ... */}
    </Popover>
  );
}
```

Copy the full Popover JSX (lines 98–240 from `top-bar.tsx`) into this component. Replace `remove` with importing from `useSavedThemes()`.

**Step 2: Update `top-bar.tsx`**

Remove the preset dropdown state (`presetOpen`, `confirmDelete`, `confirmCloudDelete`, `deleting`, `cloudOnly`, `activeLabel`) and the Popover JSX. Import and render `<PresetDropdown />` in its place.

Remove these imports that are no longer needed in top-bar: `ChevronDown`, `Trash2`, `Cloud`, `Loader2` (if not used elsewhere), `presets`, `Popover/PopoverContent/PopoverTrigger`.

Remove from hook destructuring: `activePreset`, `loadPreset`, `loadThemeConfig` (if only used by preset dropdown — check `handleSave` still needs `loadThemeConfig` and `getThemeConfig`).

Note: `loadThemeConfig` is also used in `handleSave` (line 78), so keep it in the TopBar destructuring.

The TopBar render should now have `<PresetDropdown />` where the Popover was.

**Step 3: Verify build**

Run: `npm run dev` — check desktop still works, preset dropdown functions.

**Step 4: Commit**

```bash
git add src/components/preset-dropdown.tsx src/components/top-bar.tsx
git commit -m "refactor: extract PresetDropdown into own component"
```

---

### Task 3: Extract LightDarkToggle component

Small extraction — the light/dark toggle button (lines 293–305 of `top-bar.tsx`).

**Files:**
- Create: `src/components/light-dark-toggle.tsx`
- Modify: `src/components/top-bar.tsx`

**Step 1: Create `light-dark-toggle.tsx`**

```tsx
"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";

export function LightDarkToggle() {
  const { previewMode, setPreviewMode } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setPreviewMode(previewMode === "light" ? "dark" : "light")}
    >
      {previewMode === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
```

**Step 2: Update `top-bar.tsx`**

Replace the light/dark toggle button JSX (lines 293–305) with `<LightDarkToggle />`. Remove `Sun`, `Moon` from lucide imports if no longer used. Remove `previewMode`, `setPreviewMode` from `useTheme()` destructuring if no longer used (check: `previewMode` is NOT used elsewhere in TopBar after removing the toggle, so remove it).

**Step 3: Verify build**

Run: `npm run dev` — confirm toggle still works.

**Step 4: Commit**

```bash
git add src/components/light-dark-toggle.tsx src/components/top-bar.tsx
git commit -m "refactor: extract LightDarkToggle into own component"
```

---

### Task 4: Reorganize bars — TopBar→AppBar, UndoRedoBar→Toolbar

Now move PresetDropdown and LightDarkToggle from the AppBar into the Toolbar.

**Files:**
- Modify: `src/components/top-bar.tsx` (rename to AppBar, remove preset/toggle)
- Modify: `src/components/undo-redo-bar.tsx` (rename to Toolbar, add preset/toggle)
- Modify: `src/app/page.tsx` (update imports)

**Step 1: Update `top-bar.tsx` — rename to AppBar**

- Rename the exported function from `TopBar` to `AppBar`
- Remove `<PresetDropdown />` and `<LightDarkToggle />` from the render
- The render should now contain: title, save popover, push button, export dialog, wallet connect

```tsx
export function AppBar() {
  // ... save/push state and handlers stay ...
  return (
    <div className="flex items-center justify-between h-14 border-b px-4 bg-background">
      <span className="font-semibold">ShadCN Theme Builder</span>
      <div className="flex items-center gap-2">
        {/* Save theme popover — unchanged */}
        {/* Push to Aleph button — unchanged */}
        {/* Export dialog — unchanged */}
        {/* Wallet connect — unchanged */}
      </div>
    </div>
  );
}
```

**Step 2: Update `undo-redo-bar.tsx` — rename to Toolbar**

- Rename the exported function from `UndoRedoBar` to `Toolbar`
- Import and add `<PresetDropdown />` and `<LightDarkToggle />`
- Layout: PresetDropdown on the left, then a spacer, then undo/redo + light/dark on the right

```tsx
"use client";

import { useState, useEffect } from "react";
import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";
import { PresetDropdown } from "./preset-dropdown";
import { LightDarkToggle } from "./light-dark-toggle";

export function Toolbar() {
  const { undo, redo, canUndo, canRedo } = useTheme();
  const [mod, setMod] = useState("Ctrl+");
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setMod("⌘");
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b bg-background/80 backdrop-blur-sm flex-shrink-0">
      <PresetDropdown />
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={undo}
        disabled={!canUndo}
        title={`Undo (${mod}Z)`}
      >
        <Undo2 />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={redo}
        disabled={!canRedo}
        title={`Redo (${mod}Shift+Z)`}
      >
        <Redo2 />
      </Button>
      <LightDarkToggle />
    </div>
  );
}
```

**Step 3: Update `page.tsx`**

Replace imports:
- `TopBar` → `AppBar` (from `@/components/top-bar`)
- `UndoRedoBar` → `Toolbar` (from `@/components/undo-redo-bar`)

Update JSX to use `<AppBar />` and `<Toolbar />`.

**Step 4: Verify**

Run: `npm run dev` — Desktop should now show:
- AppBar: title + save + push + export + wallet
- Toolbar: preset dropdown + undo/redo + light/dark toggle

**Step 5: Commit**

```bash
git add src/components/top-bar.tsx src/components/undo-redo-bar.tsx src/app/page.tsx
git commit -m "refactor: reorganize AppBar and Toolbar, group editing controls together"
```

---

## Phase 1B: Mobile Layout

### Task 5: Add hamburger menu to AppBar (mobile only)

On mobile (<md), the AppBar shows only a hamburger icon. On desktop (>=md), it shows the full bar as before.

**Files:**
- Modify: `src/components/top-bar.tsx`

**Step 1: Add responsive hamburger**

Import `DropdownMenu` components and `Menu` icon from lucide-react.

The AppBar render becomes:

```tsx
return (
  <div className="flex items-center justify-between h-14 border-b px-4 bg-background">
    {/* Desktop: full bar */}
    <span className="font-semibold hidden md:inline">ShadCN Theme Builder</span>

    {/* Mobile: hamburger */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>ShadCN Theme Builder</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Save — triggers the save popover */}
        <DropdownMenuItem onSelect={() => setSaveOpen(true)}>
          <Save className="size-4 mr-2" />
          Save Theme
        </DropdownMenuItem>
        {/* Push to cloud */}
        <DropdownMenuItem
          onSelect={handlePush}
          disabled={!isConnected || !hasUnpushedChanges || pushing}
        >
          <CloudUpload className="size-4 mr-2" />
          Push to Cloud
        </DropdownMenuItem>
        {/* Export — need to handle differently since ExportDialog has its own trigger */}
        <DropdownMenuItem onSelect={() => setExportOpen(true)}>
          <Download className="size-4 mr-2" />
          Export CSS
        </DropdownMenuItem>
        {/* Wallet */}
        <DropdownMenuItem onSelect={() => appKit.open()}>
          <Wallet className="size-4 mr-2" />
          {isConnected && address
            ? `${address.slice(0, 6)}…${address.slice(-4)}`
            : "Connect Wallet"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Desktop: action buttons (hidden on mobile, they're in hamburger) */}
    <div className="hidden md:flex items-center gap-2">
      {/* Save popover, push button, export dialog, wallet — same as current */}
    </div>
  </div>
);
```

**Note on ExportDialog:** The ExportDialog currently wraps its own DialogTrigger. For the hamburger menu, we need to control the dialog open state externally. Add an `open`/`onOpenChange` prop to ExportDialog, or add a `[exportOpen, setExportOpen]` state and pass it.

Modify `src/components/export-dialog.tsx` to accept optional `open`/`onOpenChange` props:

```tsx
interface ExportDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  // ...
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Only show trigger when not externally controlled */}
      {open === undefined && (
        <DialogTrigger asChild>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-3xl max-h-[80vh]">
        {/* ... unchanged ... */}
      </DialogContent>
    </Dialog>
  );
}
```

**Note on Save popover:** The save popover is currently a `Popover` that's rendered inline. For mobile, the hamburger DropdownMenuItem sets `setSaveOpen(true)` to open it. The Popover should still render (possibly as a Dialog on mobile, or as a positioned Popover). Simplest: keep the save Popover rendered in the DOM but position it differently on mobile — or switch to a Dialog on mobile. For Phase 1, keep the Popover and just open it from the hamburger; it will appear anchored to its trigger. Since the trigger is hidden on mobile, we may need to use a Dialog for save on mobile instead.

**Simpler approach for save on mobile:** Add a separate `Dialog`-based save form that's shown on mobile, controlled by `saveOpen` state. The hamburger menu item sets `setSaveOpen(true)`, which opens the Dialog.

**Step 2: Verify**

Run: `npm run dev` — resize browser below 768px:
- Should see hamburger icon only in AppBar
- Tapping hamburger shows dropdown with Save, Push, Export, Wallet
- Desktop (>768px) should be unchanged

**Step 3: Commit**

```bash
git add src/components/top-bar.tsx src/components/export-dialog.tsx
git commit -m "feat: add hamburger menu for mobile AppBar"
```

---

### Task 6: Extract ColorEditorContent for reuse

Extract the inner content of `ColorEditor` (search bar + scrollable sections) so it can be rendered in both the desktop sidebar and the mobile bottom sheet.

**Files:**
- Create: `src/components/color-editor-content.tsx`
- Modify: `src/components/color-editor.tsx`

**Step 1: Create `color-editor-content.tsx`**

Move the `CollapsibleSection` component and all the inner content (search + sections) into this file. The component receives no props — it uses `useTheme()` directly.

```tsx
"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { COLOR_GROUPS } from "@/lib/theme-types";
import { ColorRow } from "./color-row";
import { FontPicker } from "./font-picker";
import { ShadowControls } from "./shadow-controls";
import { useTheme } from "@/context/theme-context";

// CollapsibleSection — moved from color-editor.tsx
function CollapsibleSection({ title, defaultOpen = true, children }: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-muted/50 transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}

export function ColorEditorContent() {
  const { previewMode, radius, setRadius, spacing, setSpacing, letterSpacing, setLetterSpacing, hueShift, setHueShift, lightnessShift, setLightnessShift } = useTheme();
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const isSearching = q.length > 0;

  const filteredGroups = useMemo(() => {
    if (!isSearching) return COLOR_GROUPS;
    return COLOR_GROUPS
      .map((group) => ({
        ...group,
        variables: group.label.toLowerCase().includes(q)
          ? group.variables
          : group.variables.filter((v) => v.toLowerCase().includes(q)),
      }))
      .filter((group) => group.variables.length > 0 || group.label.toLowerCase().includes(q));
  }, [q, isSearching]);

  const sectionMatches = (title: string) => !isSearching || title.toLowerCase().includes(q);

  return (
    <>
      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* All the collapsible sections — identical to current color-editor.tsx */}
        {/* Color Shifts, Color groups, Fonts, Border Radius, Spacing, Shadows, Letter Spacing */}
        {/* ... exact same JSX as current color-editor.tsx lines 79–193 ... */}
      </div>
    </>
  );
}
```

**Step 2: Simplify `color-editor.tsx`**

```tsx
"use client";

import { ColorEditorContent } from "./color-editor-content";

export function ColorEditor() {
  return (
    <div className="w-96 flex-shrink-0 border-r flex flex-col overflow-hidden bg-background">
      <ColorEditorContent />
    </div>
  );
}
```

**Step 3: Verify**

Run: `npm run dev` — desktop color editor should work identically.

**Step 4: Commit**

```bash
git add src/components/color-editor-content.tsx src/components/color-editor.tsx
git commit -m "refactor: extract ColorEditorContent for desktop/mobile reuse"
```

---

### Task 7: Create mobile bottom sheet with editor

Build the bottom sheet using the Vaul-based Drawer component. It shows a persistent "Edit Theme" bar at the bottom, and slides up to 50% viewport height when opened.

**Files:**
- Create: `src/components/mobile-editor-sheet.tsx`

**Step 1: Create `mobile-editor-sheet.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Paintbrush, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { ColorEditorContent } from "./color-editor-content";

export function MobileEditorSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} snapPoints={[0.5]} modal={false}>
      {/* Persistent bottom bar — always visible */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-2 px-4 py-3 bg-background border-t md:hidden"
      >
        <div className="w-8 h-1 rounded-full bg-muted-foreground/30 mb-1" />
        <span className="sr-only">Edit Theme</span>
      </button>
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-2 px-4 py-3 bg-background border-t md:hidden">
        <Paintbrush className="size-4" />
        <span className="text-sm font-medium" onClick={() => setOpen(true)}>Edit Theme</span>
      </div>

      <DrawerContent className="max-h-[50vh] md:hidden">
        <DrawerHeader className="flex items-center justify-between px-4 py-2">
          <DrawerTitle className="text-sm font-semibold">Edit Theme</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <X className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col overflow-hidden flex-1">
          <ColorEditorContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
```

**Note:** The exact Drawer API may need adjustment based on the installed shadcn Drawer component. The `snapPoints` prop and `modal={false}` (so the preview stays interactive) are key. Test and adjust:
- If `modal={false}` doesn't work with Vaul, we may need to set it on the DrawerContent overlay instead.
- The persistent bottom bar might need to be separate from the Drawer trigger if the Drawer API doesn't support an always-visible trigger. In that case, use the `open` state to control both.

**Step 2: Verify**

Run: `npm run dev` — resize to mobile. Should see bottom bar. Won't be wired into the page yet (next task).

**Step 3: Commit**

```bash
git add src/components/mobile-editor-sheet.tsx
git commit -m "feat: create MobileEditorSheet with Vaul drawer"
```

---

### Task 8: Wire up mobile layout in page.tsx

Make the main page responsive: hide desktop ColorEditor on mobile, show MobileEditorSheet, hide SidebarRail.

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/color-editor.tsx`
- Modify: `src/components/preview/sidebar-rail.tsx`
- Modify: `src/components/preview/dashboard-preview.tsx`

**Step 1: Hide ColorEditor on mobile**

In `color-editor.tsx`, add `hidden md:flex` to the outer div:

```tsx
<div className="w-96 flex-shrink-0 border-r hidden md:flex flex-col overflow-hidden bg-background">
```

**Step 2: Hide SidebarRail on mobile**

In `dashboard-preview.tsx`, wrap SidebarRail with responsive class:

```tsx
<div className="flex flex-1 min-h-0 bg-background">
  <div className="hidden md:flex">
    <SidebarRail />
  </div>
  <div className="flex-1 overflow-y-auto">
    {/* ... */}
  </div>
</div>
```

Or modify `sidebar-rail.tsx` directly — add `hidden md:flex` to its outer div:

```tsx
<div
  className="flex-shrink-0 hidden md:flex flex-col items-center py-3 w-14"
  style={{ ... }}
>
```

**Step 3: Add MobileEditorSheet to page.tsx**

```tsx
import { MobileEditorSheet } from "@/components/mobile-editor-sheet";

// In the render, add after the main content div:
<div className="flex flex-col h-screen ...">
  <div className="flex-shrink-0">
    <AppBar />
  </div>
  <div className="flex flex-1 min-h-0">
    <ColorEditor />
    <div className="flex flex-col flex-1 min-h-0 min-w-0">
      <Toolbar />
      <DashboardPreview />
    </div>
  </div>
  {/* Mobile bottom sheet */}
  <MobileEditorSheet />
</div>
```

**Step 4: Add bottom padding on mobile for the persistent bar**

The preview needs bottom padding on mobile so content isn't hidden behind the fixed bottom bar. In `dashboard-preview.tsx`, add `pb-16 md:pb-0` to the scrollable content:

```tsx
<div className="w-full p-6 pb-16 md:pb-6 space-y-6">
```

**Step 5: Verify**

Run: `npm run dev`

Desktop (>768px):
- ColorEditor sidebar visible
- SidebarRail visible
- No bottom bar
- Toolbar has preset + undo/redo + light/dark

Mobile (<768px):
- No ColorEditor sidebar
- No SidebarRail
- Hamburger menu in AppBar
- Toolbar with preset + undo/redo + light/dark
- Full-width preview with masonry 1-col
- Bottom bar visible with "Edit Theme"
- Tapping bottom bar opens drawer at 50% with color editor content
- Preview still visible above the drawer

**Step 6: Commit**

```bash
git add src/app/page.tsx src/components/color-editor.tsx src/components/preview/sidebar-rail.tsx src/components/preview/dashboard-preview.tsx
git commit -m "feat: responsive mobile layout with bottom sheet editor"
```

---

### Task 9: Polish and edge cases

Final adjustments for a polished mobile experience.

**Files:**
- Possibly modify: multiple components for spacing/sizing tweaks

**Step 1: Toolbar responsive sizing**

The Toolbar may need tighter padding on mobile. Adjust:

```tsx
<div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 border-b bg-background/80 backdrop-blur-sm flex-shrink-0">
```

**Step 2: PresetDropdown responsive width**

The preset dropdown button has `min-w-36`. On mobile this might be too wide. Adjust:

```tsx
<Button variant="outline" className="min-w-28 md:min-w-36 justify-between text-sm">
```

**Step 3: Verify full flow on mobile**

Manually test:
1. Load page on mobile viewport (375px)
2. AppBar shows hamburger only
3. Toolbar shows preset + undo/redo + light/dark
4. Preview is full-width, scrollable
5. Bottom bar shows "Edit Theme"
6. Open drawer — color editor sections visible, scrollable
7. Change a color — preview updates live above the sheet
8. Close drawer — preview returns to full height
9. Open hamburger — save, push, export, wallet all work
10. Light/dark toggle works
11. Preset selection works
12. Undo/redo works

**Step 4: Verify desktop is unchanged**

1. Load page on desktop viewport (1280px)
2. AppBar shows title + save + push + export + wallet
3. Toolbar shows preset + undo/redo + light/dark
4. ColorEditor sidebar visible with all sections
5. SidebarRail visible
6. Preview masonry 4-column layout
7. All functionality works

**Step 5: Build check**

Run: `npm run build`
Expected: Clean build, no errors.

Run: `npm run lint`
Expected: No new warnings or errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "polish: responsive sizing and mobile edge cases"
```

---

## Summary of new/modified files

| File | Action |
|---|---|
| `src/components/ui/drawer.tsx` | Created (shadcn add) |
| `src/components/ui/dropdown-menu.tsx` | Created (shadcn add) |
| `src/components/preset-dropdown.tsx` | Created (extracted from top-bar) |
| `src/components/light-dark-toggle.tsx` | Created (extracted from top-bar) |
| `src/components/color-editor-content.tsx` | Created (extracted from color-editor) |
| `src/components/mobile-editor-sheet.tsx` | Created (new) |
| `src/components/top-bar.tsx` | Modified (→ AppBar, hamburger menu) |
| `src/components/undo-redo-bar.tsx` | Modified (→ Toolbar, added preset/toggle) |
| `src/components/color-editor.tsx` | Modified (simplified, hidden on mobile) |
| `src/components/export-dialog.tsx` | Modified (controlled open prop) |
| `src/components/preview/sidebar-rail.tsx` | Modified (hidden on mobile) |
| `src/components/preview/dashboard-preview.tsx` | Modified (bottom padding) |
| `src/app/page.tsx` | Modified (new imports, MobileEditorSheet) |
