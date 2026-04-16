# Task 6: SDK 53 Verification & Stabilization

## Context

After Tasks 4 and 5 (package bumps + React 19 migration), verify the app is fully stable on SDK 53 / React 19 before merging.

**Branch:** `upgrade/sdk-53`

---

## Verification Steps

### Automated checks
```bash
npm test          # full test suite must pass
npm run lint      # no new lint errors
npx tsc --noEmit  # no TypeScript errors
```

### Manual smoke test (Android emulator)
```bash
npm run android
```

Test these flows:
- [ ] App boots without crash
- [ ] Daily todos tab loads and renders todo list
- [ ] Drag-to-reorder works on daily todos
- [ ] Routines page loads
- [ ] Adding a routine to a day works
- [ ] Routine item order preserved when added to day
- [ ] Planner tab loads
- [ ] Edit planner item — navigate to `/planner/edit/[id]` and back
- [ ] Settings tab loads
- [ ] SQLite migrations run cleanly (check logs on first launch)
- [ ] In-house swipe tabs render and swipe correctly
- [ ] No React 19 deprecation warnings in console
- [ ] No Reanimated / gesture handler warnings

### Watch for React 19-specific issues
- Concurrent rendering behavior changes (strict mode double-invoke effects)
- Any state update batching differences visible in UI
- Ref forwarding changes in custom components

---

## Done When
- All automated checks pass
- All manual flows work
- Branch merged to main
- App running on Expo SDK 53 / RN 0.79 / React 19

## Critical Files
- `jest.setup.ts`
- `__mocks__/createMockDb.ts`
