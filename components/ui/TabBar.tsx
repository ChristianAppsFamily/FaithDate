import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';

import { MAX_CONTENT_WIDTH, MIN_TOUCH_TARGET, useTheme } from '@/theme';

import { Text } from './Text';

export const TAB_BAR_HEIGHT = 64;

/**
 * Text-only bottom tabs with a dot above the active one (design 05).
 * No icons, no swipe between tabs.
 */
export function TabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.bar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom }]}>
      <View style={styles.inner} role="tablist">
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const options = descriptor?.options ?? {};
          const label = typeof options.title === 'string' ? options.title : route.name;
          const focused = state.index === index;
          const badge = options.tabBarBadge;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={() => {
                const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigateToTab(route.key);
              }}
              style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.7 : 1 }]}
            >
              <View style={[styles.dot, { backgroundColor: focused ? colors.primary : 'transparent' }]} />
              <View style={styles.labelRow}>
                <Text variant={focused ? 'captionStrong' : 'caption'} color={focused ? 'primary' : 'muted'}>
                  {label}
                </Text>
                {badge !== undefined && badge !== 0 ? (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text variant="caption" color={colors.onPrimary} style={styles.badgeText}>
                      {String(badge)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  inner: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    height: TAB_BAR_HEIGHT,
  },
  tab: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
  },
});
