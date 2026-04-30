export interface RemoveAdsProduct {
  displayPrice: string;
  id: string;
  type: 'in-app';
}

export async function initializeMonetization(productId: string): Promise<RemoveAdsProduct | null> {
  void productId;
  return null;
}

export async function purchaseRemoveAdsProduct(productId: string): Promise<void> {
  void productId;
  return Promise.resolve();
}

export async function purchaseSubscription(productId: string): Promise<void> {
  void productId;
  return Promise.resolve();
}

export async function requestAdsTrackingPermission(): Promise<string> {
  return 'Native only';
}

export function getBannerAdUnitId(): string {
  return 'ca-app-pub-3940256099942544/6300978111';
}

export async function initializeInterstitialAds(): Promise<void> {
  return Promise.resolve();
}

export async function showInterstitialAd(): Promise<void> {
  return Promise.resolve();
}
