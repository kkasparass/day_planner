# Task 1: Upgrade Expo SDK 51 → 52 (Package Updates)

## Context

App currently on Expo SDK 51 / RN 0.74.5 / React 18.2. Expo requires sequential SDK upgrades — cannot skip versions. This task handles all package version bumps for the SDK 52 step.

**Branch:** `upgrade/sdk-52`

---

## Steps

### 1. Run Expo's managed upgrade
```bash
npx expo install expo@~52.0.0 --fix
```
`--fix` automatically realigns all `expo-*` packages (expo-router, expo-sqlite, expo-font, etc.) to their SDK 52 compatible versions.

### 2. Manually update non-Expo-managed packages
```bash
npx expo install react@18.3.x react-native@0.76.x
npx expo install @types/react@~18.3.x react-test-renderer@18.3.x
npx expo install @testing-library/react-native@latest
```

Also bump in package.json if not handled automatically:
- `react-native-paper` → ^5.13.x (verify latest 5.x)
- `react-native-gesture-handler` → SDK 52 compatible (expo install will handle)
- `react-native-reanimated` → SDK 52 compatible (expo install will handle)
- `react-native-screens` → SDK 52 compatible (expo install will handle)

### 3. Install updated deps
```bash
npm install
```

---

## Verification
- `npm install` completes without peer dep errors
- `package.json` shows expo@~52.x, react-native@0.76.x, react@18.3.x
- Proceed to Task 2 (breaking changes) before testing

## Critical Files
- `package.json`
