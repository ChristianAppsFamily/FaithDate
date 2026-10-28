import { Lock } from 'lucide-react-native';
import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { BlurBlob } from '@/components/ui/BlurBlob';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme';

export interface BlurredPhotoFrameProps {
  /** Stable seed so each person's glow is consistent. */
  seed: string;
  height?: number;
  /** Hide the lock label (e.g. when the frame is tiny). */
  showLabel?: boolean;
  label?: string;
  /** Overlay slot, top-right (e.g. the Save bookmark). */
  topRight?: ReactNode;
  /** Square corners on the bottom so the frame can sit flush on a card. */
  flushBottom?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const blurredPhotoCopy = 'Photos shared after exchange';

/**
 * Where a photo would be before an exchange. Always a lavenderTint frame with a soft
 * glow, a lock, and the copy from the designs. Never a gray box, never a real image.
 */
export function BlurredPhotoFrame({ seed, height = 200, showLabel = true, label = blurredPhotoCopy, topRight, flushBottom = false, style }: BlurredPhotoFrameProps) {
  const { colors, radii, spacing } = useTheme();
  return (
    <View
      accessibilityLabel={label}
      style={[
        styles.frame,
        {
          height,
          backgroundColor: colors.lavenderTint,
          borderTopLeftRadius: radii.xl,
          borderTopRightRadius: radii.xl,
          borderBottomLeftRadius: flushBottom ? 0 : radii.xl,
          borderBottomRightRadius: flushBottom ? 0 : radii.xl,
        },
        style,
      ]}
    >
      <BlurBlob size={height * 1.6} cx={0.5} cy={0.5} />
      {showLabel ? (
        <View style={[styles.label, { backgroundColor: colors.surface, borderRadius: radii.pill, left: spacing.lg, top: spacing.lg }]}>
          <Lock size={14} color={colors.plumDeep} />
          <Text variant="captionStrong" color="plumDeep">
            {label}
          </Text>
        </View>
      ) : null}
      {topRight ? <View style={[styles.topRight, { right: spacing.lg, top: spacing.lg }]}>{topRight}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  topRight: {
    position: 'absolute',
  },
});
