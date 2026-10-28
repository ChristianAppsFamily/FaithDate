/**
 * Royal Covenant palette (SPEC.md section 3).
 * Gold is an accent only: one gold element per screen, reserved for the
 * spouse-seeker badge, Lilies, and the Photo Exchange moment.
 */
export type ColorScheme = 'light' | 'dark';

export interface ColorTokens {
  /** Headings, pressed states, text on gold. */
  plumDeep: string;
  /** Heading text: plumDeep in light mode, light text in dark mode. */
  heading: string;
  /** Primary buttons, active tabs, links. */
  primary: string;
  /** Text placed on `primary` surfaces. */
  onPrimary: string;
  /** Borders, secondary accents, waveform. */
  lavender: string;
  /** Card backgrounds, chips, blurred photo frame. */
  lavenderTint: string;
  /** Spouse-seeker badge, Photo Exchange moment, Lilies. */
  gold: string;
  /** Text placed on gold is always plumDeep. */
  onGold: string;
  /** Body text. */
  text: string;
  /** Secondary text. */
  muted: string;
  /** Screen background. */
  background: string;
  /** Cards. */
  surface: string;
  /** Grouped sections, raised elements, inputs. */
  surfaceAlt: string;
  /** Hairline borders. */
  border: string;
  /** Destructive actions (End call, Report). Not in the spec table; added for design 11. */
  danger: string;
  onDanger: string;
  /** Dark immersive screens (welcome, match moment, reveal, voice date). */
  immersiveBackground: string;
  immersiveSurface: string;
  immersiveText: string;
  immersiveMuted: string;
}

export const lightColors: ColorTokens = {
  plumDeep: '#3A1A5C',
  heading: '#3A1A5C',
  primary: '#5B2A86',
  onPrimary: '#FFFFFF',
  lavender: '#B9A3E3',
  lavenderTint: '#EEE8FA',
  gold: '#E3B04B',
  onGold: '#3A1A5C',
  text: '#1C1726',
  muted: '#6E6880',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F4FC',
  border: '#E4DDF3',
  danger: '#C94B4B',
  onDanger: '#FFFFFF',
  immersiveBackground: '#3A1A5C',
  immersiveSurface: '#4D2676',
  immersiveText: '#FFFFFF',
  immersiveMuted: '#D9CCF0',
};

export const darkColors: ColorTokens = {
  plumDeep: '#3A1A5C',
  heading: '#F4F0FB',
  primary: '#B9A3E3',
  onPrimary: '#3A1A5C',
  lavender: '#8C74C2',
  lavenderTint: '#2A2140',
  gold: '#E3B04B',
  onGold: '#3A1A5C',
  text: '#F4F0FB',
  muted: '#A79FBA',
  background: '#14101E',
  surface: '#1F1830',
  surfaceAlt: '#2A2140',
  border: '#3A2F55',
  danger: '#E06A6A',
  onDanger: '#14101E',
  immersiveBackground: '#14101E',
  immersiveSurface: '#2A2140',
  immersiveText: '#F4F0FB',
  immersiveMuted: '#A79FBA',
};

export const colorsByScheme: Record<ColorScheme, ColorTokens> = {
  light: lightColors,
  dark: darkColors,
};
