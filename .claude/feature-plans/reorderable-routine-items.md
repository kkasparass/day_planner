# Plan: Reorderable Routine Items

## Context

Routine items within each routine block on the Routines page are currently rendered in static insertion order (by `id ASC`). The daily todos already support drag-to-reorder via `react-native-draggable-flatlist`, persisted with an `itemOrder` column and a SQL shift-and-set algorithm. This feature mirrors that pattern for routine items.

**User scenario that defined requirements:** A user has a "Daily Exercise" routine (jog, swim, shower) and a "Work" routine (daily standup, focus developing, debrief meeting). If they reorder exercise to `swim, jog, shower` and work to `focus developing, daily standup, debrief meeting`, then adding both routines to a daily todo list should produce `swim, jog, shower, focus developing, daily standup, debrief meeting` — routine item order must carry through to the todo list.

**Pre-existing bug surfaced:** `onMergeIntoTimelineItem` in `useRoutine.ts` uses `filteredRoutineItems.forEach(async ...)` which fires all DB inserts concurrently — order is not guaranteed. Changed to `for...of` with `await`. Similarly, `onRoutineSelect` in `useTimelineItem.ts` was missing `ORDER BY` on its INSERT SELECT.

**Why `NestableDraggableFlatList` over `DraggableFlatList`:** Each routine block sits inside a scrollable page container. `NestableDraggableFlatList` + `NestableScrollContainer` is the library's supported pattern for nested scroll + drag contexts — the Todos page already uses this same setup.

**Schema version:** 13 → 14 (migration 13 adds `itemOrder` to `routine_items`).

---

## Changes Required

### 1. Migration: `migrations/13_add_order_to_routine_items.ts` (new file)

Add `itemOrder INTEGER DEFAULT 0` to `routine_items`, backfill existing rows with sequential values scoped by `routineId`, and create an AFTER INSERT trigger to auto-assign new items.

Mirrors `migrations/12_add_order_to_day_todos.ts` exactly, substituting:
- `daily_todos` → `routine_items`
- `timelineId` → `routineId`
- trigger name `set_order_value` → `set_routine_item_order_value`

### 2. `migrations/migrateDbIfNeeded.ts`

Register the new migration (increment max schema version from 13 → 14, add case for migration 13).

### 3. `types/types.ts`

Add `itemOrder: number` to the `RoutineItem` type.

### 4. `components/Routines/Routine/useRoutine.ts`

- Update the SELECT query from `ORDER BY id ASC` → `ORDER BY itemOrder ASC`
- Add `updateRoutineItemOrder(data, from, to)` — same shift-and-set SQL algorithm as `updateUndoneTodoOrder` in `useTimelineItem.tsx`, using `routine_items`/`routineId`/`itemOrder`
- Return `updateRoutineItemOrder` from the hook
- Fix `onMergeIntoTimelineItem`: change `filteredRoutineItems.forEach(async ...)` (concurrent, unordered) to a `for...of` loop with `await` so inserts happen sequentially in `itemOrder` sequence — the auto-increment trigger then assigns daily todo `itemOrder` values matching the routine's order

### 5. `components/Routines/Routine/Routine.tsx`

- Import `NestableDraggableFlatList` and `ScaleDecorator` from `react-native-draggable-flatlist`
- Replace `routineItems.map(...)` with `NestableDraggableFlatList` — same structure as `TimelineItem.tsx`'s undone todos list
- Pass `drag` and `isActive` into each `RoutineItem` via `renderItem`

### 6. `components/Routines/RoutineItem/RoutineItem.tsx`

- Add `drag: () => void` and `isActive: boolean` props
- Add a long-press drag handle (same `reorder-four-outline` Ionicons icon + `TouchableRipple` as `Task.tsx`)

### 7. `components/TodaoTimeline/TimelineItem/useTimelineItem.tsx`

- Fix `onRoutineSelect`: add `ORDER BY itemOrder ASC` to the INSERT SELECT so rows are inserted in routine item order — the trigger then assigns sequential `itemOrder` values to the new daily todos matching the routine's display order

### 8. `app/(tabs)/RoutinesPage.tsx`

- Import `NestableScrollContainer` from `react-native-draggable-flatlist`
- Replace `<FlatList data={routines} ... />` with `<NestableScrollContainer>` + `{routines.map(...)}` — same pattern as `index.tsx` (Todos page)

---

## Critical Files

| File | Change |
|------|--------|
| `migrations/13_add_order_to_routine_items.ts` | New migration |
| `migrations/migrateDbIfNeeded.ts` | Register migration 13, bump version to 14 |
| `types/types.ts` | Add `itemOrder` to `RoutineItem` |
| `components/Routines/Routine/useRoutine.ts` | Add reorder function, update query, fix concurrent inserts |
| `components/TodaoTimeline/TimelineItem/useTimelineItem.tsx` | Add ORDER BY to INSERT SELECT in onRoutineSelect |
| `components/Routines/Routine/Routine.tsx` | Swap map → NestableDraggableFlatList |
| `components/Routines/RoutineItem/RoutineItem.tsx` | Add drag handle |
| `app/(tabs)/RoutinesPage.tsx` | Swap FlatList → NestableScrollContainer + map |

---

## Patterns to Reuse

- **SQL reorder algorithm**: `useTimelineItem.tsx:33–95` — copy verbatim, change table/column names
- **Draggable list structure**: `TimelineItem.tsx:70–94` — `NestableDraggableFlatList` + `ScaleDecorator` pattern
- **Drag handle UI**: `Task.tsx:50–53` — `TouchableRipple` + `onLongPress={drag}` + `reorder-four-outline` icon
- **Migration structure**: `migrations/12_add_order_to_day_todos.ts` — mirror for routine_items
- **Outer scroll container**: `app/(tabs)/index.tsx:26–30` — `NestableScrollContainer` + `.map()`

---

## Verification

1. Run `npm start` and navigate to Routines tab
2. Long-press the drag handle on a routine item — it should lift with scale animation
3. Drag to a new position and release — item should settle in new position
4. Restart the app — order should persist (confirmed by re-fetch from SQLite)
5. Add a new item to a routine — it should appear at the end (trigger assigns max+1)
6. Run `npm test` — existing tests should remain green
