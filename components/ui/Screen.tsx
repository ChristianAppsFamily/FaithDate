import { type PropsWithChildren, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_CONTENT_WIDTH, useTheme } from '@/theme';

export interface ScreenProps extends PropsWithChildren {
  /** Dark plum background for welcome, match, reveal, and voice date screens. */
  immersive?: boolean;
  /** Use surfaceAlt (grouped) instead of surface. */
  grouped?: boolean;
  scroll?: boolean;
  padded?: boolean;
  /** Skip the top safe-area padding (when a header already handles it). */
  noTopInset?: boolean;
  /** Extra bottom inset, e.g. when a tab bar or sticky footer is present. */
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  /** Pinned below the scroll area, inside the safe area (e.g. Continue button). */
  footer?: ReactNode;
}

/**
 * Screen chrome: safe-area aware, phone-width column on web, theme background.
 * Every screen in the app sits inside one of these.
 */
export function Screen({
  immersive = false,
  grouped = false,
  scroll = true,
  padded = true,
  noTopInset = false,
  bottomInset = 0,
  contentStyle,
  style,
  footer,
  children,
}: ScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const background = immersive ? colors.immersiveBackground : grouped ? colors.surfaceAlt : colors.background;
  const padding = padded ? spacing.xl : 0;
  const paddingTop = (noTopInset ? 0 : insets.top) + padding;
  const paddingBottom = padding + (footer ? 0 : insets.bottom) + bottomInset;

  const column = <View style={[styles.column, { padding, paddingTop, paddingBottom, flexGrow: 1 }, contentStyle]}>{children}</View>;

  return (
    <View style={[styles.flex, { backgroundColor: background }, style]}>
      {scroll ? (
        <ScrollView style={styles.flex} contentContainerStyle={styles.center} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {column}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.center]}>{column}</View>
      )}
      {footer ? (
        <View style={styles.center}>
          <View style={[styles.column, { paddingHorizontal: padding, paddingTop: spacing.md, paddingBottom: Math.max(insets.bottom, spacing.lg) + bottomInset }]}>
            {footer}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    flexGrow: 1,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
  },
});
