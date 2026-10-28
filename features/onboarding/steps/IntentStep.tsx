import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { onboardingCopy } from '@/config/onboarding';
import type { Intent } from '@/data';
import { useTheme } from '@/theme';

import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

const OPTIONS: { value: Intent; title: string; body: string }[] = [
  {
    value: 'spouse',
    title: 'Seeking a spouse',
    body: 'You are here for marriage. Verified spouse-seekers can exchange photos as soon as a chat opens.',
  },
  {
    value: 'purpose',
    title: 'Dating with purpose',
    body: 'You are open to a serious relationship and want clarity before photos are shared.',
  },
];

export function IntentStep({ ctrl }: { ctrl: OnboardingController }) {
  const { colors, spacing } = useTheme();
  const draft = ctrl.draft!;
  const [intent, setIntent] = useState<Intent | null>(draft.profile.intent ?? null);

  useEffect(() => {
    setIntent(draft.profile.intent ?? null);
  }, [draft]);

  return (
    <StepFrame
      step={ctrl.step}
      footer={
        <View style={{ gap: spacing.sm }}>
          {ctrl.error ? (
            <Text variant="caption" color="danger" align="center">
              {ctrl.error}
            </Text>
          ) : null}
          <Button
            label={onboardingCopy.continue}
            disabled={!intent}
            loading={ctrl.saving}
            onPress={() => void ctrl.continueWith({ profile: { intent: intent! } })}
          />
        </View>
      }
    >
      <View style={{ gap: spacing.md }}>
        {OPTIONS.map((opt) => {
          const selected = intent === opt.value;
          return (
            <Card
              key={opt.value}
              tone={selected ? 'tint' : 'outline'}
              onPress={() => setIntent(opt.value)}
              accessibilityState={{ selected }}
              style={selected ? { borderWidth: 2, borderColor: colors.primary } : undefined}
            >
              <Text variant="subheading" color="heading">
                {opt.title}
              </Text>
              <Text variant="caption" color="muted" style={{ marginTop: spacing.xs, lineHeight: 20 }}>
                {opt.body}
              </Text>
            </Card>
          );
        })}
      </View>
    </StepFrame>
  );
}
