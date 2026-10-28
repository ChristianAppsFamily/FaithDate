import { useId, useState } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string | null;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
}

/** Labeled text input with 44px touch height and an optional error line. */
export function TextField({ label, error, hint, containerStyle, style, onFocus, onBlur, editable = true, ...rest }: TextFieldProps) {
  const { colors, radii, spacing, typography } = useTheme();
  const id = useId();
  const [focused, setFocused] = useState(false);

  return (
    <View style={containerStyle}>
      <Text variant="captionStrong" color="heading" nativeID={`${id}-label`} style={{ marginBottom: spacing.sm }}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityLabelledBy={`${id}-label`}
        editable={editable}
        placeholderTextColor={colors.muted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          typography.body,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : focused ? colors.primary : colors.border,
            borderRadius: radii.lg,
            paddingHorizontal: spacing.lg,
            minHeight: MIN_TOUCH_TARGET + 8,
            opacity: editable ? 1 : 0.6,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="caption" color="danger" style={{ marginTop: spacing.xs }}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="muted" style={{ marginTop: spacing.xs }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    width: '100%',
  },
});
