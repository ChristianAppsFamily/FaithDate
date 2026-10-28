import { useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

export interface WaveformProps {
  /** Stable seed so the same clip always draws the same bars. */
  seed: string;
  bars?: number;
  height?: number;
  barWidth?: number;
  gap?: number;
  /** 0 to 1; bars left of this point are drawn in `activeColor`. */
  progress?: number;
  color?: string;
  activeColor?: string;
  /** Optional live amplitude levels (0 to 1) that override the seeded shape. */
  levels?: number[];
  style?: StyleProp<ViewStyle>;
}

function seededHeights(seed: string, count: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const r = ((h >>> 0) % 1000) / 1000;
    const envelope = 0.55 + 0.45 * Math.sin((i / count) * Math.PI);
    out.push(0.2 + r * 0.8 * envelope);
  }
  return out;
}

/** Decorative waveform. Purely visual; the real audio state lives in VoicePlayer. */
export function Waveform({ seed, bars = 32, height = 36, barWidth = 3, gap = 3, progress = 0, color, activeColor, levels, style }: WaveformProps) {
  const { colors } = useTheme();
  const heights = useMemo(() => (levels && levels.length > 0 ? levels : seededHeights(seed, bars)), [seed, bars, levels]);
  const inactive = color ?? colors.lavender;
  const active = activeColor ?? colors.primary;
  const count = heights.length;
  return (
    <View style={[styles.row, { height, gap }, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {heights.map((h, i) => (
        <View
          key={i}
          style={{
            width: barWidth,
            height: Math.max(barWidth, h * height),
            borderRadius: barWidth / 2,
            backgroundColor: i / count < progress ? active : inactive,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
