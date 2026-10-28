import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar, Button, Card, IconButton, Screen, Text } from '@/components/ui';
import { adapter } from '@/data';
import { demoProfile } from '@/data/mock/seed/demo';
import { useSession } from '@/store/useSession';
import { useTheme } from '@/theme';

/**
 * "I already have an account." Phase 1 has no real auth, so this signs in as the
 * seeded demo account (Grace), which comes with likes, matches, and chats to explore.
 */
export function SignInScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const applySession = useSession((s) => s.applySession);
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    setBusy(true);
    const info = await adapter.signInAsDemo();
    applySession(info);
    router.replace('/(tabs)/discover');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton accessibilityLabel="Back" icon={<ChevronLeft size={20} color={colors.heading} />} tone="outline" size={52} onPress={() => router.back()} />
      </View>
      <Text variant="title" color="heading" style={{ marginTop: spacing.xxxl }}>
        Welcome back
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: spacing.sm }}>
        Sign-in with a phone number or email arrives with the backend. For now, step into the demo account to explore the app.
      </Text>

      <Card tone="tint" style={{ marginTop: spacing.xxl }}>
        <View style={styles.row}>
          <Avatar variant="blurred" size={56} seed={demoProfile.id} name={demoProfile.first_name} />
          <View style={{ flex: 1 }}>
            <Text variant="subheading" color="heading">
              {demoProfile.first_name}, 29
            </Text>
            <Text variant="caption" color="muted">
              {demoProfile.city} · Verified · Seeking a spouse
            </Text>
          </View>
        </View>
        <Text variant="caption" color="muted" style={{ marginTop: spacing.md }}>
          Comes with 3 people who liked you, 3 matches at different stages, and a voice date scheduled for tomorrow.
        </Text>
      </Card>

      <Button label={`Continue as ${demoProfile.first_name}`} onPress={signIn} loading={busy} style={{ marginTop: spacing.xxl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
