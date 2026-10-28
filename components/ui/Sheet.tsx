import { X } from 'lucide-react-native';
import { type PropsWithChildren, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_CONTENT_WIDTH, useTheme } from '@/theme';

import { IconButton } from './IconButton';
import { Text } from './Text';

export interface SheetProps extends PropsWithChildren {
  visible: boolean;
  title: string;
  onClose: () => void;
  /** Optional line under the title. */
  subtitle?: string;
  footer?: ReactNode;
}

/** Bottom sheet over a dimmed backdrop. Used for filters and the Like sheet. */
export function Sheet({ visible, title, subtitle, onClose, footer, children }: SheetProps) {
  const { colors, radii, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable accessibilityLabel="Dismiss" accessibilityRole="button" onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(28, 23, 38, 0.45)' }]} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: radii.xxl,
              borderTopRightRadius: radii.xxl,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
              paddingHorizontal: spacing.xl,
              paddingTop: spacing.lg,
              maxWidth: MAX_CONTENT_WIDTH,
            },
          ]}
        >
          <View style={styles.handleWrap}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>
          <View style={[styles.header, { marginBottom: spacing.lg }]}>
            <View style={{ flex: 1 }}>
              <Text variant="heading" color="heading">
                {title}
              </Text>
              {subtitle ? (
                <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
            <IconButton accessibilityLabel="Close" icon={<X size={18} color={colors.heading} />} tone="outline" size={44} onPress={onClose} />
          </View>
          <View style={{ gap: spacing.lg }}>{children}</View>
          {footer ? <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>{footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxHeight: '88%',
  },
  handleWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
});
