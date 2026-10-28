import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip, Text } from '@/components/ui';
import { useTheme } from '@/theme';

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
}

interface ChoiceGroupProps<T extends string> {
  label: string;
  options: readonly ChoiceOption<T>[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  /** Allow selecting more than one. When set, `value` is ignored in favor of `values`. */
  multi?: boolean;
  values?: readonly T[];
  onToggle?: (value: T) => void;
  footer?: ReactNode;
}

/** Labeled wrap of choice chips (design 02). Single-select by default; pass `multi` for preferences. */
export function ChoiceGroup<T extends string>({ label, options, value, onChange, multi = false, values = [], onToggle, footer }: ChoiceGroupProps<T>) {
  const { spacing } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label}>
      <Text variant="captionStrong" color="heading" style={{ marginBottom: spacing.sm }}>
        {label}
      </Text>
      <View style={[styles.wrap, { gap: spacing.sm }]}>
        {options.map((opt) => {
          const selected = multi ? values.includes(opt.value) : value === opt.value;
          return (
            <Chip
              key={opt.value}
              label={opt.label}
              variant="choice"
              selected={selected}
              onPress={() => (multi ? onToggle?.(opt.value) : onChange(opt.value))}
              accessibilityLabel={opt.label}
            />
          );
        })}
      </View>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
