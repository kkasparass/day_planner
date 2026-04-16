# SDK 55 Upgrade — Phase 2

## Goal
Upgrade from Expo SDK 54 / RN 0.81 / React 19.1 to SDK 55 / RN 0.83 / React 19.2.

## Branch
`upgrade/sdk-55`
Only start after Phase 1 (SDK 54) is merged and stable.

## Steps

### 1. Run Expo upgrade tool
```bash
npx expo install expo@~55.0.0 --fix
```

### 2. Update non-Expo packages
```bash
npm install react@19.2 react-native@0.83 react-dom@19.2
```

### 3. Check expo-router `reset` prop
Search `app/(tabs)/` for `reset=` on any Tab or headless tab component. Rename to `resetOnFocus` if found.

### 4. Regenerate native project
```bash
npx expo prebuild --clean
```

### 5. Verify
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
- [ ] Drag-to-reorder works
- [ ] Backup/restore works
- [ ] Routines page loads
- [ ] Planner edit route navigates correctly
- [ ] Check if react-native-draggable-flatlist > 4.0.3 is available — bump and verify warning is gone
- [ ] Update VERSION_ISSUES.md accordingly
