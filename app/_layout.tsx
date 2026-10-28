import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useSession } from '@/store/useSession';
import { ThemeProvider, useTheme, type ThemePreference } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Sora_600SemiBold,
    Sora_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const status = useSession((s) => s.status);
  const hydrate = useSession((s) => s.hydrate);
  const themePreference = useSession((s) => s.themePreference);
  const setThemePreference = useSession((s) => s.setThemePreference);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const ready = fontsLoaded && status === 'ready';
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  const onPreferenceChange = useCallback((p: ThemePreference) => setThemePreference(p), [setThemePreference]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider preference={themePreference} onPreferenceChange={onPreferenceChange}>
        <RootStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootStack() {
  const { colors, scheme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          // No swipe gestures anywhere, including swipe-back.
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="match/[id]" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen name="reveal/[id]" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="aunt-martha" />
        <Stack.Screen name="wallet" options={{ presentation: 'modal' }} />
        <Stack.Screen name="dev" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}
