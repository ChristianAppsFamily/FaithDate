import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export interface BlurBlobProps {
  /** Width and height of the blob area. */
  size: number;
  /** Shift the soft center; 0.5/0.5 is centered. */
  cx?: number;
  cy?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * The soft lavender "blurred person" glow used for photos before an exchange.
 * Built from layered translucent circles so it looks the same on native and web
 * and never needs an image.
 */
export function BlurBlob({ size, cx = 0.5, cy = 0.45, style }: BlurBlobProps) {
  const { colors, scheme } = useTheme();
  const base = scheme === 'dark' ? colors.lavender : colors.lavender;
  const layers = [
    { scale: 0.95, opacity: 0.18 },
    { scale: 0.72, opacity: 0.22 },
    { scale: 0.5, opacity: 0.28 },
    { scale: 0.3, opacity: 0.35 },
  ];
  return (
    <View style={[{ width: size, height: size }, styles.wrap, style]} pointerEvents="none">
      {layers.map((l, i) => {
        const d = size * l.scale;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: d,
              height: d,
              borderRadius: d / 2,
              backgroundColor: base,
              opacity: l.opacity,
              left: size * cx - d / 2,
              top: size * cy - d / 2,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
});
