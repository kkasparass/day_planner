Bump the app version incrementally (patch) in all relevant locations, then start a preview build.

## Steps

1. Read `app.json` and `package.json` to find the current version string (e.g. `1.1.2`).
2. Increment the **patch** segment by 1 (e.g. `1.1.2` → `1.1.3`).
3. Update the version in both files:
   - `app.json` → `expo.version`
   - `package.json` → `version`
4. Run the preview build in the background:
   ```
   npm run build:preview
   ```
5. Wait for the build output to contain the EAS build URL (`See logs: https://...`) and share it with the user.
