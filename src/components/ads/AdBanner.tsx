import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ADMOB_IDS } from '../../config/ads';

interface AdBannerProps {
  size?: BannerAdSize;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: Error) => void;
}

export function AdBanner({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  onAdLoaded,
  onAdFailedToLoad,
}: AdBannerProps) {
  // Use test IDs in development, production IDs in release
  const unitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS === 'ios'
      ? ADMOB_IDS.ios.banner
      : ADMOB_IDS.android.banner;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={unitId}
        size={size}
        onAdLoaded={onAdLoaded}
        onAdFailedToLoad={onAdFailedToLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
