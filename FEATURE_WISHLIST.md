# Feature Wishlist

Potential improvements unlocked by the SDK 53 / React 19 / RN 0.79 upgrade.

---

## 1. Replace Redux Reload Signals with `useLiveQuery`

**Package:** `expo-sqlite` v15 (already installed)

**What:** `useLiveQuery` is a reactive query hook — it re-runs the query and re-renders the component automatically whenever the underlying SQLite table changes. No manual reload signals needed.

**Current pattern:**

```ts
// Increment a counter in Redux to tell hooks to re-fetch
dispatch(incrementReloadDB());

// Hook watches the counter
const reloadDB = useSelector((state) => state.counter.reloadDB);
useEffect(() => {
  fetchFromDB();
}, [reloadDB]);
```

**Target pattern:**

```ts
const { data } = useLiveQuery(
  db.prepareSync("SELECT * FROM daily_todos WHERE timelineId = ?", [
    timelineId,
  ]),
);
```

**Impact:** Remove `todaoTimelineListSlice`, `todaosSlice`, Redux Provider wrapper, and all `dispatch(increment*)` calls. Significant simplification of data flow.

**Risk:** Medium — touches every hook that currently uses the reload-signal pattern. Migrate one hook at a time to de-risk.

---

## 2. Typed Routes in Expo Router

**Package:** `expo-router` v5 (already installed)

**What:** Compile-time type checking for all `href` props and `router.push()` calls. Typos in route paths become TypeScript errors instead of runtime crashes.

**How to enable:** One config change in `app.json`:

```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

Then run `npx expo customize tsconfig.json` to pick up the generated `.expo/types/` definitions.

**Impact:** Low-effort, zero runtime cost. Catches broken routes (e.g., `/planner/edit/[id]` param mismatches) at build time.

**Risk:** Low — additive only. May surface existing latent type errors on `href` props that need fixing.

---

## 3. `useOptimistic` for Todo Complete / Delete

**Package:** React 19 (already installed)

**What:** `useOptimistic` lets you show an immediate UI state while an async operation (DB write) is in-flight, then reconcile when it completes. If the write fails, React automatically rolls back to the previous state.

**Target pattern:**

```ts
const [optimisticTodos, addOptimistic] = useOptimistic(
  todos,
  (state, updatedId) => state.map(t => t.id === updatedId ? { ...t, completed: true } : t)
);

function handleComplete(id: number) {
  addOptimistic(id);          // instant UI update
  db.runSync(...);            // actual DB write
}
```

**Impact:** Checkbox and delete feel instant instead of waiting for SQLite write + reload cycle. Especially noticeable on slower devices.

**Risk:** Low — self-contained per component. Can be added incrementally to individual todo item components without touching shared hooks.
