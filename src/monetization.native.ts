import mobileAds from 'react-native-google-mobile-ads';
import type { Product } from 'react-native-iap';
import {
  fetchProducts,
  finishTransaction,
  initConnection,
  requestPurchase,
} from 'react-native-iap';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

export type RemoveAdsProduct = Pick<Product, 'displayPrice' | 'id' | 'type'>;

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
