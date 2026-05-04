import { BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export interface RemoveAdsProduct {
  displayPrice: string;
  id: string;
  type: 'in-app';
}

export interface RewardedAdReward {
  type: string;
  amount: number;
}

// Re-exports for web platform (these won't actually be used on web)
export { BannerAdSize, TestIds };

export async function initializeMonetization(productId: string): Promise<RemoveAdsProduct | null> {
  void productId;
  return null;
}

export async function purchaseRemoveAdsProduct(productId: string): Promise<void> {
  void productId;
  return Promise.resolve();
}

export async function requestAdsTrackingPermission(): Promise<string> {
  return 'Native only';
}

export function getAdUnitId(type: 'banner' | 'interstitial' | 'rewarded' | 'appOpen'): string {
  void type;
  return TestIds.BANNER;
}

export async function loadInterstitialAd(): Promise<void> {
  return Promise.resolve();
}

export async function showInterstitialAd(): Promise<void> {
  return Promise.resolve();
}

export async function loadRewardedAd(): Promise<void> {
  return Promise.resolve();
}

export async function showRewardedAd(): Promise<RewardedAdReward> {
  return { type: '', amount: 0 };
}
