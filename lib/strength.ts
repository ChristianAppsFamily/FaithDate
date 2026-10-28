import type { ProfileStrength } from '@/data/adapter';
import type { Profile, PromptAnswer, Testimony, VoiceClip } from '@/data/types';

interface StrengthInput {
  profile: Partial<Profile>;
  answers: Pick<PromptAnswer, 'text'>[];
  voice_intro: VoiceClip | null;
  testimony: Pick<Testimony, 'text' | 'voice_clip_id'> | null;
  photo_count: number;
}

interface StrengthItem {
  weight: number;
  missingLabel: string;
  done: boolean;
}

/**
 * Profile strength shown on the finish screen (design 04). Weights sum to 100.
 * With everything but a testimony complete, the result is 90%.
 */
export function computeStrength(input: StrengthInput): ProfileStrength {
  const { profile } = input;
  const items: StrengthItem[] = [
    { weight: 15, missingLabel: 'your basics', done: Boolean(profile.first_name && profile.birthdate && profile.city) },
    { weight: 10, missingLabel: 'your faith details', done: Boolean(profile.denomination && profile.church_attendance) },
    { weight: 10, missingLabel: 'your intent', done: Boolean(profile.intent) },
    { weight: 10, missingLabel: 'at least two photos', done: input.photo_count >= 2 },
    { weight: 20, missingLabel: 'a voice intro', done: input.voice_intro !== null },
    { weight: 15, missingLabel: 'three prompt answers', done: input.answers.filter((a) => a.text.trim().length > 0).length >= 3 },
    { weight: 10, missingLabel: 'a testimony', done: Boolean(input.testimony && (input.testimony.text || input.testimony.voice_clip_id)) },
    { weight: 10, missingLabel: 'verification', done: profile.verified === true },
  ];
  const percent = items.reduce((sum, item) => sum + (item.done ? item.weight : 0), 0);
  const next = items.find((item) => !item.done);
  return { percent, next_missing: next ? next.missingLabel : null };
}
