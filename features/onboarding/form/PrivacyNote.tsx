import { Lock } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

// View wraps the icon so RN-only a11y props never hit the SVG DOM node.

import { Text } from '@/components/ui';
import { onboardingCopy } from '@/config/onboarding';
import { useTheme } from '@/theme';

/** Lavender lock callout under life-stage answers (design 02). */
export function PrivacyNote({ text = onboardingCopy.privacyNote }: { text?: string }) {
  const { colors, radii, spacing } = useTheme();
  return (
    <View
      accessibilityRole="text"
      style={[styles.row, { backgroundColor: colors.lavenderTint, borderRadius: radii.lg, padding: spacing.lg, gap: spacing.md }]}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Lock size={18} color={colors.primary} />
      </View>
      <Text variant="caption" color="heading" style={{ flex: 1, lineHeight: 20 }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
