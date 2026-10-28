import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Text } from '@/components/ui';
import { useTheme } from '@/theme';

interface StrengthRingProps {
  percent: number;
  size?: number;
}

/** Circular profile-strength meter from design 04. */
export function StrengthRing({ percent, size = 120 }: StrengthRingProps) {
  const { colors } = useTheme();
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = c * (1 - clamped / 100);
  const center = size / 2;

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessibilityRole="progressbar"
      accessibilityLabel={`Profile strength ${clamped} percent`}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <Svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Circle cx={center} cy={center} r={r} stroke={colors.lavenderTint} strokeWidth={stroke} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke={colors.primary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          // SVG attribute form — avoids RN Web warning from `rotation`/`origin` props.
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <Text variant="heading" color="heading">
        {clamped}%
      </Text>
      <Text variant="overline" color="muted">
        strength
      </Text>
    </View>
  );
}
