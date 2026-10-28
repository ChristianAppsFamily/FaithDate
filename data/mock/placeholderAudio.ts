import type { AudioSource } from 'expo-audio';

/* eslint-disable @typescript-eslint/no-require-imports */
const placeholders: Record<string, AudioSource> = {
  'placeholder:1': require('@/assets/audio/placeholder-1.wav'),
  'placeholder:2': require('@/assets/audio/placeholder-2.wav'),
  'placeholder:3': require('@/assets/audio/placeholder-3.wav'),
};
/* eslint-enable @typescript-eslint/no-require-imports */

/**
 * Resolves a voice clip storage path to something expo-audio can play.
 * Seeded clips use `placeholder:n`; user recordings are file or blob URIs.
 */
export function resolveAudioSource(storagePath: string): AudioSource {
  return placeholders[storagePath] ?? { uri: storagePath };
}
