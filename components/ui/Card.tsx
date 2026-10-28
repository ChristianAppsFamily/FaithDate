import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export type CardTone = 'surface' | 'tint' | 'outline' | 'immersive';

export interface CardProps extends ViewProps {
  tone?: CardTone;
  padding?: number;
  /** Shows a 2px border in this color (used once per screen for a Lily, in gold). */
  accentColor?: string;
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
}

/** Soft-cornered container. `tint` is lavenderTint, `outline` is surface with a hairline border. */
export function Card({ tone = 'outline', padding, accentColor, onPress, style, children, ...rest }: CardProps) {
  const { colors, radii, spacing } = useTheme();
  const look = {
    surface: { bg: colors.surface, border: 'transparent' },
    tint: { bg: colors.lavenderTint, border: 'transparent' },
    outline: { bg: colors.surface, border: colors.border },
    immersive: { bg: colors.immersiveSurface, border: 'transparent' },
  }[tone];

  const boxStyle: StyleProp<ViewStyle> = [
    styles.card,
    {
      backgroundColor: look.bg,
      borderColor: accentColor ?? look.border,
      borderWidth: accentColor ? 2 : tone === 'outline' ? 1 : 0,
      borderRadius: radii.xl,
      padding: padding ?? spacing.lg,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [boxStyle, { opacity: pressed ? 0.9 : 1 }]} {...rest}>
        {children}
      </Pressable>
    );
  }
  return (
    <View style={boxStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
