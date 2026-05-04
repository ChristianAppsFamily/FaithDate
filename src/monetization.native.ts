import mobileAds, {
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  RewardedInterstitialAd,
  AdEventType,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import type { Product } from 'react-native-iap';
import {
  fetchProducts,
  finishTransaction,
  initConnection,
  requestPurchase,
} from 'react-native-iap';
import { requestTrackingPermissionsAsync, getTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Platform } from 'react-native';
import { ADMOB_IDS } from './config/ads';

export type RemoveAdsProduct = Pick<Product, 'displayPrice' | 'id' | 'type'>;

// Re-export for convenience
export { BannerAdSize, TestIds };

// Get the appropriate ad unit ID based on platform and environment
export function getAdUnitId(type: 'banner' | 'interstitial' | 'rewarded' | 'appOpen'): string {
  if (__DEV__) {
    return TestIds[type.toUpperCase() as keyof typeof TestIds];
  }
  const platform = Platform.OS as 'ios' | 'android';
  return ADMOB_IDS[platform][type];
}

// Helper to add timeout to promises
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

export async function initializeMonetization(productId: string): Promise<RemoveAdsProduct | null> {
  // Request ATT permission BEFORE initializing AdMob
  // This ensures the tracking prompt appears before any ad activity
  try {
    // Check current permission status first
    const { status: existingStatus } = await withTimeout(
      getTrackingPermissionsAsync(),
      3000,
      'Get tracking permissions timed out'
    );
    
    // Only request if not already determined
    if (existingStatus === 'undetermined') {
      await withTimeout(
        requestTrackingPermissionsAsync(),
        3000,
        'Tracking permission request timed out'
      );
    }
  } catch (error) {
    console.warn('ATT permission check/request failed:', error);
    // Continue anyway - don't block the app
  }

  try {
    // Initialize Google Mobile Ads with timeout (can hang on splash screen)
    await withTimeout(
      mobileAds().initialize(),
      5000,
      'Google Mobile Ads initialization timed out'
    );
  } catch (error) {
    console.warn('Google Mobile Ads initialization failed:', error);
    // Continue without ads - don't block the app
  }

  try {
    // Initialize IAP connection with timeout
    const connected = await withTimeout(
      initConnection(),
      5000,
      'IAP connection timed out'
    );

    if (!connected) {
      console.warn('IAP connection returned false');
      return null;
    }

    // Fetch products with timeout
    const products = await withTimeout(
      fetchProducts({
        skus: [productId],
        type: 'in-app',
      }),
      5000,
      'Product fetch timed out'
    );

    const product = products?.find(
      (candidate): candidate is Product => candidate.type === 'in-app' && candidate.id === productId,
    );

    return product
      ? {
          displayPrice: product.displayPrice,
          id: product.id,
          type: product.type,
        }
      : null;
  } catch (error) {
    console.warn('IAP initialization failed:', error);
    return null;
  }
}

export async function requestTrackingAuthorization(): Promise<string> {
  try {
    const permission = await withTimeout(
      requestTrackingPermissionsAsync(),
      3000,
      'Tracking permission request timed out'
    );
    return permission.status;
  } catch (error) {
    console.warn('Tracking permission request failed:', error);
    return 'denied';
  }
}

export const requestAdsTrackingPermission = requestTrackingAuthorization;

export async function purchaseRemoveAds(productId: string): Promise<void> {
  try {
    const purchaseResult = await withTimeout(
      requestPurchase({
        request: {
          apple: { sku: productId },
          google: { skus: [productId] },
        },
        type: 'in-app',
      }),
      30000, // 30 second timeout for purchase
      'Purchase request timed out'
    );

    const purchase = Array.isArray(purchaseResult) ? purchaseResult[0] : purchaseResult;

    if (purchase) {
      await finishTransaction({ purchase, isConsumable: false });
    }
  } catch (error) {
    console.warn('Purchase failed:', error);
    throw error;
  }
}

export const purchaseRemoveAdsProduct = purchaseRemoveAds;

// ============================================================================
// Interstitial Ad Helpers
// ============================================================================

let interstitialAd: InterstitialAd | null = null;

export async function loadInterstitialAd(): Promise<void> {
  const unitId = getAdUnitId('interstitial');
  
  interstitialAd = InterstitialAd.createForAdRequest(unitId, {
    requestNonPersonalizedAdsOnly: false,
  });

  return new Promise((resolve, reject) => {
    const unsubscribe = interstitialAd!.addAdEventListener(AdEventType.LOADED, () => {
      unsubscribe();
      resolve();
    });

    interstitialAd!.addAdEventListener(AdEventType.ERROR, (error) => {
      unsubscribe();
      reject(error);
    });

    interstitialAd!.load();
  });
}

export async function showInterstitialAd(): Promise<void> {
  if (!interstitialAd) {
    throw new Error('Interstitial ad not loaded. Call loadInterstitialAd() first.');
  }

  return new Promise((resolve, reject) => {
    const unsubscribeClosed = interstitialAd!.addAdEventListener(AdEventType.CLOSED, () => {
      unsubscribeClosed();
      interstitialAd = null;
      resolve();
    });

    interstitialAd!.addAdEventListener(AdEventType.ERROR, (error) => {
      unsubscribeClosed();
      interstitialAd = null;
      reject(error);
    });

    interstitialAd!.show();
  });
}

// ============================================================================
// Rewarded Ad Helpers
// ============================================================================

let rewardedAd: RewardedAd | null = null;

export async function loadRewardedAd(): Promise<void> {
  const unitId = getAdUnitId('rewarded');
  
  rewardedAd = RewardedAd.createForAdRequest(unitId, {
    requestNonPersonalizedAdsOnly: false,
  });

  return new Promise((resolve, reject) => {
    const unsubscribe = rewardedAd!.addAdEventListener(RewardedAdEventType.LOADED, () => {
      unsubscribe();
      resolve();
    });

    rewardedAd!.addAdEventListener(AdEventType.ERROR, (error) => {
      unsubscribe();
      reject(error);
    });

    rewardedAd!.load();
  });
}

export interface RewardedAdReward {
  type: string;
  amount: number;
}

export async function showRewardedAd(): Promise<RewardedAdReward> {
  if (!rewardedAd) {
    throw new Error('Rewarded ad not loaded. Call loadRewardedAd() first.');
  }

  return new Promise((resolve, reject) => {
    const unsubscribeEarned = rewardedAd!.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        unsubscribeEarned();
        rewardedAd = null;
        resolve(reward);
      }
    );

    rewardedAd!.addAdEventListener(AdEventType.ERROR, (error) => {
      unsubscribeEarned();
      rewardedAd = null;
      reject(error);
    });

    rewardedAd!.show();
  });
}
