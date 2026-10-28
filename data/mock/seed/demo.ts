/**
 * The demo account ("I already have an account") and the relationships around it,
 * mirroring designs 06, 08, 09, 11, 14. Grace is a verified spouse-seeker in Atlanta.
 */
import type {
  AppNotification,
  Like,
  Match,
  Message,
  Photo,
  PhotoExchange,
  Preferences,
  Profile,
  PromptAnswer,
  TalentLedgerEntry,
  VoiceClip,
  VoiceDate,
} from '@/data/types';

import { birthdateForAge, daysAgo, hoursAgo, hoursFromNow, minutesAgo } from '../time';

export const DEMO_USER_ID = 'me_grace';

export const demoProfile: Profile = {
  id: DEMO_USER_ID,
  first_name: 'Grace',
  birthdate: birthdateForAge(29, 3),
  city: 'Atlanta, GA',
  gender: 'female',
  seeking: 'male',
  faith: 'christian',
  denomination: 'non_denominational',
  church_attendance: 'weekly',
  home_church: 'Victory World Church',
  marital_history: 'never',
  marital_since_year: null,
  has_children: false,
  children_ages: [],
  wants_children: 'yes',
  intent: 'spouse',
  interests: ['Music', 'Fitness', 'Reading', 'Cooking'],
  core_values: 'Faith, family, and showing up for people.',
  verified: true,
  has_voice_intro: true,
  onboarding_step: 11,
  ghost_count: 0,
  created_at: daysAgo(12),
};

export const demoPreferences: Preferences = {
  profile_id: DEMO_USER_ID,
  age_min: 27,
  age_max: 38,
  distance_km: 80,
  denominations: ['non_denominational', 'baptist', 'methodist', 'pentecostal', 'ame', 'cogic'],
  open_to_divorced: true,
  open_to_children: true,
};

export const demoVoiceClips: VoiceClip[] = [
  {
    id: 'vc_me_intro',
    profile_id: DEMO_USER_ID,
    kind: 'intro',
    storage_path: 'placeholder:2',
    duration_s: 42,
    transcript: null,
    starter_label: 'Who I am',
  },
];

export const demoAnswers: PromptAnswer[] = [
  {
    id: 'pa_me_0',
    profile_id: DEMO_USER_ID,
    prompt_id: 'perfect_day',
    text: 'Early service, brunch with my sisters, then a long walk on the BeltLine before choir rehearsal.',
    voice_clip_id: null,
  },
  {
    id: 'pa_me_1',
    profile_id: DEMO_USER_ID,
    prompt_id: 'travel_anywhere',
    text: 'Charleston. Old churches, good shrimp, and a porch swing with my name on it.',
    voice_clip_id: null,
  },
  {
    id: 'pa_me_2',
    profile_id: DEMO_USER_ID,
    prompt_id: 'interesting_thing',
    text: 'I ran my first half marathon on Isaiah 40:31 and a playlist of nothing but gospel.',
    voice_clip_id: null,
  },
];

export const demoPhotos: Photo[] = [0, 1, 2].map((i) => ({
  id: `ph_me_${i}`,
  profile_id: DEMO_USER_ID,
  storage_path: `abstract:${DEMO_USER_ID}:${i}`,
  blurred_path: `blur:${DEMO_USER_ID}:${i}`,
  order: i,
}));

export const demoLedger: TalentLedgerEntry[] = [
  { id: 'tl_1', profile_id: DEMO_USER_ID, amount: 50, reason: 'complete_profile', created_at: daysAgo(12) },
  { id: 'tl_2', profile_id: DEMO_USER_ID, amount: 25, reason: 'add_voice_intro', created_at: daysAgo(12) },
  { id: 'tl_3', profile_id: DEMO_USER_ID, amount: 25, reason: 'get_verified', created_at: daysAgo(11) },
  { id: 'tl_4', profile_id: DEMO_USER_ID, amount: 5, reason: 'daily_check_in', created_at: daysAgo(1) },
];

