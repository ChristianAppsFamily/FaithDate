import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './Text';

export interface TabHeaderProps {
  /** Small line above the title, e.g. "7 of 10 left today". */
  eyebrow?: string;
  title: string;
  /** Right-aligned action, e.g. the filter button. */
  action?: ReactNode;
}

/** Tab screen header (designs 05, 06, 14): muted eyebrow, Sora title, optional action. */
export function TabHeader({ eyebrow, title, action }: TabHeaderProps) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.row, { marginBottom: spacing.lg }]}>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Text variant="caption" color="muted">
            {eyebrow}
          </Text>
        ) : null}
        <Text variant="title" color="heading" accessibilityRole="header">
          {title}
        </Text>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
});
