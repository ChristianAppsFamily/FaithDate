import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'inverse' | 'ghostInverse';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  /** Optional second line under the label (design 08 action cards). */
  sublabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pill button. `gold` is reserved for the Photo Exchange action and must be the only
 * gold element on its screen. `inverse` and `ghostInverse` are for dark immersive screens.
 */
export function Button({
  label,
  sublabel,
  variant = 'primary',
  size = 'lg',
  icon,
  loading = false,
  fullWidth = true,
  disabled,
  style,
  accessibilityLabel,
  ...rest
}: ButtonProps) {
  const { colors, radii } = useTheme();
  const isDisabled = disabled || loading;

  const palette = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
    secondary: { bg: 'transparent', fg: colors.primary, border: colors.lavender },
    ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
    gold: { bg: colors.gold, fg: colors.onGold, border: colors.gold },
    inverse: { bg: '#FFFFFF', fg: colors.plumDeep, border: '#FFFFFF' },
    ghostInverse: { bg: 'transparent', fg: colors.immersiveText, border: 'transparent' },
  }[variant];

  const height = size === 'lg' ? 56 : MIN_TOUCH_TARGET;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: sublabel ? 72 : height,
          borderRadius: sublabel ? radii.lg : radii.pill,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: size === 'lg' ? 24 : 18,
          justifyContent: sublabel ? 'flex-start' : 'center',
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <View style={sublabel ? styles.textColumn : undefined}>
            <Text variant={sublabel ? 'bodyStrong' : 'button'} color={palette.fg} align={sublabel ? 'left' : 'center'}>
              {label}
            </Text>
            {sublabel ? (
              <Text variant="caption" color={palette.fg} style={{ opacity: 0.85 }}>
                {sublabel}
              </Text>
            ) : null}
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
});
