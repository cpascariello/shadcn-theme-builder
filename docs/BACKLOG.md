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

### 2026-01-29 - Export dialog: include fonts and shadows
**Source:** Identified during Bubblegum theme implementation
**Description:** Update the export dialog to include:
- Font `<link>` instructions for Google Fonts in the exported CSS
- Shadow CSS variables (--shadow, --shadow-sm, etc.) in the output
- Currently export only outputs colors + radius
**Priority:** Medium

### 2026-01-29 - Shadow color picker: hex to OKLCH conversion
**Source:** Identified during shadow controls testing
**Description:** When user picks a color via the native color picker, it stores hex. Could convert to OKLCH for consistency with the rest of the theme. Currently works but mixes formats.
**Priority:** Low

### 2026-01-29 - Sidebar colors in theme
**Source:** Original Bubblegum CSS included sidebar variables
**Description:** Add sidebar color controls (sidebar, sidebar-foreground, sidebar-primary, etc.) to the color editor. Currently these are in globals.css but not editable in the UI.
**Priority:** Low

---

## Completed / Rejected

<details>
<summary>Archived items</summary>

<!-- Move completed/rejected items here -->

</details>
