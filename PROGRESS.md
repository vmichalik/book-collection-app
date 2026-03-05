# Book Collection App — Build Progress

## Overview

A mobile-first luxury book collection app rebuilt from a basic page-routed React app into a **dark-themed video game inventory** with 3D books, tray-based navigation, Claude Vision AI recognition, and a collector progression system.

**Live**: https://vmichalik.github.io/book-collection-app/

---

## Architecture

Single-screen layout — no page routing. The grid stays mounted at all times, with bottom-sheet trays overlaying for all interactions.

```
App (LayoutGroup)
├── Header (collector level, XP bar, item count)
├── BookGrid
│   └── BookGridItem (3D book in inventory slot w/ rarity glow)
├── TabBar (Inventory / + / Stats)
├── TrayPortal (AnimatePresence)
│   ├── TrayBackdrop
│   └── Tray (slides up, swipe-to-dismiss)
│       ├── BookDetailTray (85vh — 3D book, rarity badge, lore)
│       ├── AddBookTray (70vh — 3-step: photo → AI analyze → form)
│       └── SettingsTray/Stats (60vh — collector card, genre breakdown)
└── ConfettiCanvas (milestone celebrations)
```

---

## File Structure

```
src/
  types/book.ts              — Book interface (favorited, genre fields)
  lib/
    utils.ts                 — cn() class merge utility
    animations.ts            — Easing curves, spring configs, variants
    ai-service.ts            — Claude Vision API integration (Haiku)
    confetti.ts              — Canvas confetti particle system (~60 lines)
    milestones.ts            — 5/10/25/50/100 book milestone messages
    rarity.ts                — Genre → rarity color/label mapping
    collector.ts             — XP/Level system (LV.1 Novice → LV.9 Legend)
  hooks/
    useBooks.ts              — Book CRUD, localStorage, toggleFavorite, milestones
    useTray.ts               — Tray state machine (detail/add/settings/null)
    useSwipeDown.ts          — Touch swipe-to-dismiss gesture
    useSettings.ts           — API key + haptics prefs (localStorage)
  components/
    ui/button.tsx            — Minimal button component
    ui/skeleton.tsx          — Shimmer loading skeleton
    ui/input.tsx             — Styled input
    tray/Tray.tsx            — Core bottom sheet (swipe dismiss, esc key)
    tray/TrayBackdrop.tsx    — Dark overlay behind tray
    tray/TrayHeader.tsx      — Drag indicator, title, back/close buttons
    book/Book3D.tsx          — Full 3D CSS book (drag-to-rotate, 6 faces)
    book/BookCoverImage.tsx  — Flat cover image with shimmer loading
    book/BookGridItem.tsx    — Inventory slot: 3D book + rarity tag + glow
    book/BookGrid.tsx        — Responsive grid with search
    book/HeartReaction.tsx   — Animated heart on double-tap
    book/FavoriteBadge.tsx   — Heart badge on favorited books
    features/BookDetailTray.tsx  — Book detail: 3D view, rarity, lore, actions
    features/AddBookTray.tsx     — 3-step add: photo → AI → form
    features/SettingsTray.tsx    — Stats: collector level, genre breakdown, API key
    layout/Header.tsx        — Level badge, XP bar, item count
    layout/TabBar.tsx        — Inventory / + / Stats with animated indicator
    animations/TextMorph.tsx   — Character-level text transitions
    animations/NumberRoll.tsx  — Rolling digit counter
    animations/ConfettiCanvas.tsx — Milestone celebration overlay
  App.tsx                    — Root: single-screen + tray orchestration
  index.css                  — Dark theme, inventory slots, shimmer, XP bar
  main.tsx                   — React entry point
```

---

## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Framer Motion 12** — animations, layout transitions, gestures
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin, CSS `@theme` config
- **Vite 7** — build tooling
- **Lucide React** — icons
- **Claude Vision API** — book recognition from cover photos (Haiku model)

---

## Design System

### Theme (Dark Inventory)

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0c0c0e` | Page background |
| `foreground` | `#e8e8ec` | Primary text |
| `muted` | `#1a1a1f` | Card/slot backgrounds |
| `muted-foreground` | `#6b6b78` | Secondary text |
| `border` | `#26262e` | Borders, dividers |
| `accent` | `#ff4d00` | Orange — XP bar, active states, CTA |
| `destructive` | `#ef4444` | Delete/discard actions |
| `surface` | `#111114` | Elevated surfaces |
| `card` | `#141418` | Tray backgrounds |

### Typography

- **Body**: Inter (300–700)
- **Labels/Mono**: JetBrains Mono (400–500)
- **Pattern**: Mono uppercase tracking-widest for section labels, sans for content

### Rarity System

| Rarity | Color | Genres |
|--------|-------|--------|
| Legendary | `#fbbf24` (gold) | Classic |
| Epic | `#a855f7` (purple) | Dystopian, Sci-Fi, Fantasy, Horror |
| Rare | `#3b82f6` (blue) | Mystery, Thriller, Romance, Biography |
| Uncommon | `#22c55e` (green) | Non-Fiction, Adventure, Coming of Age |
| Common | `#6b7280` (gray) | Fiction, uncategorized |

### Collector Levels

| Level | Title | Books Needed |
|-------|-------|-------------|
| 1 | Novice | 0 |
| 2 | Reader | 3 |
| 3 | Bookworm | 5 |
| 4 | Scholar | 10 |
| 5 | Librarian | 15 |
| 6 | Curator | 25 |
| 7 | Archivist | 40 |
| 8 | Sage | 60 |
| 9 | Legend | 100 |

---

## Key Interactions

- **Double-tap** any book in the grid → heart reaction animation + toggle favorite + haptic vibrate
- **Swipe down** on any tray → dismiss with physics-based motion
- **Hover** on inventory slot → rarity-colored border glow
- **Drag** the 3D book in detail view → rotate freely with pointer
- **Milestone** at 5/10/25/50/100 books → canvas confetti + toast message
- **AI photo** → upload cover photo → Claude Haiku extracts title/author/genre/description → pre-fills form

---

## Build History

### Commit 1: Full Rebuild
- Replaced page routing with single-screen tray architecture
- Built all 30+ component files from scratch
- Implemented tray system, 3D books, double-tap hearts, confetti milestones
- Added Claude Vision AI book recognition

### Commit 2: Fix Tailwind + Redesign
- **Critical fix**: Tailwind v4 was installed but v3 syntax was used — zero utilities were generated
- Switched to `@tailwindcss/vite` plugin + CSS `@theme` config
- Redesigned all components with minimal industrial aesthetic (Inter + JetBrains Mono)
- Removed broken `layoutId` shared element causing covers to fly off-screen

### Commit 3: Dark Inventory Theme
- Switched to dark matte black theme
- Replaced flat grid covers with 3D books in inventory slots
- Added genre-based rarity system with colored glow on hover
- Added collector XP/Level progression bar in header
- Stats panel with genre breakdown and collection metrics
- Fixed all 6 sample book cover URLs to show correct books
- Game-flavored language (Inventory, Acquired, Lore, Discard)

---

## What's Next (Ideas)

- [ ] Achievement/badge system ("Genre Explorer", "First Shelf", "Centurion")
- [ ] Sort/filter by rarity, genre, date, favorites
- [ ] Animated book acquisition sequence (book drops in, slot lights up)
- [ ] Sound effects (optional, toggle in settings)
- [ ] Collection export/import (JSON)
- [ ] PWA support for mobile home screen
- [ ] Book rating system (1–5 stars)
- [ ] Reading status tracking (unread/reading/finished)
