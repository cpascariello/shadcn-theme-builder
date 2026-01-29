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
