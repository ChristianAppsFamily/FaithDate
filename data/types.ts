/**
 * Data model (SPEC.md section 9). Mock data and the Supabase schema share these shapes.
 * Snake_case field names match the database columns so Phase 3 can map rows directly.
 */
import type { TalentReason } from '@/config/currency';
import type { AttendanceId, DenominationId, FaithId } from '@/config/faiths';
import type { CoachContextType } from '@/config/auntMartha';

export type Id = string;
export type IsoDate = string;

export type Gender = 'male' | 'female';
export type MaritalHistory = 'never' | 'divorced' | 'widowed';
export type WantsChildren = 'yes' | 'no' | 'open' | 'not_sure';
export type Intent = 'spouse' | 'purpose';

export interface Profile {
  id: Id;
  first_name: string;
  birthdate: IsoDate;
  city: string;
  gender: Gender;
  seeking: Gender;
  faith: FaithId;
  denomination: DenominationId;
  church_attendance: AttendanceId;
  home_church: string | null;
  marital_history: MaritalHistory;
  marital_since_year: number | null;
  has_children: boolean;
  children_ages: number[];
  wants_children: WantsChildren;
  intent: Intent;
  interests: string[];
  core_values: string;
  verified: boolean;
  has_voice_intro: boolean;
  /** 0 = not started, 1..10 = last completed step, 11 = finished. */
  onboarding_step: number;
  ghost_count: number;
  created_at: IsoDate;
}

export interface Preferences {
  profile_id: Id;
  age_min: number;
  age_max: number;
  distance_km: number;
  denominations: DenominationId[];
  open_to_divorced: boolean;
  open_to_children: boolean;
}

export type VoiceClipKind = 'intro' | 'prompt_answer' | 'testimony' | 'chat' | 'match_intro';

export interface VoiceClip {
  id: Id;
  profile_id: Id;
  kind: VoiceClipKind;
  /** Local file URI, remote URL, or a bundled placeholder key such as `placeholder:1`. */
  storage_path: string;
  duration_s: number;
  transcript: string | null;
  /** Optional starter the intro was recorded against (design 05 shows "Voice · Who I am"). */
  starter_label?: string;
}

export interface Prompt {
  id: Id;
  faith: FaithId;
  text: string;
  is_default: boolean;
}

export interface PromptAnswer {
  id: Id;
  profile_id: Id;
  prompt_id: Id;
  text: string;
  voice_clip_id: Id | null;
}

export interface Testimony {
  id: Id;
  profile_id: Id;
  text: string | null;
  voice_clip_id: Id | null;
}

export interface Photo {
  id: Id;
  profile_id: Id;
  /** Full image. Never returned by the adapter before `exchanged_at` is set. */
  storage_path: string;
  blurred_path: string;
  order: number;
}

/** What the UI receives. `full_path` is only present after an exchange. */
export interface VisiblePhoto {
  id: Id;
  order: number;
  blurred_path: string;
  full_path: string | null;
}

export interface Save {
  id: Id;
  profile_id: Id;
  saved_profile_id: Id;
  created_at: IsoDate;
}

export type LikeTargetType = 'intro' | 'prompt_answer';

export interface Like {
  id: Id;
  from_id: Id;
  to_id: Id;
  target_type: LikeTargetType;
  target_id: Id;
  comment_text: string | null;
  comment_voice_id: Id | null;
  is_lily: boolean;
  created_at: IsoDate;
}

export interface Match {
  id: Id;
  user_a: Id;
  user_b: Id;
  created_at: IsoDate;
  opened_by: Id | null;
  opened_at: IsoDate | null;
  intro_invited_at: IsoDate | null;
  expires_at: IsoDate | null;
  extended: boolean;
  closed_at: IsoDate | null;
  closed_by: Id | null;
}

export interface Message {
  id: Id;
  match_id: Id;
  sender_id: Id;
  text: string | null;
  voice_clip_id: Id | null;
  created_at: IsoDate;
  /** Structured cards rendered inside the chat (date plans, intro invites, system notes). */
  kind?: 'text' | 'voice' | 'system' | 'date_plan' | 'intro_invite';
  ref_id?: Id | null;
}

