# Save Custom Themes Design

**Date:** 2026-02-03
**Status:** Approved

## Summary

Save and load custom themes to localStorage, integrated into the existing preset dropdown.

## Storage

- Key: `shadcn-theme-builder-saved` in localStorage
- Value: JSON array of `ThemeConfig` objects (same shape as built-in presets)
- `name` field is a slugified version of the user's name, `label` is the display name

## UI

- **Save button:** Floppy disk icon button in the top bar, next to the preset dropdown
- **Save popover:** Text input for theme name + "Save" button. If name matches existing saved theme, confirm before overwriting.
- **Preset dropdown:** Extended with a divider, "My Themes" label, and saved theme items below built-in presets. Each saved theme has the name on the left, trash icon on the right. "My Themes" section hidden when no saved themes exist.
- **Load:** Clicking a saved theme name loads it like a built-in preset
- **Delete:** Trash icon removes from localStorage, no confirmation

## Hook: useSavedThemes

- Reads localStorage on mount, keeps React state in sync
- `save(name, themeConfig)` — add or overwrite
- `remove(name)` — delete
- `savedThemes` — current list as ThemeConfig[]

## Files to change

1. `src/hooks/use-saved-themes.ts` — new hook for localStorage CRUD
2. `src/components/top-bar.tsx` — add save icon button + popover, extend preset dropdown with saved themes section
3. `src/context/theme-context.tsx` — extend `loadPreset` to accept a `ThemeConfig` directly (or add `loadThemeConfig`)
