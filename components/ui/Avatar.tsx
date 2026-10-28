import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { auntMartha } from '@/config/auntMartha';
import { useTheme } from '@/theme';

import { BlurBlob } from './BlurBlob';
import { Text } from './Text';

export type AvatarVariant = 'blurred' | 'coach' | 'initials';

export interface AvatarProps {
  variant?: AvatarVariant;
  size?: number;
  /** For `initials`: the name to abbreviate. */
  name?: string;
  /** For `blurred`: a stable seed so the same person always gets the same glow. */
  seed?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function seedOffset(seed: string): { cx: number; cy: number } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return { cx: 0.42 + (Math.abs(h) % 17) / 100, cy: 0.38 + (Math.abs(h >> 3) % 15) / 100 };
}

/**
 * Blurred avatars stand in for photos before an exchange. The coach variant is
 * Aunt Martha's "AM" mark with a lavender ring (gold is reserved for badges, Lilies, and exchange).
 */
export function Avatar({ variant = 'blurred', size = 48, name, seed, style, accessibilityLabel }: AvatarProps) {
  const { colors } = useTheme();
  const radius = size / 2;

  if (variant === 'coach') {
    return (
      <View
        accessibilityLabel={accessibilityLabel ?? `${auntMartha.name}, ${auntMartha.label}`}
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: radius, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.lavender },
          style,
        ]}
      >
        <Text variant="captionStrong" color={colors.onPrimary} style={{ fontSize: Math.max(11, size * 0.32), lineHeight: Math.max(14, size * 0.4) }}>
          {auntMartha.initials}
        </Text>
      </View>
    );
  }

  if (variant === 'initials') {
    return (
      <View
        accessibilityLabel={accessibilityLabel ?? name}
        style={[styles.circle, { width: size, height: size, borderRadius: radius, backgroundColor: colors.lavenderTint }, style]}
      >
        <Text variant="captionStrong" color="primary" style={{ fontSize: Math.max(11, size * 0.34), lineHeight: Math.max(14, size * 0.42) }}>
          {initialsOf(name ?? '')}
        </Text>
      </View>
    );
  }

  const { cx, cy } = seedOffset(seed ?? name ?? 'faithdate');
  return (
    <View
      accessibilityLabel={accessibilityLabel ?? (name ? `${name}, photo blurred until exchange` : 'Blurred photo')}
      style={[styles.circle, { width: size, height: size, borderRadius: radius, backgroundColor: colors.lavenderTint }, style]}
    >
      <BlurBlob size={size} cx={cx} cy={cy} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
