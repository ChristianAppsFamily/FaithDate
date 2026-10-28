import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { adapter, type Profile, type SessionInfo } from '@/data';
import type { ThemePreference } from '@/theme';

const THEME_KEY = 'faithdate.theme';

interface SessionState {
  status: 'loading' | 'ready';
  profile: Profile | null;
  onboardingComplete: boolean;
  resumeStep: number;
  themePreference: ThemePreference;
  /** Loads the session (and theme preference) from storage. Safe to call more than once. */
  hydrate: () => Promise<void>;
  applySession: (info: SessionInfo) => void;
  setThemePreference: (preference: ThemePreference) => void;
}

function isPreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export const useSession = create<SessionState>((set, get) => ({
  status: 'loading',
  profile: null,
  onboardingComplete: false,
  resumeStep: 1,
  themePreference: 'system',
  hydrate: async () => {
    const [info, storedTheme] = await Promise.all([
      adapter.getSession(),
      get().status === 'loading' ? AsyncStorage.getItem(THEME_KEY).catch(() => null) : Promise.resolve(null),
    ]);
    set({
      status: 'ready',
      profile: info.profile,
      onboardingComplete: info.onboarding_complete,
      resumeStep: info.resume_step,
      ...(isPreference(storedTheme) ? { themePreference: storedTheme } : {}),
    });
  },
  applySession: (info) =>
    set({ status: 'ready', profile: info.profile, onboardingComplete: info.onboarding_complete, resumeStep: info.resume_step }),
  setThemePreference: (preference) => {
    set({ themePreference: preference });
    AsyncStorage.setItem(THEME_KEY, preference).catch(() => undefined);
  },
}));

/** Keeps the session store in sync whenever the adapter reports a change. */
adapter.subscribe(() => {
  void useSession.getState().hydrate();
});
