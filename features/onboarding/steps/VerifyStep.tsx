import { Camera, Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { onboardingCopy } from '@/config/onboarding';
import { useTheme } from '@/theme';

import { StepFrame } from '../StepFrame';
import type { OnboardingController } from '../useOnboardingDraft';

/**
 * Mock selfie check. Phase 1 always "passes" after a short pause; real verification
 * arrives with a provider in Phase 4.
 */
export function VerifyStep({ ctrl }: { ctrl: OnboardingController }) {
  const { colors, radii, spacing } = useTheme();
  const draft = ctrl.draft!;
  const [verified, setVerified] = useState(draft.profile.verified === true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setVerified(draft.profile.verified === true);
  }, [draft]);

  const runCheck = () => {
    setBusy(true);
    setTimeout(() => {
      setVerified(true);
      setBusy(false);
    }, 1200);
  };

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
            disabled={!verified}
            loading={ctrl.saving}
            onPress={() => void ctrl.continueWith({ profile: { verified: true } })}
          />
          {!verified ? (
            <Button label="Skip for now" variant="ghost" onPress={() => void ctrl.continueWith({ profile: { verified: false } })} disabled={ctrl.saving} />
          ) : null}
        </View>
      }
    >
      <Card tone="tint" style={{ alignItems: 'center', paddingVertical: spacing.xxxl }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: radii.xxl,
            backgroundColor: verified ? colors.primary : colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {busy ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : verified ? (
            <Check size={40} color={colors.onPrimary} strokeWidth={3} />
          ) : (
            <Camera size={36} color={colors.primary} />
          )}
        </View>
        <Text variant="subheading" color="heading" style={{ marginTop: spacing.xl }} align="center">
          {verified ? 'You are verified' : busy ? 'Checking…' : 'Take a quick selfie'}
        </Text>
        <Text variant="caption" color="muted" style={{ marginTop: spacing.sm, lineHeight: 20 }} align="center">
          {onboardingCopy.verifyNote}
        </Text>
        {!verified && !busy ? (
          <Button label="Start selfie check" onPress={runCheck} style={{ marginTop: spacing.xl }} fullWidth={false} />
        ) : null}
      </Card>
    </StepFrame>
  );
}
