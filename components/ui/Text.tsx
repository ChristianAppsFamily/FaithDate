import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme, type ColorTokens, type TypeVariant } from '@/theme';

export interface TextProps extends RNTextProps {
  variant?: TypeVariant;
  /** Color token name, or any explicit color string. */
  color?: keyof ColorTokens | (string & {});
  align?: TextStyle['textAlign'];
}

export function Text({ variant = 'body', color = 'text', align, style, ...rest }: TextProps) {
  const theme = useTheme();
  const resolved = color in theme.colors ? theme.colors[color as keyof ColorTokens] : color;
  return <RNText {...rest} style={[theme.typography[variant], { color: resolved, textAlign: align }, style]} />;
}
