import { useLocalSearchParams, useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrayerHands } from '@/components/icons/PrayerHands';
import { Avatar, Button, Screen, Text } from '@/components/ui';
import { adapter } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useSession } from '@/store/useSession';
import { useTheme } from '@/theme';

/**
 * Design 07. Full-screen match celebration.
 * Gold appears once: the prayer-hands circle.
 */
export function MatchMomentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const me = useSession((s) => s.profile);
  const match = useAdapterQuery(() => (id ? adapter.getMatch(id) : Promise.reject(new Error('Missing match'))), [id]);

  useEffect(() => {
    if (id) void adapter.markRead(id).catch(() => undefined);
  }, [id]);

  const other = match.data?.other;
  const name = other?.profile.first_name ?? 'them';

  const open = () => {
    if (!id) return;
    router.replace({ pathname: '/chat/[id]', params: { id } });
  };

  return (
    <Screen
      immersive
      scroll={false}
      footer={
        <View style={{ gap: spacing.sm }}>
          <Button label="Open to view your match" variant="inverse" onPress={open} disabled={!id} />
          <Button label="Keep browsing" variant="ghostInverse" onPress={() => router.replace('/(tabs)/discover')} />
        </View>
      }
    >
      <View style={styles.center}>
        <View style={[styles.iconCircle, { backgroundColor: colors.gold }]}>
          <PrayerHands size={40} color={colors.plumDeep} />
        </View>
        <Text variant="title" color="immersiveText" align="center" style={{ marginTop: spacing.xxxl }}>
          You've made a match by faith!
        </Text>
        <Text variant="body" color="immersiveMuted" align="center" style={{ marginTop: spacing.md, lineHeight: 24 }}>
          You and {name} liked each other for who you are.
        </Text>

        <View style={[styles.avatars, { marginTop: spacing.xxxl }]}>
          <Avatar variant="blurred" size={96} seed={me?.id ?? 'me'} name={me?.first_name ?? 'You'} />
          <View style={{ marginLeft: -28 }}>
            <Avatar variant="blurred" size={96} seed={other?.profile.id ?? 'other'} name={name} />
          </View>
        </View>

        <View style={[styles.lockPill, { backgroundColor: colors.immersiveSurface, marginTop: spacing.xl }]}>
          <Lock size={14} color={colors.immersiveText} />
          <Text variant="captionStrong" color="immersiveText">
            Photos stay private until you both exchange
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
});
