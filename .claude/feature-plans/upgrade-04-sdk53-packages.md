# Task 4: Upgrade Expo SDK 52 → 53 (Package Updates)

## Context

After SDK 52 is stable and merged (Tasks 1–3), this task handles all package version bumps for the SDK 53 step. SDK 53 ships React Native 0.79 and React 19.

**Prerequisite:** `upgrade/sdk-52` branch merged to main.

**Branch:** `upgrade/sdk-53` (branch from updated main)

---

## Steps

### 1. Run Expo's managed upgrade
```bash
npx expo install expo@~53.0.0 --fix
```
Realigns all `expo-*` packages to SDK 53 compatible versions.

### 2. Upgrade to React 19
```bash
npx expo install react@19 react-native@0.79.x
npx expo install react-dom@19
npx expo install react-test-renderer@19
npx expo install @types/react@~19.x
```

### 3. Upgrade testing libraries for React 19 compat
```bash
npx expo install @testing-library/react-native@latest
npx expo install jest-expo@~53.0.x
```

### 4. Install
```bash
npm install
```

---

## Verification
- `npm install` completes without peer dep errors
- `package.json` shows expo@~53.x, react-native@0.79.x, react@19.x
- Proceed to Task 5 (React 19 migration) before testing

## Critical Files
- `package.json`