/* Likes received (design 06): David sent a Lily, Samuel and Isaiah sent standard likes. */
export const demoLikes: Like[] = [
  {
    id: 'like_david',
    from_id: 'p_david',
    to_id: DEMO_USER_ID,
    target_type: 'intro',
    target_id: 'vc_me_intro',
    comment_text: 'Your laugh at the end made my day. Where do you serve at church?',
    comment_voice_id: null,
    is_lily: true,
    created_at: hoursAgo(3),
  },
  {
    id: 'like_samuel',
    from_id: 'p_samuel',
    to_id: DEMO_USER_ID,
    target_type: 'prompt_answer',
    target_id: 'pa_me_0',
    comment_text: 'Brunch with your sisters sounds like my family. Who wins the arguments?',
    comment_voice_id: null,
    is_lily: false,
    created_at: hoursAgo(9),
  },
  {
    id: 'like_isaiah',
    from_id: 'p_isaiah',
    to_id: DEMO_USER_ID,
    target_type: 'intro',
    target_id: 'vc_me_intro',
    comment_text: 'Choir on Wednesdays too? Alto or soprano?',
    comment_voice_id: null,
    is_lily: false,
    created_at: hoursAgo(26),
  },
  /* Likes Grace sent that led to matches, so each match has a "liked comment" to show. */
  {
    id: 'like_marcus_to_me',
    from_id: 'p_marcus',
    to_id: DEMO_USER_ID,
    target_type: 'prompt_answer',
    target_id: 'pa_me_0',
    comment_text: 'Brunch with your sisters sounds like my family. Who wins the arguments?',
    comment_voice_id: null,
    is_lily: false,
    created_at: hoursAgo(30),
  },
  {
    id: 'like_jonathan_to_me',
    from_id: 'p_jonathan',
    to_id: DEMO_USER_ID,
    target_type: 'intro',
    target_id: 'vc_me_intro',
    comment_text: 'You said BeltLine like it is a sacred place. It is.',
    comment_voice_id: null,
    is_lily: false,
    created_at: daysAgo(4),
  },
  {
    id: 'like_daniel_to_me',
    from_id: 'p_daniel',
    to_id: DEMO_USER_ID,
    target_type: 'prompt_answer',
    target_id: 'pa_me_2',
    comment_text: 'Isaiah 40:31 got me through nursing school. Which gospel playlist?',
    comment_voice_id: null,
    is_lily: false,
    created_at: hoursAgo(18),
  },
];

/* Matches (design 14): Marcus (open, fast lane ready), Jonathan (voice date tomorrow), Daniel (her move). */
export const demoMatches: Match[] = [
  {
    id: 'm_marcus',
    user_a: DEMO_USER_ID,
    user_b: 'p_marcus',
    created_at: hoursAgo(28),
    opened_by: DEMO_USER_ID,
    opened_at: hoursAgo(27),
    intro_invited_at: null,
    expires_at: null,
    extended: false,
    closed_at: null,
    closed_by: null,
  },
  {
    id: 'm_jonathan',
    user_a: DEMO_USER_ID,
    user_b: 'p_jonathan',
    created_at: daysAgo(4),
    opened_by: DEMO_USER_ID,
    opened_at: daysAgo(4),
    intro_invited_at: null,
    expires_at: null,
    extended: false,
    closed_at: null,
    closed_by: null,
  },
  {
    id: 'm_daniel',
    user_a: DEMO_USER_ID,
    user_b: 'p_daniel',
    created_at: hoursAgo(17),
    opened_by: null,
    opened_at: null,
    intro_invited_at: null,
    expires_at: hoursFromNow(31),
    extended: false,
    closed_at: null,
    closed_by: null,
  },
];

export const demoExchanges: PhotoExchange[] = [
  {
    match_id: 'm_marcus',
    requested_by: null,
    requested_at: null,
    a_agreed: false,
    b_agreed: false,
    a_msg_count: 3,
    b_msg_count: 2,
    fast_lane: true,
    exchanged_at: null,
  },
  {
    match_id: 'm_jonathan',
    requested_by: null,
    requested_at: null,
    a_agreed: false,
    b_agreed: false,
    a_msg_count: 6,
    b_msg_count: 7,
    fast_lane: true,
    exchanged_at: null,
  },
  {
    match_id: 'm_daniel',
    requested_by: null,
    requested_at: null,
    a_agreed: false,
    b_agreed: false,
    a_msg_count: 0,
    b_msg_count: 0,
    fast_lane: true,
    exchanged_at: null,
  },
];

export const demoChatVoiceClips: VoiceClip[] = [
  {
    id: 'vc_marcus_note_1',
    profile_id: 'p_marcus',
    kind: 'chat',
    storage_path: 'placeholder:1',
    duration_s: 34,
    transcript: null,
  },
];

