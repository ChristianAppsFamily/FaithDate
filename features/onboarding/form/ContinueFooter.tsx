import { type ReactNode } from 'react';
import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { onboardingCopy } from '@/config/onboarding';
import { useTheme } from '@/theme';

interface ContinueFooterProps {
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
  /** Shown under the button when disabled, so people know what's left. */
  need?: string | null;
  onContinue: () => void;
  secondary?: ReactNode;
}

/** Shared onboarding footer: optional need/error lines + Continue. */
export function ContinueFooter({ disabled = false, loading = false, error = null, need = null, onContinue, secondary }: ContinueFooterProps) {
  const { spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      {error ? (
        <Text variant="caption" color="danger" align="center">
          {error}
        </Text>
      ) : need && disabled ? (
        <Text variant="caption" color="muted" align="center">
          {need}
        </Text>
      ) : null}
      <Button label={onboardingCopy.continue} onPress={onContinue} disabled={disabled} loading={loading} />
      {secondary}
    </View>
  );
}
