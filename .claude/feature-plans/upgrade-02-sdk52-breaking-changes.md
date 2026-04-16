# Task 2: SDK 52 Breaking Changes

## Context

After package bumps in Task 1, address known breaking changes before testing. SDK 52 ships React Native 0.76 with New Architecture enabled by default. expo-router bumps from v3 to v4.

**Branch:** `upgrade/sdk-52` (continue from Task 1)

---

## Breaking Changes to Audit & Fix

### 1. `reanimated-bottom-sheet` (HIGH RISK)
- Package is `^1.0.0-alpha.22` — ancient unmaintained alpha
- Search for usage:
  ```bash
  grep -r "reanimated-bottom-sheet" --include="*.ts" --include="*.tsx" .
  ```
- If used: replace with `@gorhom/bottom-sheet` (the maintained successor)
  - API is similar but not identical — check prop names
- If unused: remove from `package.json`

### 2. expo-router v3 → v4
- Typed routes behavior may change
- Check all `href` usages and the dynamic route `app/planner/edit/[id].tsx`
- Review expo-router v4 changelog for any layout/navigation API changes
- Key files:
  - `app/_layout.tsx`
  - `app/(tabs)/`
  - `app/planner/edit/[id].tsx`

### 3. New Architecture (RN 0.76)
- Enabled by default in SDK 52
- Libraries to verify compatibility:
  - `react-native-draggable-flatlist` — test drag-to-reorder manually
  - In-house swipe tabs — review for any bridged native calls
  - `react-native-paper` — generally fine but test UI rendering
- If issues arise, can temporarily disable New Arch in `app.json`:
  ```json
  { "expo": { "newArchEnabled": false } }
  ```
  But prefer fixing over disabling.

### 4. TypeScript / types alignment
- Ensure `@types/react` version matches React version
- Check for any type errors introduced by version bumps:
  ```bash
  npx tsc --noEmit
  ```

---

## Critical Files
- `app/_layout.tsx`
- `app/planner/edit/[id].tsx`
- `app/(tabs)/index.tsx`
- Any file importing from `reanimated-bottom-sheet`
- `app.json` (if New Arch needs to be toggled)