/* Design 09 conversation with Marcus. */
export const demoMessages: Message[] = [
  {
    id: 'msg_m1',
    match_id: 'm_marcus',
    sender_id: DEMO_USER_ID,
    text: "My sisters, always. I'm the peacemaker. Tell me about you.",
    voice_clip_id: null,
    created_at: minutesAgo(48),
    kind: 'text',
  },
  {
    id: 'msg_m2',
    match_id: 'm_marcus',
    sender_id: 'p_marcus',
    text: null,
    voice_clip_id: 'vc_marcus_note_1',
    created_at: minutesAgo(31),
    kind: 'voice',
  },
  {
    id: 'msg_m3',
    match_id: 'm_marcus',
    sender_id: 'p_marcus',
    text: "That's a lot of me talking. Your turn, what's your favorite verse?",
    voice_clip_id: null,
    created_at: minutesAgo(30),
    kind: 'text',
  },
  {
    id: 'msg_m4',
    match_id: 'm_marcus',
    sender_id: DEMO_USER_ID,
    text: 'Isaiah 40:31. Ran my first half marathon on it.',
    voice_clip_id: null,
    created_at: minutesAgo(2),
    kind: 'text',
  },
  /* Jonathan: a longer, slower conversation. */
  {
    id: 'msg_j1',
    match_id: 'm_jonathan',
    sender_id: DEMO_USER_ID,
    text: 'Sweetwater Creek is my favorite hike too. Which trail?',
    voice_clip_id: null,
    created_at: daysAgo(4),
    kind: 'text',
  },
  {
    id: 'msg_j2',
    match_id: 'm_jonathan',
    sender_id: 'p_jonathan',
    text: 'Red trail, past the mill ruins. There is a rock I sit on and pray most Saturdays.',
    voice_clip_id: null,
    created_at: daysAgo(4),
    kind: 'text',
  },
  {
    id: 'msg_j3',
    match_id: 'm_jonathan',
    sender_id: DEMO_USER_ID,
    text: 'That is a better Saturday than most of mine. What do you pray about there?',
    voice_clip_id: null,
    created_at: daysAgo(3),
    kind: 'text',
  },
  {
    id: 'msg_j4',
    match_id: 'm_jonathan',
    sender_id: 'p_jonathan',
    text: 'Lately, for patience. And for whoever I am going to meet on this app, honestly.',
    voice_clip_id: null,
    created_at: daysAgo(3),
    kind: 'text',
  },
  {
    id: 'msg_j5',
    match_id: 'm_jonathan',
    sender_id: DEMO_USER_ID,
    text: 'Well. Here I am. Would you want to talk on a voice date this week?',
    voice_clip_id: null,
    created_at: daysAgo(2),
    kind: 'text',
  },
  {
    id: 'msg_j6',
    match_id: 'm_jonathan',
    sender_id: 'p_jonathan',
    text: 'Looking forward to talking tomorrow',
    voice_clip_id: null,
    created_at: hoursAgo(1),
    kind: 'text',
  },
];

export function demoVoiceDates(): VoiceDate[] {
  const tomorrow7pm = new Date();
  tomorrow7pm.setDate(tomorrow7pm.getDate() + 1);
  tomorrow7pm.setHours(19, 0, 0, 0);
  return [
    {
      id: 'vd_jonathan',
      match_id: 'm_jonathan',
      invited_by: DEMO_USER_ID,
      scheduled_for: tomorrow7pm.toISOString(),
      status: 'scheduled',
      started_at: null,
      ended_at: null,
      duration_s: 0,
      extended_count: 0,
      extension_votes: [],
    },
  ];
}

export const demoNotifications: AppNotification[] = [
  {
    id: 'n_1',
    profile_id: DEMO_USER_ID,
    type: 'lily',
    payload: { title: 'David sent you a Lily', body: 'He liked your voice intro.', from_id: 'p_david' },
    read_at: null,
    created_at: hoursAgo(3),
  },
  {
    id: 'n_2',
    profile_id: DEMO_USER_ID,
    type: 'message',
    payload: { title: 'Marcus sent a voice note', body: 'Tap to listen.', match_id: 'm_marcus' },
    read_at: null,
    created_at: minutesAgo(31),
  },
  {
    id: 'n_3',
    profile_id: DEMO_USER_ID,
    type: 'match',
    payload: { title: 'You matched with Daniel', body: 'Start when you are ready. You have 48 hours.', match_id: 'm_daniel' },
    read_at: hoursAgo(10),
    created_at: hoursAgo(17),
  },
  {
    id: 'n_4',
    profile_id: DEMO_USER_ID,
    type: 'voice_date_reminder',
    payload: { title: 'Voice date with Jonathan tomorrow', body: '7:00 PM. We will remind you an hour before.', match_id: 'm_jonathan' },
    read_at: hoursAgo(1),
    created_at: hoursAgo(2),
  },
];
