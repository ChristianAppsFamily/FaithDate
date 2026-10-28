import type { TextStyle } from 'react-native';

/** Font family names as registered with expo-font. */
export const fonts = {
  display: 'Sora_700Bold',
  displaySemi: 'Sora_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export type TypeVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'captionStrong'
  | 'overline'
  | 'button';

export const typography: Record<TypeVariant, TextStyle> = {
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 46, letterSpacing: -0.8 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, letterSpacing: -0.5 },
  heading: { fontFamily: fonts.display, fontSize: 24, lineHeight: 30, letterSpacing: -0.3 },
  subheading: { fontFamily: fonts.displaySemi, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.bodySemi, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  captionStrong: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  overline: { fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 16, letterSpacing: 1, textTransform: 'uppercase' },
  button: { fontFamily: fonts.bodySemi, fontSize: 16, lineHeight: 20 },
};
