# Version Issues

Known compatibility issues, unresolved warnings, and packages to watch for updates.

---

## `react-native-draggable-flatlist` — `ref.measureLayout` warning

**Warning:** `ref.measureLayout must be called with a ref to a native component`

**Affected versions:** 4.0.3 (latest as of 2026-04-16)

**Cause:** Library uses deprecated `findNodeHandle()` API which is not compatible with React Native New Architecture (enabled by default in RN 0.76+).

**Status:** Fix exists in [PR #544](https://github.com/computerjazz/react-native-draggable-flatlist/pull/544) but has not been released. App functions correctly — warning is cosmetic.

**Action:** Bump `react-native-draggable-flatlist` when a version beyond `4.0.3` is released and verify the warning is gone.
