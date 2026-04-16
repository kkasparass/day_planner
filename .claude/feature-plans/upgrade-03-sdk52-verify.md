# Task 3: SDK 52 Verification & Stabilization

## Context

After Tasks 1 and 2 (package bumps + breaking change fixes), verify the app is fully stable on SDK 52 before merging and starting the SDK 53 upgrade.

**Branch:** `upgrade/sdk-52`

---

## Verification Steps

### Automated checks
```bash
npm test          # full test suite must pass
npm run lint      # no new lint errors
npx tsc --noEmit  # no TypeScript errors
```

### Manual smoke test (Android emulator)
Run:
```bash
npm run android
```

Test these flows:
- [ ] App boots without crash
- [ ] Daily todos tab loads and renders todo list
- [ ] Drag-to-reorder works on daily todos
- [ ] Routines page loads
- [ ] Adding a routine to a day works
- [ ] Routine item order is preserved when added to day
- [ ] Planner tab loads
- [ ] Edit planner item — navigate to `/planner/edit/[id]` and back
- [ ] Settings tab loads
- [ ] SQLite migrations run cleanly (check logs on first launch)
- [ ] In-house swipe tabs render and swipe correctly
- [ ] No Reanimated or gesture handler warnings in console

### If tests fail
- Check if mock signatures changed (jest-expo update may affect Reanimated/gesture handler mocks in `jest.setup.ts`)
- Check `__mocks__/createMockDb.ts` against any expo-sqlite API changes

---

## Done When
- All automated checks pass
- All manual flows work
- Branch merged to main
- Ready to begin Task 4 (SDK 53 packages)

## Critical Files
- `jest.setup.ts`
- `__mocks__/createMockDb.ts`
