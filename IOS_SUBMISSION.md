# FaithDate iOS submission guide

This repository includes a generated native iOS project at `ios/FaithDate.xcodeproj`.

## App identity

- Display name: `FaithDate`
- Bundle identifier: `com.christianappsfamily.faithdate`
- Version: `1.0.0`
- Build number: `1`
- Uses non-exempt encryption: `false`
- Privacy policy URL: `https://christianappsfamily.github.io/FaithDate/privacy-policy/`
- Remove Ads product ID: `faithdate.remove_ads`
- Remove Ads type: Non-consumable, one-time purchase, price tier equivalent to `$9.99`
- AdMob app IDs: test IDs are configured and must be replaced with production AdMob IDs before release.

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
4. Run `pod install` after dependency changes so StoreKit/IAP, AdMob, ATT, and Nitro pods are installed.
5. Select a physical device or simulator and run the app.

## App Store Connect setup

Create a non-consumable in-app purchase:

- Product ID: `faithdate.remove_ads`
- Reference name: `Remove Ads`
- Price: `$9.99`

For App Privacy and review metadata:

- Use the privacy policy URL above after enabling GitHub Pages for this repository.
- The app requests App Tracking Transparency for personalized ads and ad measurement.
- Replace AdMob test IDs in `app.json` with production AdMob app IDs before release.

## App Store archive

In Xcode:

1. Select `Any iOS Device (arm64)` as the destination.
2. Choose `Product > Archive`.
3. In Organizer, validate the archive.
4. Distribute to App Store Connect.

Before submitting in App Store Connect, replace the generated placeholder icon with final production artwork if desired.
