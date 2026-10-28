/**
 * Faith rooms (SPEC.md section 8). Launch with Christian only; other rooms can be
 * added here later without a rebuild. Only entries with `enabled: true` are shown.
 */
export type FaithId = 'christian';

export type DenominationId =
  | 'non_denominational'
  | 'baptist'
  | 'catholic'
  | 'pentecostal'
  | 'methodist'
  | 'ame'
  | 'cogic'
  | 'lutheran'
  | 'presbyterian'
  | 'orthodox'
  | 'sda'
  | 'other';

export type AttendanceId = 'weekly' | 'most_weeks' | 'occasionally' | 'growing';

export interface Denomination {
  id: DenominationId;
  label: string;
}

export interface AttendanceLabel {
  id: AttendanceId;
  label: string;
  /** Short form used on cards, e.g. "Church weekly". */
  cardLabel: string;
}

export interface PromptDefinition {
  id: string;
  faith: FaithId;
  /** Full prompt shown in the answer editor. */
  text: string;
  /** Short label shown on cards and in likes, e.g. "My perfect day". */
  shortLabel: string;
  isDefault: boolean;
}

export interface FaithRoom {
  id: FaithId;
  displayName: string;
  tagline: string;
  enabled: boolean;
  denominations: readonly Denomination[];
  attendanceLabels: readonly AttendanceLabel[];
  sharedFaithPrompt: PromptDefinition;
  prompts: readonly PromptDefinition[];
  interests: readonly string[];
}

const christianPrompts: readonly PromptDefinition[] = [
  {
    id: 'perfect_day',
    faith: 'christian',
    text: 'Describe your perfect day. What activities do you enjoy and what makes you happiest?',
    shortLabel: 'My perfect day',
    isDefault: true,
  },
  {
    id: 'travel_anywhere',
    faith: 'christian',
    text: 'If you could travel anywhere right now, where would you go and why?',
    shortLabel: 'Where I would go',
    isDefault: true,
  },
  {
    id: 'interesting_thing',
    faith: 'christian',
    text: "What's one interesting thing most people don't know about you?",
    shortLabel: 'Something most people miss',
    isDefault: true,
  },
  {
    id: 'faith_everyday',
    faith: 'christian',
    text: 'What does your faith look like in your everyday life?',
    shortLabel: 'My faith day to day',
    isDefault: false,
  },
  {
    id: 'verse_holding',
    faith: 'christian',
    text: 'A verse or passage that has been holding you up lately, and why.',
    shortLabel: 'A verse holding me up',
    isDefault: false,
  },
  {
    id: 'sunday_looks_like',
    faith: 'christian',
    text: 'What does a typical Sunday look like for you?',
    shortLabel: 'My Sundays',
    isDefault: false,
  },
  {
    id: 'how_i_serve',
    faith: 'christian',
    text: 'How do you serve, at church or anywhere else?',
    shortLabel: 'How I serve',
    isDefault: false,
  },
  {
    id: 'marriage_means',
    faith: 'christian',
    text: 'What does a strong marriage look like to you?',
    shortLabel: 'What marriage means to me',
    isDefault: false,
  },
  {
    id: 'pray_about',
    faith: 'christian',
    text: 'Something you have been praying about this season.',
    shortLabel: 'What I am praying about',
    isDefault: false,
  },
  {
    id: 'family_tradition',
    faith: 'christian',
    text: 'A family tradition you hope to carry forward.',
    shortLabel: 'A tradition I want to keep',
    isDefault: false,
  },
  {
    id: 'grateful_for',
    faith: 'christian',
    text: 'Three things you are grateful for right now.',
    shortLabel: 'What I am grateful for',
    isDefault: false,
  },
  {
    id: 'faith_grew',
    faith: 'christian',
    text: 'A moment your faith grew, or was tested.',
    shortLabel: 'When my faith grew',
    isDefault: false,
  },
  {
    id: 'worship_song',
    faith: 'christian',
    text: 'The worship song you would put on repeat, and why.',
    shortLabel: 'My worship song',
    isDefault: false,
  },
  {
    id: 'ideal_first_date',
    faith: 'christian',
    text: 'Your idea of a good first date.',
    shortLabel: 'A good first date',
    isDefault: false,
  },
  {
    id: 'home_feels_like',
    faith: 'christian',
    text: 'What makes a house feel like a home to you?',
    shortLabel: 'What home feels like',
    isDefault: false,
  },
  {
    id: 'learning_now',
    faith: 'christian',
    text: 'Something you are learning right now, about God or about yourself.',
    shortLabel: 'What I am learning',
    isDefault: false,
  },
  {
    id: 'people_say',
    faith: 'christian',
    text: 'What your closest friends would say about you.',
    shortLabel: 'What my friends would say',
    isDefault: false,
  },
  {
    id: 'rest_well',
    faith: 'christian',
    text: 'How you rest well.',
    shortLabel: 'How I rest',
    isDefault: false,
  },
  {
    id: 'hospitality',
    faith: 'christian',
    text: 'The meal you would cook for someone you want to know better.',
    shortLabel: 'What I would cook for you',
    isDefault: false,
  },
  {
    id: 'hope_for_us',
    faith: 'christian',
    text: 'What you hope the two of you will build together.',
    shortLabel: 'What I hope we build',
    isDefault: false,
  },
  {
    id: 'laugh_at',
    faith: 'christian',
    text: 'What always makes you laugh.',
    shortLabel: 'What makes me laugh',
    isDefault: false,
  },
];

