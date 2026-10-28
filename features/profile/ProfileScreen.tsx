import { useRouter } from 'expo-router';
import { Bug, ChevronRight, LogOut } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { VoicePlayer } from '@/components/media';
import { Avatar, Card, Chip, Screen, TabHeader, Text, TAB_BAR_HEIGHT } from '@/components/ui';
import { currency } from '@/config/currency';
import { adapter } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { useSession } from '@/store/useSession';
import { MIN_TOUCH_TARGET, useTheme, useThemePreference, type ThemePreference } from '@/theme';

const themeOptions: { id: ThemePreference; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

/** Profile tab shell: your card summary, Talents balance, appearance, sign out, and the dev panel in dev builds. */
export function ProfileScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { preference, setPreference } = useThemePreference();
  const applySession = useSession((s) => s.applySession);
  const me = useAdapterQuery(() => adapter.getMyCard());
  const wallet = useAdapterQuery(() => adapter.getWallet());

  const signOut = async () => {
    await adapter.signOut();
    applySession({ profile: null, onboarding_complete: false, resume_step: 1 });
    router.replace('/(onboarding)/welcome');
  };

  const card = me.data;

  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader title="Profile" />

      {card ? (
        <Card>
          <View style={styles.row}>
            <Avatar variant="blurred" size={64} seed={card.profile.id} name={card.profile.first_name} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="heading" color="heading">
                {card.profile.first_name}, {card.age}
              </Text>
              <Text variant="caption" color="muted">
                {card.profile.city} · {card.denomination_label}
              </Text>
            </View>
          </View>
          <View style={[styles.chips, { marginTop: spacing.md }]}>
            {card.profile.intent === 'spouse' ? <Chip variant="gold" label="Seeking a spouse" small /> : <Chip variant="tag" label="Dating with purpose" small />}
            {card.profile.verified ? <Chip variant="tag" label="Verified" small /> : null}
            <Chip variant="tag" label={card.attendance_label} small />
          </View>
          {card.voice_intro ? <VoicePlayer clip={card.voice_intro} variant="inline" style={{ marginTop: spacing.md }} /> : null}
        </Card>
      ) : null}

      <Card style={{ marginTop: spacing.md }} onPress={() => router.push('/wallet')} accessibilityRole="button" accessibilityLabel={`Open ${currency.name} wallet`}>
        <View style={styles.rowBetween}>
          <View>
            <Text variant="captionStrong" color="muted">
              {currency.name}
            </Text>
            <Text variant="heading" color="heading">
              {wallet.data?.balance ?? 0}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text variant="captionStrong" color="primary">
              Wallet
            </Text>
            <ChevronRight size={18} color={colors.primary} />
          </View>
        </View>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <Text variant="captionStrong" color="muted">
          Appearance
        </Text>
        <View style={[styles.chips, { marginTop: spacing.sm }]} accessibilityRole="radiogroup">
          {themeOptions.map((o) => (
            <Chip key={o.id} variant="choice" label={o.label} selected={preference === o.id} onPress={() => setPreference(o.id)} />
          ))}
        </View>
      </Card>

      <Card padding={0} style={{ marginTop: spacing.md }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Log out" onPress={signOut} style={({ pressed }) => [styles.listRow, { opacity: pressed ? 0.7 : 1 }]}>
          <LogOut size={20} color={colors.muted} />
          <Text variant="bodyStrong" color="heading" style={{ flex: 1 }}>
            Log out
          </Text>
          <ChevronRight size={18} color={colors.muted} />
        </Pressable>
        {__DEV__ ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open the dev panel"
            onPress={() => router.push('/dev')}
            style={({ pressed }) => [styles.listRow, { borderTopWidth: 1, borderTopColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Bug size={20} color={colors.muted} />
            <View style={{ flex: 1 }}>
              <Text variant="bodyStrong" color="heading">
                Dev panel
              </Text>
              <Text variant="caption" color="muted">
                Simulate likes, matches, messages, and more
              </Text>
            </View>
            <ChevronRight size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: MIN_TOUCH_TARGET,
  },
});
