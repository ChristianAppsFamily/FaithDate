import { useRouter } from 'expo-router';
import { Cross } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Avatar, Button, Card, Screen, Text } from '@/components/ui';
import { onboardingCopy } from '@/config/onboarding';
import { adapter, type ProfileCard, type ProfileStrength } from '@/data';
import { useSession } from '@/store/useSession';
import { useTheme } from '@/theme';

import { ProfilePreviewCard } from './ProfilePreviewCard';
import { StrengthRing } from './StrengthRing';

/**
 * Design 04. Creates the profile once, awards Talents, shows strength + card preview,
 * and offers the Aunt Martha review link (full coach UI lands in Milestone 5).
 */
export function FinishScreen() {
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();
  const hydrate = useSession((s) => s.hydrate);
  const started = useRef(false);
  const [strength, setStrength] = useState<ProfileStrength | null>(null);
  const [talents, setTalents] = useState(0);
  const [card, setCard] = useState<ProfileCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let cancelled = false;
    (async () => {
      try {
        const session = await adapter.getSession();
        if (session.onboarding_complete && session.profile) {
          const [s, c] = await Promise.all([adapter.getProfileStrength(), adapter.getMyCard()]);
          if (!cancelled) {
            setStrength(s);
            setCard(c);
            setTalents(0);
          }
          await hydrate();
          return;
        }
        const result = await adapter.finishOnboarding();
        await hydrate();
        const preview = await adapter.getMyCard();
        if (!cancelled) {
          setStrength(result.strength);
          setTalents(result.talents_awarded);
          setCard(preview);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not finish onboarding.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrate]);

  const ready = Boolean(card && strength);

  return (
    <Screen
      grouped
      footer={
        <View style={{ gap: spacing.sm }}>
          <Button label={onboardingCopy.seeTodaysProfiles} onPress={() => router.replace('/(tabs)/discover')} disabled={!ready} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Have Aunt Martha review my profile"
            disabled={!ready}
            onPress={() => router.push('/(tabs)/chats')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              minHeight: 44,
              opacity: !ready ? 0.5 : pressed ? 0.75 : 1,
            })}
          >
            <Avatar variant="coach" size={28} name="Aunt Martha" />
            <Text variant="bodyStrong" color="primary">
              Have Aunt Martha review my profile
            </Text>
          </Pressable>
        </View>
      }
    >
      {!ready && !error ? (
        <View style={{ alignItems: 'center', marginTop: spacing.huge }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : null}

      {error ? (
        <Text variant="body" color="danger" align="center" style={{ marginTop: spacing.huge }}>
          {error}
        </Text>
      ) : null}

      {ready && strength && card ? (
        <View style={{ alignItems: 'center', marginTop: spacing.xxl, gap: spacing.lg }}>
          <StrengthRing percent={strength.percent} />
          <Text variant="title" color="heading" align="center">
            {onboardingCopy.finishTitle}
          </Text>
          <Text variant="body" color="muted" align="center" style={{ lineHeight: 24 }}>
            {onboardingCopy.finishSub}
            {strength.next_missing ? ` ${onboardingCopy.finishReachFull(strength.next_missing)}` : ''}
          </Text>

          <View style={{ alignSelf: 'stretch' }}>
            <ProfilePreviewCard card={card} />
          </View>

          {talents > 0 ? (
            <Card tone="outline" style={{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radii.pill,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cross size={20} color={colors.onPrimary} fill={colors.onPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="subheading" color="heading">
                  +{talents} Talents
                </Text>
                <Text variant="caption" color="muted">
                  {onboardingCopy.talentsReward}
                </Text>
              </View>
            </Card>
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
}
