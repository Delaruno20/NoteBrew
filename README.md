# NoteBrew ☕

A warm, minimal planner & note-taking app built with **React Native**.
*Plan. Focus. Achieve. Every day is a step forward.*

## Features
- **Today** – week strip, progress bar, quick "NEW TASK", checklist
- **Week** – day-by-day agenda with add / hide-done
- **Projects** – per-project totals, done & remaining, task list
- **Profile** – activity heatmap, streak and completion stats
- Tasks carry a note, a project, a date and an optional daily repeat
- **100% local**: everything is stored on the device with AsyncStorage – no account, no server

## Run
```bash
npm install
npm run android        # emulator or device
```

## Build the APK
```bash
cd android && ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```
Requires JDK 17 and the Android SDK (`ANDROID_HOME`).
A pre-built APK is attached to the GitHub release.
