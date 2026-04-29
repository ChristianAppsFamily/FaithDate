# FaithDate iOS submission guide

This repository includes a generated native iOS project at `ios/FaithDate.xcodeproj`.

## App identity

- Display name: `FaithDate`
- Bundle identifier: `com.christianappsfamily.faithdate`
- Version: `1.0.0`
- Build number: `1`
- Uses non-exempt encryption: `false`

## Local Xcode setup

Run these commands from the repository root on macOS:

```sh
npm install --legacy-peer-deps
cd ios
pod install
open FaithDate.xcworkspace
```

In Xcode:

1. Select the `FaithDate` target.
2. Set the Apple Developer Team under `Signing & Capabilities`.
3. Confirm the bundle identifier is `com.christianappsfamily.faithdate`.
4. Select a physical device or simulator and run the app.

## App Store archive

In Xcode:

1. Select `Any iOS Device (arm64)` as the destination.
2. Choose `Product > Archive`.
3. In Organizer, validate the archive.
4. Distribute to App Store Connect.

Before submitting in App Store Connect, replace the generated placeholder icon with final production artwork if desired.
