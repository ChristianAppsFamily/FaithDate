import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export interface ProgressBarProps {
  /** 0 to 1. */
  value: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ value, height = 6, trackColor, fillColor, accessibilityLabel, style }: ProgressBarProps) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor ?? colors.lavenderTint }, style]}
    >
      <View style={[styles.fill, { width: `${clamped * 100}%`, borderRadius: height / 2, backgroundColor: fillColor ?? colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
