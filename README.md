# QRCanvas

QRCanvas is a modern offline QR design studio for Android. It creates polished QR codes for websites, text, contact cards, Wi-Fi access, email, phone, SMS, calendar events, locations, social/profile links, and custom payloads.

Main tagline: Design beautiful QR codes offline.

Developer: Old Alex Hub

## Features

- Offline QR code generation with no backend and no login.
- Smart forms for website, text, vCard, Wi-Fi, email, phone, SMS, calendar event, location, social/profile, and custom payloads.
- 12 built-in design templates.
- Custom foreground, background, card color, title, subtitle, footer, card radius, QR size, and center badge text.
- Local saved project library with search, filter, sort, duplicate, edit, delete, and export flows.
- PNG export through the local Android share flow.
- JSON backup export for individual projects and the full local library.
- JSON import by pasting a QRCanvas backup in Settings.
- Privacy policy and Google Play store asset notes included.

## Offline-first design

QRCanvas generates QR payloads and renders QR images on-device. Templates are bundled with the app. Saved projects and preferences use local AsyncStorage keys. The app does not need an internet connection to create, edit, save, export, import, or delete QR designs.

## No login and no backend

QRCanvas does not use accounts, cloud sync, analytics, ads, subscriptions, backend APIs, short links, or hosted campaigns. All QR content is user-entered and remains on the device unless the user exports or shares it.

## Local storage

Projects are stored under versioned QRCanvas AsyncStorage keys. Settings are stored locally. Resetting data from Settings clears only this app's local keys. JSON backup export includes project metadata, payload data, template choice, design settings, created date, updated date, and generated date.

## Requirements

- Node.js compatible with the React Native version in `package.json`
- JDK 17 or the Android Studio bundled JBR
- Android Studio with Android SDK, platform-tools, platforms, and build-tools
- Android emulator or Android device for local testing

## Run the app

```sh
npm install
npm run android
```

Start Metro separately if needed:

```sh
npm start
```

## Build debug

```sh
cd android
gradlew.bat assembleDebug
```

On macOS/Linux:

```sh
cd android
./gradlew assembleDebug
```

## Build release

The recommended release flow is the parent `release.py` script because it configures Java, Android SDK, `local.properties`, signing files, APK/AAB builds, release folders, docs, store assets, branding, and optional screenshots.

From the parent directory:

```sh
python release.py
```

The main Google Play upload artifact is:

```text
releases/builds/QRCanvas-release.aab
```

The APK is also copied to:

```text
releases/builds/QRCanvas-release.apk
```

## release.py usage

Run these from the parent directory that contains `qrcanvas`:

```sh
python release.py --check-env
python release.py --generate-key-only
python release.py --skip-screenshots
python release.py --skip-build
python release.py --screenshots-only
python release.py --clean
python release.py --no-clean
```

`--check-env` prints Java, keytool, Android SDK, `ANDROID_HOME`, `ANDROID_SDK_ROOT`, `local.properties`, `sdk.dir`, adb, Gradle wrapper, and whether APK/AAB builds should be possible.

## Generate signing key only

```sh
python release.py --generate-key-only
```

This creates `android/keystore/qrcanvas-release.keystore` and `android/keystore/keystore.properties` if they are missing. Existing keystore files are not overwritten.

Back up the keystore and passwords safely. Losing the upload key can block future app updates in Google Play.

## Capture screenshots

Connect an emulator or Android device and run:

```sh
python release.py --screenshots-only
```

The script asks you to open each screen and press Enter to capture. Screenshots are saved under `releases/screenshots`.

## Google Play upload notes

- Use `QRCanvas-release.aab` for Google Play.
- Keep package name `com.oldalexhub.qrcanvas`.
- Confirm the app display name is `QRCanvas`.
- Confirm no camera, contacts, location, internet, or external storage permission is requested.
- Use the files in `store_assets` for listing copy, release notes, screenshot captions, and data safety notes.
- Suggested category: Tools or Productivity.
- Suggested tags: QR generator, QR design, offline utility, business tools, creator tools.

## Environment troubleshooting

If the build fails with “ANDROID_HOME is not set” or “SDK location not found,” run:

python release.py --check-env

release.py should automatically detect the Android SDK from Android Studio, write android/local.properties, and set ANDROID_HOME and ANDROID_SDK_ROOT for the build process. If detection fails, manually install Android Studio and confirm the SDK exists under the normal Android SDK location.

## Android SDK and local.properties

`release.py` detects SDK locations in common Windows, macOS, and Linux paths, validates platform-tools, adb, platforms, and build-tools, then writes `android/local.properties` with a forward-slash `sdk.dir` path. The file is local-machine config and is ignored by git.

## Troubleshooting

- If Gradle cannot find Java, install Android Studio or set `JAVA_HOME` to a JDK/JBR path.
- If `keytool` is missing, verify `JAVA_HOME/bin` exists.
- If `adb` is unavailable, screenshots are skipped with a warning, but builds can continue.
- If native modules are missing, run `npm install` again from the app root.
- If release signing fails, run `python release.py --generate-key-only` from the parent directory.
- If a QR design is hard to scan, increase contrast, use a lighter QR background, reduce badge text, or export a larger size.