export const christianRoom: FaithRoom = {
  id: 'christian',
  displayName: 'Christian',
  tagline: 'Date by faith, not by sight.',
  enabled: true,
  denominations: [
    { id: 'non_denominational', label: 'Non-denominational' },
    { id: 'baptist', label: 'Baptist' },
    { id: 'catholic', label: 'Catholic' },
    { id: 'pentecostal', label: 'Pentecostal' },
    { id: 'methodist', label: 'Methodist' },
    { id: 'ame', label: 'AME' },
    { id: 'cogic', label: 'Church of God in Christ' },
    { id: 'lutheran', label: 'Lutheran' },
    { id: 'presbyterian', label: 'Presbyterian' },
    { id: 'orthodox', label: 'Orthodox' },
    { id: 'sda', label: 'Seventh-day Adventist' },
    { id: 'other', label: 'Other' },
  ],
  attendanceLabels: [
    { id: 'weekly', label: 'Weekly', cardLabel: 'Church weekly' },
    { id: 'most_weeks', label: 'Most weeks', cardLabel: 'Church most weeks' },
    { id: 'occasionally', label: 'Occasionally', cardLabel: 'Church occasionally' },
    { id: 'growing', label: 'Growing in faith', cardLabel: 'Growing in faith' },
  ],
  sharedFaithPrompt: christianPrompts.find((p) => p.id === 'faith_everyday') as PromptDefinition,
  prompts: christianPrompts,
  interests: [
    'Reading',
    'Sports',
    'Music',
    'Travel',
    'Cooking',
    'Hiking',
    'Worship',
    'Volunteering',
    'Movies',
    'Fitness',
    'Art',
    'Gardening',
    'Board games',
    'Photography',
    'Other',
  ],
};

export const faiths: readonly FaithRoom[] = [christianRoom];

export const enabledFaiths: readonly FaithRoom[] = faiths.filter((f) => f.enabled);

export function getFaith(id: FaithId): FaithRoom {
  const faith = faiths.find((f) => f.id === id);
  if (!faith) throw new Error(`Unknown faith room: ${id}`);
  return faith;
}

export function getDenominationLabel(faith: FaithId, id: DenominationId): string {
  return getFaith(faith).denominations.find((d) => d.id === id)?.label ?? 'Other';
}

export function getAttendance(faith: FaithId, id: AttendanceId): AttendanceLabel {
  const found = getFaith(faith).attendanceLabels.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown attendance: ${id}`);
  return found;
}

export function getPrompt(faith: FaithId, id: string): PromptDefinition | undefined {
  return getFaith(faith).prompts.find((p) => p.id === id);
}
