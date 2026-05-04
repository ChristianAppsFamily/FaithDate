// AdMob configuration for FaithDate
// These are Google's official test ad unit IDs for development
// Replace with production IDs before releasing to App Store

export const ADMOB_TEST_IDS = {
  // iOS Test App ID: ca-app-pub-3940256099942544~1458002511
  // Android Test App ID: ca-app-pub-3940256099942544~3347511713

  // Test ad unit IDs (Google's official test IDs)
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
    appOpen: 'ca-app-pub-3940256099942544/5662855259',
  },
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
    appOpen: 'ca-app-pub-3940256099942544/9257395923',
  },
};

// TODO: Spencer - Replace these with your production AdMob ad unit IDs
// Get these from your AdMob dashboard: https://apps.admob.com
export const ADMOB_PRODUCTION_IDS = {
  ios: {
    banner: 'YOUR_IOS_BANNER_AD_UNIT_ID',
    interstitial: 'YOUR_IOS_INTERSTITIAL_AD_UNIT_ID',
    rewarded: 'YOUR_IOS_REWARDED_AD_UNIT_ID',
    appOpen: 'YOUR_IOS_APP_OPEN_AD_UNIT_ID',
  },
  android: {
    banner: 'YOUR_ANDROID_BANNER_AD_UNIT_ID',
    interstitial: 'YOUR_ANDROID_INTERSTITIAL_AD_UNIT_ID',
    rewarded: 'YOUR_ANDROID_REWARDED_AD_UNIT_ID',
    appOpen: 'YOUR_ANDROID_APP_OPEN_AD_UNIT_ID',
  },
};

// Use test IDs in development, production IDs in release
// __DEV__ is true during development with Expo
export const ADMOB_IDS = __DEV__ ? ADMOB_TEST_IDS : ADMOB_PRODUCTION_IDS;
