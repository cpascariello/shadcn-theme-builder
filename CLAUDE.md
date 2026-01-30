# Working Habits

Persistent habits for maintaining project memory across sessions.

---

## Quick Start

**Sync up:** Say "sync up" or "catch me up" to restore context at session start.

---

## Three Habits

### 1. Decision Logging

Log decisions to `docs/DECISIONS.md` when these phrases appear:
- "decided" / "let's go with" / "rejected"
- "choosing X because" / "not doing X because"
- "actually, let's" / "changed my mind"

Before proposing anything, check if it contradicts a past decision. If conflict found:
> This would contradict Decision #N (summary). Override?

**Format:**
```
## Decision #[N] - [Date]
**Context:** [What we were working on]
**Decision:** [What was decided]
**Rationale:** [Why - this is the important part]
**Alternatives considered:** [If any were discussed]
```

### 2. Scope Drift Detection

**This is an active interrupt, not a passive log.**

When the conversation drifts from the stated task:
1. Stop and say: "This is drifting from [original task]. Add to backlog and refocus, or pivot?"
2. If backlog: log to `docs/BACKLOG.md` and return to the original task
3. If pivot: continue, but note the scope change

**Triggers to watch for:**
- "Would it be useful to add X?" (when X wasn't part of original request)
- "We could also do Y" (when Y is unrelated to core ask)
- "While we're at it, let's add Z"
- Any work that extends beyond what was asked

**Do NOT flag** clarifying questions about the core feature or technical approaches to achieve the original goal.

**Backlog format:**
```
### [Date] - [Short title]
**Source:** Identified while working on [context]
**Description:** [What needs to be done]
**Priority:** Low/Medium/High
```

### 3. Git Discipline

**Branching:**
- Brainstorm and plan on main
- When dev starts, create feature branch from main before any file edits
- Branch naming: `feature/[plan-name]`

**Before merging:** Update docs before squash merging to main.
- `docs/ARCHITECTURE.md` — add/update patterns for any new architectural decisions, new files, or changed structure
- `CLAUDE.md` — update the Current Features list if user-facing behavior changed
- `docs/DECISIONS.md` — log any key decisions made during the feature
- `docs/BACKLOG.md` — add any deferred ideas or scope drift items noted during development

**During development:** Track intent, not metrics.

- **Scope drift:** "This started as [X] but now includes [Y]. Commit [X] first?"
- **Feature complete:** When user says "done" or "that's it" → squash merge to main
- **Pre-break:** When user says "break", "later", "tomorrow" → "Push before you go?"

**Completion:** Squash merge keeps main history clean (one commit per feature).

Never interrupt based on file count or commit count.

---

## Context Recovery

On "sync up" or "catch me up":

1. Read `docs/DECISIONS.md`, `docs/BACKLOG.md`, `docs/ARCHITECTURE.md`
2. Check git status (branch, uncommitted changes, unpushed commits)
3. Check recent git log for context
4. Summarize:
   - Last decision logged
   - Open backlog items
   - Any blockers
   - Git status
5. State readiness

---

## Docs

| File | Purpose |
|------|---------|
| `docs/DECISIONS.md` | Decision log with rationale |
| `docs/BACKLOG.md` | Parking lot for scope creep and deferred ideas |
| `docs/ARCHITECTURE.md` | Technical patterns and component structure |
| `docs/plans/` | Design and implementation plans (read-only reference) |

---

## Skill Integration

Skills (superpowers) are tools, not separate processes. Use them naturally:

- **Brainstorming:** Use for non-trivial design work. Flag scope creep during brainstorming.
- **Planning:** Use `writing-plans` or `EnterPlanMode` for multi-file changes, new features, unclear requirements.
- **Implementation:** Use `subagent-driven-development` or `executing-plans` for complex implementations.
- **Post-implementation:** Run build/lint verification, handle git workflow, update ARCHITECTURE.md if new patterns emerged.
- **Post-push:** Log any key decisions to DECISIONS.md.

---

## Project: shadcn Theme Builder

Visual theme builder for shadcn/ui components with real-time preview.

### Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4, shadcn/ui components (Radix UI)
- **State:** React Context API
- **Colors:** OKLCH color space
- **Charts:** Recharts

### Commands

```bash
npm run dev     # Start dev server at localhost:3000
npm run build   # Production build
npm run lint    # ESLint
```

### Key Directories

```
src/
├── app/              # Next.js app router (page.tsx, layout.tsx, globals.css)
├── components/       # React components
│   ├── ui/           # shadcn/ui base components
│   └── preview/      # Dashboard preview components
├── context/          # Theme context (state management)
└── lib/              # Utilities, types, presets
```

### Current Features

- **Color editing:** Light/dark mode with OKLCH color picker, semantic groups (Backgrounds, Text, Accents, Borders, Charts, Sidebar)
- **Font selection:** Google Fonts (sans/serif/mono) with dynamic loading
- **Shadow controls:** Presets (none/subtle/medium/strong/brutalist) + fine-tuning sliders, per-mode colors (light/dark each have their own shadow color)
- **Border radius:** Slider control (0–3rem, 0.125 steps)
- **Letter spacing:** Slider control (-1 to 1em, 0.01 steps)
- **Search:** Filter tokens and sections by name
- **Presets:** Bubblegum (default), Aleph Cloud, Retro, Default, Warm, Cool, Green, High Contrast — all include sidebar colors
- **Live preview:** Dashboard with 20 components in masonry layout, shadow tiers applied via CSS variables
- **Undo/redo:** Debounced history stack (max 50), toolbar buttons + Cmd/Ctrl+Z keyboard shortcuts, preset loads reset history
- **Export:** Full globals.css with colors, fonts, radius, letter spacing, shadow tiers (--shadow-2xs through --shadow-2xl), sidebar colors, and @theme inline block
