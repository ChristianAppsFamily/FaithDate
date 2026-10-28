import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { type PropsWithChildren, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton, ProgressBar, Screen, Text } from '@/components/ui';
import { onboardingSteps } from '@/config/onboarding';
import { rules } from '@/config/rules';
import { useTheme } from '@/theme';

interface StepFrameProps extends PropsWithChildren {
  step: number;
  footer: ReactNode;
  onBack?: () => void;
}

/** Shared chrome for onboarding steps 2 to 10 (designs 02 and 03): back, "Step n of 10", progress bar, title. */
export function StepFrame({ step, footer, onBack, children }: StepFrameProps) {
  const { spacing, colors } = useTheme();
  const router = useRouter();
  const def = onboardingSteps.find((s) => s.number === step) ?? onboardingSteps[0]!;
  const total = rules.onboarding.totalSteps;

  const back = () => {
    if (onBack) return onBack();
    if (step <= 2) router.replace('/(onboarding)/welcome');
    else router.replace({ pathname: '/(onboarding)/step/[n]', params: { n: String(step - 1) } });
  };

  return (
    <Screen footer={footer}>
      <View style={styles.header}>
        <IconButton accessibilityLabel="Back" icon={<ChevronLeft size={20} color={colors.heading} />} tone="outline" onPress={back} size={52} />
        <Text variant="caption" color="muted">
          Step {step} of {total}
        </Text>
      </View>
      <ProgressBar value={step / total} accessibilityLabel={`Onboarding progress, step ${step} of ${total}`} style={{ marginTop: spacing.lg }} />
      <Text variant="title" color="heading" style={{ marginTop: spacing.xxxl }}>
        {def.title}
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: spacing.sm }}>
        {def.subtitle}
      </Text>
      <View style={{ marginTop: spacing.xxl, gap: spacing.xl }}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
