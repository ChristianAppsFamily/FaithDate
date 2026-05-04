# FaithDate AdMob Configuration

## Current Status ✅

The AdMob SDK is properly configured for development with test IDs.

### What's Configured

1. **app.json** - Expo configuration with:
   - iOS Test App ID: `ca-app-pub-3940256099942544~1458002511`
   - Android Test App ID: `ca-app-pub-3940256099942544~3347511713`
   - expo-tracking-transparency plugin for ATT permission

2. **ios/FaithDate/Info.plist** - iOS-specific configuration with:
   - `GADApplicationIdentifier` - Matches the test App ID
   - `GADDelayAppMeasurementInit` - Delays measurement until ATT permission is granted
   - `NSUserTrackingUsageDescription` - Required for App Tracking Transparency

3. **src/config/ads.ts** - New file with:
   - Google's official test ad unit IDs for all ad formats
   - Placeholder structure for production IDs
   - `ADMOB_IDS` export that automatically uses test IDs in development

4. **src/components/ads/AdBanner.tsx** - New reusable banner ad component

5. **src/monetization.native.ts** - Updated with:
   - `getAdUnitId()` helper function
   - `loadInterstitialAd()` / `showInterstitialAd()` helpers
   - `loadRewardedAd()` / `showRewardedAd()` helpers
   - Proper TypeScript types for all ad formats

## RevenueCat Status ✅

**No RevenueCat code found** - The app only uses `react-native-iap` for in-app purchases (Remove Ads feature). No RevenueCat imports or references exist in the codebase.

## Instructions for Spencer: Adding Production AdMob IDs

### Step 1: Create AdMob Account & App

1. Go to [https://apps.admob.com](https://apps.admob.com)
2. Sign in with your Google account
3. Add a new app:
   - **iOS**: Bundle ID `com.christianappsfamily.faithdate`
   - **Android**: Package `com.christianappsfamily.faithdate`

### Step 2: Create Ad Units

For each platform, create these ad units in your AdMob dashboard:

| Ad Type | Recommended Placement |
|---------|----------------------|
| Banner | Bottom of HomeScreen, between profile cards |
| Interstitial | After user likes 3 profiles, or between app sections |
| Rewarded | Optional - for unlocking premium features temporarily |
| App Open | When app is brought to foreground |

### Step 3: Update Configuration Files

#### 1. Update `app.json`

Replace the test App IDs with your production IDs:

```json
{
  "plugins": [
    [
      "react-native-google-mobile-ads",
      {
        "iosAppId": "ca-app-pub-YOUR_IOS_APP_ID",
        "androidAppId": "ca-app-pub-YOUR_ANDROID_APP_ID",
        "delayAppMeasurementInit": true
      }
    ]
  ],
  "extra": {
    "adMob": {
      "iosAppId": "ca-app-pub-YOUR_IOS_APP_ID",
      "androidAppId": "ca-app-pub-YOUR_ANDROID_APP_ID"
    }
  }
}
```

#### 2. Update `src/config/ads.ts`

Replace the placeholder production IDs with your actual ad unit IDs:

```typescript
export const ADMOB_PRODUCTION_IDS = {
  ios: {
    banner: 'ca-app-pub-YOUR_IOS_BANNER_ID',
    interstitial: 'ca-app-pub-YOUR_IOS_INTERSTITIAL_ID',
    rewarded: 'ca-app-pub-YOUR_IOS_REWARDED_ID',
    appOpen: 'ca-app-pub-YOUR_IOS_APP_OPEN_ID',
  },
  android: {
    banner: 'ca-app-pub-YOUR_ANDROID_BANNER_ID',
    interstitial: 'ca-app-pub-YOUR_ANDROID_INTERSTITIAL_ID',
    rewarded: 'ca-app-pub-YOUR_ANDROID_REWARDED_ID',
    appOpen: 'ca-app-pub-YOUR_ANDROID_APP_OPEN_ID',
  },
};
```

#### 3. Update `ios/FaithDate/Info.plist`

After running `expo prebuild` or `npx expo run:ios`, the `GADApplicationIdentifier` will be automatically updated from app.json. However, you can also manually update it:

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-YOUR_IOS_APP_ID</string>
```

### Step 4: Add Banner Ads to Screens

Import and use the `AdBanner` component in your screens:

```tsx
import { AdBanner } from '../components/ads';
import { BannerAdSize } from '../monetization';

// In your screen component:
<AdBanner 
  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
  onAdLoaded={() => console.log('Ad loaded')}
  onAdFailedToLoad={(error) => console.error('Ad failed:', error)}
/>
```

### Step 5: Test Production Ads

Before submitting to the App Store:

1. Build a release version (not development)
2. Test on a real device
3. Verify ads load correctly
4. Check that the "Test Ad" label is NOT showing (production ads won't have this)

### Step 6: App Store Privacy Requirements

Make sure your App Store listing includes:

1. **Privacy Policy URL** - Already configured in `app.json`
2. **App Privacy Details** in App Store Connect:
   - Data Used for Tracking: Device ID
   - Third-party advertising: Yes
   - Data types: Device ID, Advertising Data

## Important Notes

- **Test IDs**: The app currently uses Google's official test IDs. These will always show test ads and are safe for development.
- **ATT Permission**: The app requests App Tracking Transparency permission before initializing ads (required for iOS 14.5+)
- **Remove Ads IAP**: The app already has infrastructure for "Remove Ads" in-app purchase using `react-native-iap`
- **No RevenueCat**: The app doesn't use RevenueCat - all IAP is handled directly through `react-native-iap`

## Troubleshooting

### Ads not showing in development?
- Check that you're using a physical device (simulators may not show ads)
- Verify `__DEV__` is true (test IDs are used)
- Check console for AdMob initialization errors

### Production ads not showing?
- It can take 24-48 hours for new AdMob apps to start serving ads
- Ensure your payment information is complete in AdMob
- Check AdMob dashboard for any policy violations
