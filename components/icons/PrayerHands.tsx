import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PrayerHandsProps {
  size?: number;
  color?: string;
}

/**
 * Custom prayer-hands mark for the match moment (design 07).
 * Lucide has no praying-hands icon; this is the one gold element on that screen.
 */
export function PrayerHands({ size = 36, color = '#3A1A5C' }: PrayerHandsProps) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Path
          d="M17 7.5c-1.4 0-2.6.9-3.1 2.2L8.2 24.8c-.5 1.2.1 2.6 1.3 3.1.4.2.8.2 1.2.2 1 0 1.9-.6 2.2-1.5l3.1-7.2v16.1c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5V14.2c0-1.6-1.1-2.9-2.6-3.2C18.1 9 17.6 7.5 17 7.5z"
          fill={color}
        />
        <Path
          d="M31 7.5c-1.1 0-2.1.7-2.5 1.7-.3.2-.6.5-.8.9v26.4c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5V22.4l3.1 7.2c.3.9 1.2 1.5 2.2 1.5.4 0 .8-.1 1.2-.2 1.2-.5 1.8-1.9 1.3-3.1L34.1 9.7C33.6 8.4 32.4 7.5 31 7.5z"
          fill={color}
        />
        <Path d="M22.5 5.5c-.7 0-1.2.5-1.2 1.2v4.5c0 .7.5 1.2 1.2 1.2s1.2-.5 1.2-1.2V6.7c0-.7-.5-1.2-1.2-1.2zm3 0c-.7 0-1.2.5-1.2 1.2v4.5c0 .7.5 1.2 1.2 1.2s1.2-.5 1.2-1.2V6.7c0-.7-.5-1.2-1.2-1.2z" fill={color} />
      </Svg>
    </View>
  );
}
