# Task 5: React 19 Migration (SDK 53)

## Context

SDK 53 upgrades to React 19. React 19 has meaningful breaking changes vs 18.x, primarily around removed APIs, `act()` behavior in tests, and type changes. This task addresses those before verification.

**Branch:** `upgrade/sdk-53` (continue from Task 4)

---

## Breaking Changes to Audit & Fix

### 1. `act()` in tests
- React 19 changes async `act()` behavior
- Tests may emit new warnings or fail with timing differences
- Review all test files using `act()` or `waitFor()`:
  - `hooks/__tests__/`
  - `components/**/__tests__/`
  - `store/slices/__tests__/`
- `@testing-library/react-native` v13+ handles most of this — ensure it's installed (Task 4)

### 2. `@types/react` v19 type changes
- Some types renamed or removed (e.g., `React.FC` changes, ref types)
- Run TypeScript check to surface all type errors:
  ```bash
  npx tsc --noEmit
  ```
- Fix any type errors found

### 3. `react-test-renderer` v19
- API changes for test renderer — check `react-test-renderer` usage in test files
- `renderHook` from `@testing-library/react-native` is preferred over raw renderer

### 4. Removed APIs (React 19)
- `ReactDOM.render` removed — unlikely used directly in RN but check any web/DOM code
- `string refs` removed — grep for any remaining string ref patterns:
  ```bash
  grep -r 'ref="' --include="*.tsx" .
  ```
- `defaultProps` on function components removed — check any component using `Component.defaultProps`

### 5. Redux Toolkit / react-redux compat
- `react-redux@9.x` is already React 18/19 compatible — no changes expected
- Verify Redux Provider still wraps correctly in `app/_layout.tsx`

---

## Critical Files
- `jest.setup.ts` — may need act() updates
- `__mocks__/createMockDb.ts`
- All `__tests__/` files
- `app/_layout.tsx`
- Any component using `defaultProps` or string refs
