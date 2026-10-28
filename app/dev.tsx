import { Redirect } from 'expo-router';

import { DevPanelScreen } from '@/features/dev-panel/DevPanelScreen';

export default function DevRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  return <DevPanelScreen />;
}
