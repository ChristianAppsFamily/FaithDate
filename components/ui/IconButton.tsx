import { type ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

export type IconButtonTone = 'plain' | 'outline' | 'filled' | 'tint' | 'onDark' | 'danger';

export interface IconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  /** Required: icon buttons must announce what they do. */
  accessibilityLabel: string;
  icon: ReactNode;
  tone?: IconButtonTone;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/** Circular icon button with a 44px minimum touch target. */
export function IconButton({ accessibilityLabel, icon, tone = 'plain', size = MIN_TOUCH_TARGET, disabled, style, ...rest }: IconButtonProps) {
  const { colors } = useTheme();
  const look = {
    plain: { bg: 'transparent', border: 'transparent' },
    outline: { bg: colors.surface, border: colors.lavender },
    filled: { bg: colors.primary, border: colors.primary },
    tint: { bg: colors.lavenderTint, border: colors.lavenderTint },
    onDark: { bg: 'rgba(255,255,255,0.14)', border: 'transparent' },
    danger: { bg: colors.danger, border: colors.danger },
  }[tone];
  const dimension = Math.max(MIN_TOUCH_TARGET, size);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled ?? false }}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: look.bg,
          borderColor: look.border,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
