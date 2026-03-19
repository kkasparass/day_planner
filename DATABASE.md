# Database Schema

Local SQLite database (`test.db`). Schema version: 13.

WAL journal mode and foreign keys are enabled.

---

## Tables

### `todao_timeline`

One row per calendar day. Acts as the container for all daily todos.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | INTEGER PK | — | |
| `date` | TEXT | — | Calendar date for this day |
| `energyCap` | INTEGER | 0 | Daily energy budget (sum of effort points allowed) |

---

### `daily_todos`

Individual tasks belonging to a specific day.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | INTEGER PK | — | |
| `label` | TEXT | — | Task description |
| `completed` | BOOLEAN | 0 | Whether the task is done |
| `timelineId` | INTEGER FK | — | → `todao_timeline.id` |
| `catId` | INTEGER | NULL | Optional link → `planning_categories.id` (set when task was added from planner) |
| `effort` | INTEGER | 0 | Effort points this task costs |
| `itemOrder` | INTEGER | 0 | Display order within the day |

**Trigger — `set_order_value`:** Fires `AFTER INSERT`. When a new todo is inserted with `itemOrder = 0`, automatically sets its `itemOrder` to `MAX(itemOrder) + 1` within the same `timelineId`. This means new todos always go to the bottom of the list.

---

### `planning_categories`

Hierarchical planner items — recurring activities, projects, hobbies, etc. Self-referential tree structure with unlimited nesting depth.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | INTEGER PK | — | |
| `label` | TEXT | — | Display name |
| `completed` | BOOLEAN | 0 | Completion state |
| `parent` | INTEGER FK | NULL | → `planning_categories.id` (NULL = root item) |
| `tag` | TEXT | NULL | Groups items into tabs on the Planner page |
| `parentLabel` | TEXT | NULL | Denormalized copy of parent's label (for display) |
| `lastDone` | TEXT | NULL | ISO date string of when item was last completed |
| `repeatFreq` | INTEGER | 0 | Days between repeats (0 = no repeat). Note: declared as BOOLEAN in schema but used as an integer. |
| `effort` | INTEGER | 0 | Default effort points when added as a todo |

---

### `routines`

Named collections of tasks that can be bulk-added to a day.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | INTEGER PK | — | |
| `title` | TEXT | — | Routine name |

---

### `routine_items`

Individual tasks within a routine template.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | INTEGER PK | — | |
| `label` | TEXT | — | Task description |
| `routineId` | INTEGER FK | — | → `routines.id` |
| `catId` | INTEGER | NULL | Optional link → `planning_categories.id` |
| `effort` | INTEGER | 0 | Effort points for this task |

---

### `user_settings`

Single-row table for app-wide user preferences. Seeded with one row on creation.

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | INTEGER PK | — | Always 1 |
| `initialEffort` | INTEGER | 24 | Default `energyCap` applied to new timeline days |

---

## Relationships

```
user_settings (singleton)

todao_timeline
  └── daily_todos (timelineId)
        └── planning_categories (catId, optional)

planning_categories (self-referential tree via parent)

routines
  └── routine_items (routineId)
        └── planning_categories (catId, optional)
```
