# shadcn Theme Builder

> **[themer.stasho.xyz](https://themer.stasho.xyz)**

Visual theme builder for [shadcn/ui](https://ui.shadcn.com) — hosted on [Aleph Cloud](https://aleph.im), with theme storage powered by Aleph aggregate messages.

## Aleph Cloud Integration

This app is a showcase for [Aleph Cloud](https://aleph.im) infrastructure:

- **Hosting** — Static site deployed on Aleph Cloud's decentralized network
- **Storage** — Custom themes are stored as [Aleph aggregate messages](https://docs.aleph.im/devhub/guides/update/), keyed to the user's wallet address. No backend, no database — just on-chain key-value storage
- **Authentication** — Wallet-based via [Reown AppKit](https://reown.com) supporting Ethereum and Solana. Reads are free, writes require a wallet signature

Themes are stored under the aggregate key `shadcn-theme-builder-themes` on the `shadcn-theme-builder` channel. Each push writes a `{ themes: ThemeConfig[] }` snapshot to the user's aggregate.

## Features

- **Color editing** — Light/dark mode with OKLCH color picker, organized in semantic groups (Backgrounds, Text, Accents, Borders, Charts, Sidebar)
- **Color shifts** — Hue and lightness sliders to explore palette variations without editing individual tokens
- **Font selection** — Google Fonts for sans, serif, and mono with dynamic loading
- **Shadow controls** — Presets (none/subtle/medium/strong/brutalist) plus fine-tuning sliders, per-mode shadow colors
- **Border radius** — Slider control (0–3rem)
- **Spacing** — Global spacing slider controlling Tailwind CSS 4's `--spacing` base unit
- **Letter spacing** — Slider control (-1 to 1em)
- **Presets** — Bubblegum, Aleph Cloud, Retro, Default, Warm, Cool, Green, High Contrast
- **Save themes** — Save custom themes to localStorage, load and delete from the preset dropdown
- **Cloud sync** — Push themes to Aleph Cloud via wallet, auto-pull on connect, delete cloud themes
- **Live preview** — Dashboard with 20 components in masonry layout plus sidebar icon rail
- **Undo/redo** — Debounced history stack with keyboard shortcuts (Cmd/Ctrl+Z)
- **Search** — Filter tokens and sections by name
- **Export** — Full `globals.css` with colors, fonts, radius, spacing, letter spacing, shadow tiers, and sidebar colors

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Aleph Cloud](https://aleph.im) — Decentralized hosting and aggregate storage
- [Reown AppKit](https://reown.com) — Wallet connection (Ethereum + Solana)
- [Aleph SDK](https://github.com/aleph-im/aleph-sdk-ts) — Read/write aggregate messages
- [Recharts](https://recharts.org) — Chart previews

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
```

Get a project ID from [Reown Cloud](https://cloud.reown.com). Required for wallet connection and cloud sync features.

## Scripts

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # ESLint
```

## License

MIT