export interface PhotoExchange {
  match_id: Id;
  requested_by: Id | null;
  requested_at: IsoDate | null;
  a_agreed: boolean;
  b_agreed: boolean;
  a_msg_count: number;
  b_msg_count: number;
  fast_lane: boolean;
  exchanged_at: IsoDate | null;
}

export interface DailyBatch {
  id: Id;
  profile_id: Id;
  date: IsoDate;
  profile_ids: Id[];
}

export interface TalentLedgerEntry {
  id: Id;
  profile_id: Id;
  amount: number;
  reason: TalentReason;
  created_at: IsoDate;
}

export type NotificationType =
  | 'like'
  | 'lily'
  | 'match'
  | 'message'
  | 'exchange_request'
  | 'exchange_complete'
  | 'voice_date_invite'
  | 'voice_date_reminder'
  | 'date_plan'
  | 'date_reminder'
  | 'checkin';

export interface AppNotification {
  id: Id;
  profile_id: Id;
  type: NotificationType;
  payload: { title: string; body: string; match_id?: Id; from_id?: Id; ref_id?: Id };
  read_at: IsoDate | null;
  created_at: IsoDate;
}

export type VoiceDateStatus = 'invited' | 'scheduled' | 'live' | 'completed' | 'declined' | 'missed';

export interface VoiceDate {
  id: Id;
  match_id: Id;
  invited_by: Id;
  scheduled_for: IsoDate | null;
  status: VoiceDateStatus;
  started_at: IsoDate | null;
  ended_at: IsoDate | null;
  duration_s: number;
  extended_count: number;
  /** Who has tapped "Add 10 minutes" for the pending extension. */
  extension_votes: Id[];
}

export interface VoiceDateFeedback {
  voice_date_id: Id;
  profile_id: Id;
  talk_again: boolean;
  rating: number;
}

export type DateActivity = 'coffee' | 'brunch' | 'walk' | 'church_event' | 'dinner' | 'other';
export type WhoPays = 'treat' | 'split' | 'each';
export type DatePlanStatus = 'proposed' | 'changes_requested' | 'confirmed' | 'declined' | 'expired' | 'cancelled';

export interface DatePlan {
  id: Id;
  match_id: Id;
  proposed_by: Id;
  activity: DateActivity;
  activity_other: string | null;
  time_options: IsoDate[];
  chosen_time: IsoDate | null;
  place_name: string;
  place_address: string;
  place_id: string;
  who_pays: WhoPays;
  status: DatePlanStatus;
  change_note: string | null;
  confirmed_at: IsoDate | null;
  created_at: IsoDate;
}

export interface DateShare {
  id: Id;
  date_plan_id: Id;
  profile_id: Id;
  shared_with: 'partner' | 'friend';
  share_token: string;
  created_at: IsoDate;
}

export type CheckinOutcome = 'great' | 'good' | 'not_a_fit';

export interface DateCheckin {
  date_plan_id: Id;
  profile_id: Id;
  outcome: CheckinOutcome;
  note: string | null;
  created_at: IsoDate;
}

export interface CoachMessage {
  id: Id;
  profile_id: Id;
  role: 'user' | 'martha';
  text: string;
  context_type: CoachContextType;
  match_id: Id | null;
  flagged: boolean;
  prompt_version: string;
  created_at: IsoDate;
  /** Optional structured review card (design 13). */
  review?: {
    prompt_short_label: string;
    answer_excerpt: string;
    level: 'lovely' | 'small_change' | 'go_deeper';
    prompt_answer_id: Id;
  };
}

export interface CoachUsage {
  profile_id: Id;
  week_start: IsoDate;
  free_used: number;
  talents_spent: number;
}

export interface CoachSettings {
  profile_id: Id;
  nudges_on: boolean;
}

export interface AccountabilityPartner {
  id: Id;
  profile_id: Id;
  name: string;
  email: string;
  status: 'invited' | 'active' | 'removed';
}

export interface Report {
  id: Id;
  reporter_id: Id;
  reported_id: Id;
  match_id: Id | null;
  reason: string;
  created_at: IsoDate;
}

export interface Block {
  id: Id;
  blocker_id: Id;
  blocked_id: Id;
  created_at: IsoDate;
}

/** Public place returned by the mock place search (Google Places in Phase 3). */
export interface Place {
  id: string;
  name: string;
  address: string;
  city: string;
  category: 'coffee' | 'brunch' | 'park' | 'church' | 'restaurant' | 'other';
}
