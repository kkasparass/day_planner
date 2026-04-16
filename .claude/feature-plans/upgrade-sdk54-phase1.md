# SDK 54 Upgrade — Phase 1

## Goal
Upgrade from Expo SDK 53 / RN 0.79 / React 19.0 to SDK 54 / RN 0.81 / React 19.1.

## Branch
`upgrade/sdk-54`

## Steps

### 1. Run Expo upgrade tool
```bash
npx expo install expo@~54.0.0 --fix
```

### 2. Fix expo-file-system import (breaking change)
`hooks/useSettingsPage.ts` — change import:
```ts
// Before
import * as FileSystem from "expo-file-system";
// After
import * as FileSystem from "expo-file-system/legacy";
```
The legacy API (copyAsync, deleteAsync, getInfoAsync, documentDirectory) moved to `expo-file-system/legacy` in SDK 54. The default export is now the new `/next` API.

### 3. Update non-Expo packages
```bash
npm install react@19.1 react-native@0.81 react-dom@19.1
```

### 4. Check babel.config.js
Remove `react-native-worklets/plugin` if present — Reanimated v4 bundles it automatically.

### 5. Regenerate native project
```bash
npx expo prebuild --clean
```

### 6. Verify
```bash
npm test
npm run lint
npm run android
```

## Checklist
- [ ] Tests pass
- [ ] Lint clean
- [ ] App boots
- [ ] Daily todos load and render
- [ ] Drag-to-reorder works (Reanimated v4 risk)
- [ ] Backup/restore works (file-system import change)
- [ ] Routines page loads
- [ ] Planner edit route navigates correctly
