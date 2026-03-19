# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server
npm start

# Run on Android (emulator or device)
npm run android

# Run on iOS
npm run ios

# Run tests
npm test

# Run a single test file
npx jest path/to/test.test.ts

# Lint
npm run lint

# EAS builds (Android)
npm run build:dev      # development build
npm run build:preview  # preview build
```

## Architecture

React Native (Expo) mobile app — fully offline, no backend. All data is stored in a local SQLite database (`test.db`).

### Data Flow

```
React Components
    ↓
Custom Hooks (hooks/, components/**/use*.ts)
    ↓
useSQLiteContext() — direct SQL queries
    ↓
Local SQLite Database
```

Redux Toolkit is used **only** as a reload-signal mechanism — slices hold boolean/counter flags to tell components to re-fetch from SQLite. There is no API layer.

### Navigation

Expo Router file-based routing:
- `app/_layout.tsx` — root layout; wraps everything in Redux Provider, SQLite Provider, React Navigation theme, and React Native Paper
- `app/(tabs)/` — four tab pages: Todos (`index.tsx`), Planner, Routines, Settings
- `app/planner/edit/[id].tsx` — dynamic route for editing a planner item

### Key Domain Concepts

- **Timeline (`todao_timeline`)** — one row per calendar day; holds an `energyCap` (daily energy budget)
- **Daily Todos (`daily_todos`)** — tasks for a specific day; linked to a timeline row via `timelineId`; have `effort` points and `itemOrder` for drag-to-reorder
- **Planning Categories (`planning_categories`)** — hierarchical items (self-referential `parent` FK); used for recurring activities/projects; support `tag`, `repeatFreq` (days between repeats), and `lastDone`
- **Routines / Routine Items** — named task templates that can be bulk-added to a day's todo list

### Database

Full schema documentation is in `DATABASE.md`.

Migrations live in `migrations/` as numbered files (0–12, current schema version 13). Migration logic runs in `app/_layout.tsx` on app start, keyed by the `user_version` pragma.

### State Management

- `store/slices/todaoTimelineListSlice.ts` — `reloadDB` counter; incrementing it causes timeline hooks to re-fetch
- `store/slices/todaosSlice.ts` — per-todo reload flags

### Path Aliases

`@/*` maps to the repo root (configured in `tsconfig.json`). Use `@/components/...`, `@/hooks/...`, etc. for imports.

### UI

- **React Native Paper** for all UI primitives and theming
- **react-native-draggable-flatlist** for drag-to-reorder todo lists
- **react-native-reanimated** for animations (requires Babel plugin — already configured)
- Colors defined in `constants/Colors.ts` (light/dark + semantic status colors)
- Tag-filtered planner tabs use `components/SwipeTabs/`
