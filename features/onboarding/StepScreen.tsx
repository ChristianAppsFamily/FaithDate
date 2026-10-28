import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button, Card, Text } from '@/components/ui';
import { onboardingCopy, onboardingSteps } from '@/config/onboarding';
import { rules } from '@/config/rules';
import { adapter } from '@/data';

import { StepFrame } from './StepFrame';

/**
 * Steps 2 to 10. Milestone 1 ships the frame, progress, save-and-resume, and navigation;
 * each step's form lands in Milestone 2.
 */
export function StepScreen() {
  const { n } = useLocalSearchParams<{ n: string }>();
  const router = useRouter();
  const step = Math.min(rules.onboarding.totalSteps, Math.max(2, Number(n) || 2));
  const def = onboardingSteps.find((s) => s.number === step)!;

  const continueNext = async () => {
    await adapter.saveOnboardingStep(def.id, { completed_step: step });
    if (step >= rules.onboarding.totalSteps) router.replace('/(onboarding)/finish');
    else router.replace({ pathname: '/(onboarding)/step/[n]', params: { n: String(step + 1) } });
  };

  return (
    <StepFrame step={step} footer={<Button label={onboardingCopy.continue} onPress={continueNext} />}>
      <Card tone="tint">
        <Text variant="bodyStrong" color="heading">
          {def.title}
        </Text>
        <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
          The form for this step is built in the next milestone. Continue saves your place so you can quit and resume here.
        </Text>
      </Card>
    </StepFrame>
  );
}
