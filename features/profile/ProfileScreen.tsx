import { useRouter } from 'expo-router';
import { Bug, ChevronRight, Settings } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { VoicePlayer } from '@/components/media';
import { Avatar, Card, Chip, Screen, TabHeader, Text, TAB_BAR_HEIGHT } from '@/components/ui';
import { auntMartha } from '@/config/auntMartha';
import { currency } from '@/config/currency';
import { adapter } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { formatDateTime } from '@/lib/time';
import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

/** Profile tab: card summary, wallet, check-ins, Aunt Martha entry, Settings, and the dev panel. */
export function ProfileScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const me = useAdapterQuery(() => adapter.getMyCard());
  const wallet = useAdapterQuery(() => adapter.getWallet());
  const checkins = useAdapterQuery(() => adapter.getPendingCheckins());
  const card = me.data;
  const pending = checkins.data ?? [];

  return (
    <Screen grouped bottomInset={TAB_BAR_HEIGHT}>
      <TabHeader
        title="Profile"
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            onPress={() => router.push('/settings')}
            style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET, alignItems: 'center', justifyContent: 'center' }}
          >
            <Settings size={22} color={colors.heading} />
          </Pressable>
        }
      />

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

      {pending.length > 0 ? (
        <Card style={{ marginTop: spacing.md, gap: spacing.sm }}>
          <Text variant="captionStrong" color="muted">
            How did it go?
          </Text>
          {pending.map((p) => (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityLabel={`Check in on ${p.place_name}`}
              onPress={() => router.push({ pathname: '/check-in/[planId]', params: { planId: p.id } })}
              style={{ minHeight: MIN_TOUCH_TARGET, justifyContent: 'center' }}
            >
              <Text variant="bodyStrong" color="heading">
                {p.place_name}
              </Text>
              <Text variant="caption" color="muted">
                {p.chosen_time ? formatDateTime(p.chosen_time) : 'Confirmed date'} · Tap to check in
              </Text>
            </Pressable>
          ))}
        </Card>
      ) : null}

      <Card
        style={{ marginTop: spacing.md }}
        onPress={() => router.push({ pathname: '/aunt-martha', params: { context: 'profile' } })}
        accessibilityRole="button"
        accessibilityLabel={auntMartha.entryPoints.profile}
      >
        <View style={styles.row}>
          <Avatar variant="coach" size={40} name={auntMartha.name} />
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong" color="heading">
              {auntMartha.entryPoints.profile}
            </Text>
            <Text variant="caption" color="muted">
              {auntMartha.label}
            </Text>
          </View>
          <ChevronRight size={18} color={colors.muted} />
        </View>
      </Card>

      <Card padding={0} style={{ marginTop: spacing.md }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.listRow, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Settings size={20} color={colors.muted} />
          <Text variant="bodyStrong" color="heading" style={{ flex: 1 }}>
            Settings
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
