import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { colorsByScheme, type ColorScheme, type ColorTokens } from './colors';
import { radii, spacing } from './spacing';
import { typography } from './typography';

export type ThemePreference = 'system' | ColorScheme;

export interface Theme {
  scheme: ColorScheme;
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
}

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps extends PropsWithChildren {
  preference: ThemePreference;
  onPreferenceChange: (preference: ThemePreference) => void;
}

export function ThemeProvider({ preference, onPreferenceChange, children }: ThemeProviderProps) {
  const systemScheme = useSystemColorScheme();
  // Static web rendering has no system scheme until hydration; default to light.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const scheme: ColorScheme =
    preference === 'system' ? (hydrated && systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: { scheme, colors: colorsByScheme[scheme], spacing, radii, typography },
      preference,
      setPreference: onPreferenceChange,
    }),
    [scheme, preference, onPreferenceChange],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx.theme;
}

export function useThemePreference(): Pick<ThemeContextValue, 'preference' | 'setPreference'> {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePreference must be used inside ThemeProvider');
  return { preference: ctx.preference, setPreference: ctx.setPreference };
}
