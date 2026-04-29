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

export async function requestAdsTrackingPermission(): Promise<string> {
  return 'Native only';
}
