import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

import { Text } from './Text';

export type ChipVariant =
  /** Single/multi choice answer (design 02): filled primary when selected. */
  | 'choice'
  /** Suggestion starter (design 03): tinted outline when selected. */
  | 'starter'
  /** Static attribute tag on cards (design 05). */
  | 'tag'
  /** Status pill in lists (design 14), lavenderTint with primary text. */
  | 'status'
  /** The spouse-seeker badge. Gold: at most one per screen. */
  | 'gold';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Chip({ label, variant = 'tag', selected = false, onPress, icon, small = false, style, accessibilityLabel }: ChipProps) {
  const { colors, radii } = useTheme();

  const look = (() => {
    switch (variant) {
      case 'choice':
        return selected
          ? { bg: colors.primary, fg: colors.onPrimary, border: colors.primary }
          : { bg: 'transparent', fg: colors.primary, border: colors.lavender };
      case 'starter':
        return selected
          ? { bg: colors.lavenderTint, fg: colors.primary, border: colors.primary }
          : { bg: 'transparent', fg: colors.primary, border: colors.lavender };
      case 'status':
        return { bg: colors.lavenderTint, fg: colors.primary, border: colors.lavenderTint };
      case 'gold':
        return { bg: colors.gold, fg: colors.onGold, border: colors.gold };
      case 'tag':
      default:
        return { bg: colors.lavenderTint, fg: colors.text, border: colors.lavenderTint };
    }
  })();

  const interactive = typeof onPress === 'function';
  const content = (
    <View
      style={[
        styles.inner,
        {
          backgroundColor: look.bg,
          borderColor: look.border,
          borderRadius: radii.pill,
          paddingHorizontal: small ? 10 : 18,
          minHeight: small ? 26 : interactive ? MIN_TOUCH_TARGET : 34,
          paddingVertical: small ? 2 : 6,
        },
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text variant={small ? 'captionStrong' : interactive ? 'bodyStrong' : 'captionStrong'} color={look.fg} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  if (!interactive) {
    return (
      <View style={style} accessibilityLabel={accessibilityLabel ?? label}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={variant === 'choice' || variant === 'starter' ? 'radio' : 'button'}
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, style]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 6,
  },
});
