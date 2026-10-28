export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export type SpacingKey = keyof typeof spacing;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

export type RadiusKey = keyof typeof radii;

/** Minimum touch target per the accessibility rules. */
export const MIN_TOUCH_TARGET = 44;

/** Phone-width content column used on web so screens never stretch. */
export const MAX_CONTENT_WIDTH = 480;
