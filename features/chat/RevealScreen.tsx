import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, ChevronLeft, ChevronRight, User } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import { adapter } from '@/data';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

/**
 * Design 10. Simultaneous photo reveal after both agree.
 * Gold once: the "Exchanged together" badge. Photo pager uses dots/arrows — no swipe.
 */
export function RevealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();
  const photos = useAdapterQuery(
    () => (id ? adapter.getPhotos(id) : Promise.reject(new Error('Missing match'))),
    [id],
  );
  const match = useAdapterQuery(() => (id ? adapter.getMatch(id) : Promise.reject(new Error('Missing match'))), [id]);
  const [index, setIndex] = useState(0);

  const theirs = photos.data?.theirs ?? [];
  const mine = photos.data?.mine ?? [];
  const pages = Math.max(theirs.length, mine.length, 1);
  const safeIndex = Math.min(index, pages - 1);
  const theirPhoto = theirs[safeIndex];
  const myPhoto = mine[safeIndex];
  const otherName = match.data?.other.profile.first_name ?? 'Them';

  return (
    <Screen
      immersive
      footer={
        <View style={{ gap: spacing.sm }}>
          <Button label="Back to the conversation" variant="inverse" onPress={() => (id ? router.replace({ pathname: '/chat/[id]', params: { id } }) : router.back())} />
          <Button
            label={`View all of ${otherName}'s photos`}
            variant="ghostInverse"
            onPress={() => setIndex(0)}
          />
        </View>
      }
    >
      <View style={[styles.badge, { backgroundColor: colors.gold, alignSelf: 'center', marginTop: spacing.xl }]}>
        <Check size={14} color={colors.onGold} strokeWidth={3} />
        <Text variant="captionStrong" color="onGold">
          Exchanged together
        </Text>
      </View>

      <Text variant="title" color="immersiveText" align="center" style={{ marginTop: spacing.xxl }}>
        Now you see each other
      </Text>
      <Text variant="body" color="immersiveMuted" align="center" style={{ marginTop: spacing.md, lineHeight: 24 }}>
        You both chose this moment. Keep getting to know the person you already like.
      </Text>

      <View style={[styles.pair, { marginTop: spacing.xxxl, gap: spacing.md }]}>
        <PhotoFrame label={otherName} path={theirPhoto?.full_path ?? null} seed={match.data?.other.profile.id ?? 'them'} />
        <PhotoFrame label="You" path={myPhoto?.full_path ?? null} seed="me" />
      </View>

      <View style={[styles.pager, { marginTop: spacing.xl }]}>
        <IconNav
          label="Previous photo"
          disabled={safeIndex <= 0}
          onPress={() => setIndex((i) => Math.max(0, i - 1))}
          icon={<ChevronLeft size={22} color={colors.immersiveText} />}
        />
        <View style={styles.dots}>
          {Array.from({ length: pages }, (_, i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={`Photo ${i + 1} of ${pages}`}
              accessibilityState={{ selected: i === safeIndex }}
              onPress={() => setIndex(i)}
              hitSlop={8}
              style={{
                width: i === safeIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === safeIndex ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </View>
        <IconNav
          label="Next photo"
          disabled={safeIndex >= pages - 1}
          onPress={() => setIndex((i) => Math.min(pages - 1, i + 1))}
          icon={<ChevronRight size={22} color={colors.immersiveText} />}
        />
      </View>
    </Screen>
  );
}

function PhotoFrame({ label, path, seed }: { label: string; path: string | null; seed: string }) {
  const { colors, radii, spacing } = useTheme();
  // Phase 1: abstract "revealed" frame (silhouette) — full_path is set after exchange but we have no real images yet.
  const revealed = Boolean(path);
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: spacing.sm }}>
      <View
        style={{
          width: '100%',
          aspectRatio: 3 / 4,
          borderRadius: radii.xl,
          backgroundColor: revealed ? 'rgba(255,255,255,0.16)' : colors.immersiveSurface,
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.35)',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
        accessibilityLabel={revealed ? `${label}'s photo` : `${label}'s photo pending`}
      >
        <User size={48} color="rgba(255,255,255,0.85)" />
        <Text variant="caption" color="immersiveMuted" style={{ marginTop: spacing.sm }} align="center">
          {revealed ? `[${label}'s photo]` : 'Waiting'}
        </Text>
        <Text variant="overline" color="immersiveMuted" style={{ position: 'absolute', bottom: 8, opacity: 0.5 }}>
          {seed.slice(0, 6)}
        </Text>
      </View>
      <Text variant="subheading" color="immersiveText">
        {label}
      </Text>
    </View>
  );
}

function IconNav({ label, icon, onPress, disabled }: { label: string; icon: React.ReactNode; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={{ minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.35 : 1 }}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pair: {
    flexDirection: 'row',
  },
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
