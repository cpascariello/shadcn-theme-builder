# Spacing Slider Design

**Date:** 2026-02-03
**Status:** Approved

## Summary

Add a global spacing slider that controls Tailwind CSS 4's `--spacing` variable, scaling all component padding, margins, and gaps uniformly.

## Mechanism

Tailwind CSS 4 derives all spacing utilities from `--spacing` (default `0.25rem`). `p-4` = `4 * --spacing`. Changing this one variable rescales all spacing without affecting font sizes.

## UI

- Single slider labeled "Spacing" next to the existing Border Radius slider in the sidebar
- Range: `0.15rem` to `0.4rem`, step `0.01rem`, default `0.25rem`
- Displays current value in rem

## Integration

- **Theme state:** Add `spacing: number` to theme state (stored as rem value)
- **CSS injection:** Add `--spacing` to `buildCssVariables()` and `buildGlobalCssOverride()`
- **Presets:** Each preset stores a `spacing` value (most use `0.25` default)
- **Undo/redo:** Include `spacing` in `ThemeSnapshot`
- **Export:** Include `--spacing` in generated CSS output

## Files to change

1. `src/lib/theme-types.ts` — add `spacing` to type definitions
2. `src/lib/presets.ts` — add `spacing` to each preset
3. `src/context/theme-context.tsx` — add state, setter, snapshot support
4. `src/components/color-editor.tsx` — add slider next to border radius
5. `src/app/page.tsx` — add `--spacing` to CSS variable builders
6. `src/components/export-dialog.tsx` — include in CSS output
