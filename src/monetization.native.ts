import mobileAds from 'react-native-google-mobile-ads';
import type { Product, Purchase } from 'react-native-iap';
import {
  fetchProducts,
  finishTransaction,
  initConnection,
  requestPurchase,
} from 'react-native-iap';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

export type RemoveAdsProduct = Pick<Product, 'displayPrice' | 'id' | 'type'>;

// AdMob Test IDs
const BANNER_AD_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111';
const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-3940256099942544/1033173712';

let interstitialAd: any = null;
let InterstitialAd: any = null;
let AdEventType: any = null;
let adsInitialized = false;

export async function initializeMonetization(productId: string) {
  await mobileAds().initialize();
  await initConnection();

  const products = await fetchProducts({
    skus: [productId],
    type: 'in-app',
  });
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
}

export async function requestTrackingAuthorization() {
  const permission = await requestTrackingPermissionsAsync();
  return permission.status;
}

export const requestAdsTrackingPermission = requestTrackingAuthorization;

export async function purchaseRemoveAds(productId: string) {
  const purchaseResult = await requestPurchase({
    request: {
      apple: { sku: productId },
      google: { skus: [productId] },
    },
    type: 'in-app',
  });

  const purchase = Array.isArray(purchaseResult) ? purchaseResult[0] : purchaseResult;

  if (purchase) {
    await finishTransaction({ purchase, isConsumable: false });
  }
}

export const purchaseRemoveAdsProduct = purchaseRemoveAds;

export async function purchaseSubscription(productId: string) {
  const purchaseResult = await requestPurchase({
    request: {
      apple: { sku: productId },
      google: { skus: [productId] },
    },
    type: 'subs',
  });

  const purchase = Array.isArray(purchaseResult) ? purchaseResult[0] : purchaseResult;

  if (purchase) {
    await finishTransaction({ purchase, isConsumable: false });
  }
}

// AdMob Banner
export function getBannerAdUnitId(): string {
  return BANNER_AD_UNIT_ID;
}

// AdMob Interstitial
export async function initializeInterstitialAds(): Promise<void> {
  if (adsInitialized) return;
  
  try {
    const gma = require('react-native-google-mobile-ads');
    InterstitialAd = gma.InterstitialAd;
    AdEventType = gma.AdEventType;
    
    interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('[Ads] Interstitial loaded');
    });

    interstitialAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
      console.log('[Ads] Interstitial error:', error);
      setTimeout(() => loadInterstitialAd(), 30000);
    });

    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[Ads] Interstitial closed, reloading...');
      loadInterstitialAd();
    });

    adsInitialized = true;
    loadInterstitialAd();
  } catch (e) {
    console.log('[Ads] Failed to initialize interstitial:', e);
  }
}

function loadInterstitialAd(): void {
  if (!interstitialAd) return;
  interstitialAd.load();
}

export async function showInterstitialAd(): Promise<void> {
  if (!adsInitialized || !interstitialAd) {
    console.log('[Ads] Interstitial not initialized');
    return;
  }

  try {
    if (interstitialAd.loaded) {
      await interstitialAd.show();
    } else {
      console.log('[Ads] Interstitial not loaded yet');
      loadInterstitialAd();
    }
  } catch (e) {
    console.log('[Ads] Failed to show interstitial:', e);
  }
}
