/**
 * Onboarding structure and copy (SPEC.md section 5, designs 01 to 04).
 */
export type OnboardingStepId =
  | 'welcome'
  | 'basics'
  | 'faith'
  | 'life_stage'
  | 'intent'
  | 'verify'
  | 'photos'
  | 'voice_intro'
  | 'story'
  | 'preferences';

export interface OnboardingStepDefinition {
  /** 1-based step number shown as "Step n of 10". */
  number: number;
  id: OnboardingStepId;
  title: string;
  subtitle: string;
}

export const onboardingSteps: readonly OnboardingStepDefinition[] = [
  { number: 1, id: 'welcome', title: 'How FaithDate works', subtitle: 'Three things that make this different.' },
  { number: 2, id: 'basics', title: 'The basics', subtitle: 'Only your first name and age are shown to others.' },
  { number: 3, id: 'faith', title: 'Your faith', subtitle: 'Where you worship and how often. Nothing is judged here.' },
  { number: 4, id: 'life_stage', title: 'Your life stage', subtitle: 'This helps us introduce you to people on the same path.' },
  { number: 5, id: 'intent', title: 'What you are here for', subtitle: 'Shown on your profile so no one has to guess.' },
  { number: 6, id: 'verify', title: 'Verify it is you', subtitle: 'A quick selfie check keeps FaithDate honest.' },
  { number: 7, id: 'photos', title: 'Your photos', subtitle: 'Your photos stay private until you and a match both choose to exchange.' },
  { number: 8, id: 'voice_intro', title: 'Let them hear who you are', subtitle: "Record 30 to 90 seconds. Pick a starter if you're not sure what to say." },
  { number: 9, id: 'story', title: 'Your story', subtitle: 'Answer three prompts in your own words.' },
  { number: 10, id: 'preferences', title: 'Who you hope to meet', subtitle: 'You can change these anytime.' },
];

export const introCards = [
  {
    id: 'hear',
    title: 'Hear who they are',
    body: 'Every profile starts with a voice and a story, not a photo.',
  },
  {
    id: 'like',
    title: 'Like what they said',
    body: 'Every like points at one answer or the voice intro, so they know what moved you.',
  },
  {
    id: 'exchange',
    title: "Exchange photos when you're both ready",
    body: 'Photos stay private until you both agree. Then you see each other at the same moment.',
  },
] as const;

export const voiceIntroStarters = [
  { id: 'who_i_am', label: 'Who I am', hint: "Tell them your name, where you're from, and what makes you laugh." },
  { id: 'faith_day_to_day', label: 'My faith day to day', hint: 'What does following Jesus look like on an ordinary Tuesday?' },
  { id: 'looking_for', label: "What I'm looking for", hint: 'Describe the kind of marriage you are praying for, not a checklist.' },
] as const;

export type VoiceIntroStarterId = (typeof voiceIntroStarters)[number]['id'];

export const onboardingCopy = {
  welcomeHeadline: 'Date by faith,\nnot by sight.',
  welcomeSub: 'Meet Christian singles who are serious about marriage. Hear who they are before you ever see them.',
  createProfile: 'Create your profile',
  haveAccount: 'I already have an account',
  continue: 'Continue',
  skipForNow: 'Skip for now',
  voiceNudge: 'Profiles with a voice intro get noticed more.',
  privacyNote: 'You choose what shows on your profile. Matching uses these answers either way.',
  photosNote: 'Your photos stay private until you and a match both choose to exchange.',
  verifyNote: 'Verified spouse-seekers can exchange photos as soon as a chat opens.',
  under18: 'You must be 18 or older to use FaithDate.',
  finishTitle: 'Your profile is ready',
  finishSub: "Here's how others will see you.",
  finishReachFull: (missing: string) => `Add ${missing} to reach 100%.`,
  seeTodaysProfiles: "See today's profiles",
  talentsReward: 'For completing your profile',
} as const;
