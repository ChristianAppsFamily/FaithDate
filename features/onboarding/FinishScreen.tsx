import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import { onboardingCopy } from '@/config/onboarding';
import { adapter, type Profile, type ProfileStrength } from '@/data';
import { useSession } from '@/store/useSession';
import { useTheme } from '@/theme';

/**
 * Finish screen (design 04). Milestone 1 creates the profile and awards Talents;
 * the strength ring, card preview, and Aunt Martha link are completed in Milestone 2.
 */
export function FinishScreen() {
  const { spacing } = useTheme();
  const router = useRouter();
  const hydrate = useSession((s) => s.hydrate);
  const [result, setResult] = useState<{ profile: Profile; strength: ProfileStrength; talents_awarded: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    adapter
      .finishOnboarding()
      .then(async (r) => {
        await hydrate();
        if (!cancelled) setResult(r);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [hydrate]);

  return (
    <Screen grouped footer={<Button label={onboardingCopy.seeTodaysProfiles} onPress={() => router.replace('/(tabs)/discover')} disabled={!result} />}>
      <View style={{ alignItems: 'center', marginTop: spacing.huge, gap: spacing.md }}>
        <Text variant="title" color="heading" align="center">
          {onboardingCopy.finishTitle}
        </Text>
        <Text variant="body" color="muted" align="center">
          {onboardingCopy.finishSub}
          {result?.strength.next_missing ? ` ${onboardingCopy.finishReachFull(result.strength.next_missing)}` : ''}
        </Text>
        {result ? (
          <Text variant="bodyStrong" color="primary" align="center">
            +{result.talents_awarded} Talents · {onboardingCopy.talentsReward}
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}
