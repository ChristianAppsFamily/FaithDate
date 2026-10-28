/**
 * The one interface every screen reads through (SPEC.md section 10).
 * `data/mock/` implements it in Phase 1; `data/supabase/` will in Phase 3.
 * Rule: full photos are never returned before `exchanged_at` is set.
 */
import type { CoachContextType } from '@/config/auntMartha';
import type { TalentBundle } from '@/config/currency';
import type { OnboardingStepId } from '@/config/onboarding';
import type {
  AccountabilityPartner,
  AppNotification,
  CheckinOutcome,
  CoachMessage,
  CoachSettings,
  CoachUsage,
  DateActivity,
  DateCheckin,
  DatePlan,
  DateShare,
  Id,
  IsoDate,
  Like,
  LikeTargetType,
  Match,
  Message,
  PhotoExchange,
  Place,
  Preferences,
  Profile,
  PromptAnswer,
  Save,
  TalentLedgerEntry,
  Testimony,
  VisiblePhoto,
  VoiceClip,
  VoiceDate,
  VoiceDateFeedback,
  WhoPays,
} from './types';

/* ---------- View models (what screens render) ---------- */

export interface PromptAnswerView extends PromptAnswer {
  prompt_text: string;
  prompt_short_label: string;
  voice_clip: VoiceClip | null;
}

/** Everything a Discover card or profile preview needs. Photos are always blurred here. */
export interface ProfileCard {
  profile: Profile;
  age: number;
  denomination_label: string;
  attendance_label: string;
  voice_intro: VoiceClip | null;
  answers: PromptAnswerView[];
  testimony: Testimony | null;
  photos: VisiblePhoto[];
  is_saved: boolean;
  /** Set when the viewer has already liked something on this profile today. */
  liked_target: { target_type: LikeTargetType; target_id: Id } | null;
}

export interface BatchResult {
  date: IsoDate;
  cards: ProfileCard[];
  /** Cards not yet acted on (like, pass, or skip). */
  remaining: number;
  likes_left_today: number;
  next_refresh_at: IsoDate;
}

export interface BatchFilters {
  has_voice_intro?: boolean;
  denominations?: Profile['denomination'][];
  intent?: Profile['intent'];
  age_min?: number;
  age_max?: number;
}

export interface LikeInboxItem {
  like: Like;
  from: ProfileCard;
  /** Human label such as "Liked your voice intro" or "Liked your answer: My perfect day". */
  target_label: string;
  comment_voice: VoiceClip | null;
}

export type ChatStatus =
  | 'awaiting_her_move'
  | 'intro_invited'
  | 'open'
  | 'expired'
  | 'closed';

export interface MatchSummary {
  match: Match;
  other: ProfileCard;
  status: ChatStatus;
  /** Whether the current user is the one who must make the first move. */
  my_move: boolean;
  hours_left: number | null;
  can_extend: boolean;
  last_message: Message | null;
  unread_count: number;
  exchange: PhotoExchange;
  exchange_ready: boolean;
  exchange_pending_for_me: boolean;
  liked_comment: Like | null;
  next_voice_date: VoiceDate | null;
  open_date_plan: DatePlan | null;
}

export interface ChatThread extends MatchSummary {
  messages: Message[];
  voice_clips: Record<Id, VoiceClip>;
  voice_dates: VoiceDate[];
  date_plans: DatePlan[];
  photos_mine: VisiblePhoto[];
  photos_theirs: VisiblePhoto[];
  contact_info_blocked: boolean;
  can_plan_date: boolean;
  can_invite_voice_date: boolean;
}

export interface Wallet {
  balance: number;
  ledger: TalentLedgerEntry[];
  bundles: readonly TalentBundle[];
}

export interface CoachThread {
  messages: CoachMessage[];
  usage: CoachUsage;
  free_left: number;
  settings: CoachSettings;
}

export interface ProfileStrength {
  percent: number;
  /** Human-readable name of the next missing item, e.g. "a testimony". */
  next_missing: string | null;
}

export interface OnboardingDraft {
  profile: Partial<Profile>;
  preferences: Partial<Preferences>;
  answers: Partial<PromptAnswer>[];
  testimony: Partial<Testimony> | null;
  voice_intro: VoiceClip | null;
  photo_count: number;
  /** Last completed step, 0 to 10. */
  completed_step: number;
}

export interface SessionInfo {
  profile: Profile | null;
  onboarding_complete: boolean;
  resume_step: number;
}

export interface SendMessageInput {
  text?: string;
  voice_clip?: Pick<VoiceClip, 'storage_path' | 'duration_s'>;
}

export interface LikeInput {
  to_id: Id;
  target_type: LikeTargetType;
  target_id: Id;
  comment_text?: string;
  comment_voice?: Pick<VoiceClip, 'storage_path' | 'duration_s'>;
}

export interface DatePlanInput {
  activity: DateActivity;
  activity_other?: string;
  time_options: IsoDate[];
  place: Place;
  who_pays: WhoPays;
  share_with_partner: boolean;
}

export type DatePlanResponse =
  | { action: 'accept'; chosen_time: IsoDate }
  | { action: 'suggest_changes'; note: string }
  | { action: 'not_yet' };

export type VoiceDateResponse =
  | { action: 'join_now' }
  | { action: 'schedule'; scheduled_for: IsoDate }
  | { action: 'decline' };

export interface AskAuntMarthaInput {
  text: string;
  context_type: CoachContextType;
  match_id?: Id;
  /** Only set when the user tapped "Share with Aunt Martha" for this request. */
  shared_messages?: Message[];
}

export interface AskAuntMarthaResult {
  reply: CoachMessage;
  charged_talents: number;
  free_left: number;
}

export type DevEvent =
  | { type: 'incoming_like'; is_lily?: boolean }
  | { type: 'incoming_match' }
  | { type: 'incoming_message'; match_id?: Id }
  | { type: 'exchange_request'; match_id?: Id }
  | { type: 'voice_date_invite'; match_id?: Id }
  | { type: 'date_plan'; match_id?: Id }
  | { type: 'fast_forward_messages'; match_id: Id; count: number }
  | { type: 'reset_batch' }
  | { type: 'toggle_verified' }
  | { type: 'toggle_intent' }
  | { type: 'toggle_gender' }
  | { type: 'add_talents'; amount: number }
  | { type: 'reset_all' };

export type Unsubscribe = () => void;

/* ---------- The adapter ---------- */

export interface DataAdapter {
  /* Session and onboarding */
  getSession(): Promise<SessionInfo>;
  signInAsDemo(): Promise<SessionInfo>;
  signOut(): Promise<void>;
  getOnboardingDraft(): Promise<OnboardingDraft>;
  saveOnboardingStep(step: OnboardingStepId, patch: Partial<OnboardingDraft>): Promise<OnboardingDraft>;
  finishOnboarding(): Promise<{ profile: Profile; strength: ProfileStrength; talents_awarded: number }>;
  getMyCard(): Promise<ProfileCard>;
  getProfileStrength(): Promise<ProfileStrength>;
  saveProfile(patch: Partial<Profile>): Promise<Profile>;
  savePreferences(patch: Partial<Preferences>): Promise<Preferences>;
  savePromptAnswer(answer: Pick<PromptAnswer, 'prompt_id' | 'text'> & { id?: Id; voice_clip_id?: Id | null }): Promise<PromptAnswer>;
  saveVoiceIntro(clip: Pick<VoiceClip, 'storage_path' | 'duration_s'> & { starter_label?: string }): Promise<VoiceClip>;
  removeVoiceIntro(): Promise<void>;
  saveTestimony(testimony: Pick<Testimony, 'text' | 'voice_clip_id'>): Promise<Testimony>;
  completeVerification(): Promise<Profile>;

  /* Discover */
  getBatch(filters?: BatchFilters): Promise<BatchResult>;
  passProfile(profile_id: Id): Promise<void>;
  saveProfileBookmark(profile_id: Id): Promise<Save>;
  unsaveProfile(profile_id: Id): Promise<void>;
  getSaved(): Promise<ProfileCard[]>;
  getProfileCard(profile_id: Id): Promise<ProfileCard>;

  /* Likes */
  likeTarget(input: LikeInput): Promise<{ like: Like; match: Match | null }>;
  sendLily(input: LikeInput): Promise<{ like: Like; match: Match | null }>;
  getLikesInbox(): Promise<LikeInboxItem[]>;
  likeBack(like_id: Id): Promise<Match>;
  passLike(like_id: Id): Promise<void>;

  /* Matches and chat */
  getMatches(): Promise<MatchSummary[]>;
  getMatch(match_id: Id): Promise<MatchSummary>;
  getChat(match_id: Id): Promise<ChatThread>;
  openChat(match_id: Id): Promise<MatchSummary>;
  inviteIntro(match_id: Id): Promise<MatchSummary>;
  sendIntro(match_id: Id, input: SendMessageInput): Promise<Message>;
  extendWindow(match_id: Id): Promise<MatchSummary>;
  sendMessage(match_id: Id, input: SendMessageInput): Promise<Message>;
  markRead(match_id: Id): Promise<void>;
  closeMatch(match_id: Id, closing_message: string): Promise<void>;
  getCloseKindlyTemplates(): Promise<string[]>;

  /* Photo Exchange */
  requestExchange(match_id: Id): Promise<PhotoExchange>;
  respondToExchange(match_id: Id, agree: boolean): Promise<PhotoExchange>;
  getPhotos(match_id: Id): Promise<{ mine: VisiblePhoto[]; theirs: VisiblePhoto[]; exchanged_at: IsoDate | null }>;

  /* Wallet */
  getWallet(): Promise<Wallet>;
  purchaseBundle(bundle_id: string): Promise<Wallet>;
  claimDailyCheckIn(): Promise<Wallet>;

  /* Front Porch voice dates */
  inviteVoiceDate(match_id: Id, scheduled_for?: IsoDate): Promise<VoiceDate>;
  respondToVoiceDate(voice_date_id: Id, response: VoiceDateResponse): Promise<VoiceDate>;
  startVoiceDate(voice_date_id: Id): Promise<VoiceDate>;
  requestVoiceDateExtension(voice_date_id: Id): Promise<VoiceDate>;
  endVoiceDate(voice_date_id: Id, duration_s: number): Promise<VoiceDate>;
  submitVoiceDateFeedback(feedback: VoiceDateFeedback): Promise<void>;
  reportVoiceDate(voice_date_id: Id, reason: string): Promise<void>;

  /* Plan a date */
  searchPlaces(query: string, city: string): Promise<Place[]>;
  proposeDatePlan(match_id: Id, input: DatePlanInput): Promise<DatePlan>;
  respondToDatePlan(date_plan_id: Id, response: DatePlanResponse): Promise<DatePlan>;
  cancelDatePlan(date_plan_id: Id): Promise<DatePlan>;
  shareDatePlan(date_plan_id: Id, shared_with: DateShare['shared_with']): Promise<DateShare>;
  getPendingCheckins(): Promise<DatePlan[]>;
  submitDateCheckin(date_plan_id: Id, outcome: CheckinOutcome, note?: string): Promise<DateCheckin>;

  /* Aunt Martha */
  askAuntMartha(input: AskAuntMarthaInput): Promise<AskAuntMarthaResult>;
  getCoachThread(): Promise<CoachThread>;
  clearCoachThread(): Promise<void>;
  getCoachUsage(): Promise<CoachUsage & { free_left: number }>;
  setCoachNudges(on: boolean): Promise<CoachSettings>;

  /* Notifications, settings, safety */
  getNotifications(): Promise<AppNotification[]>;
  markNotificationRead(notification_id: Id): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
  getAccountabilityPartner(): Promise<AccountabilityPartner | null>;
  setAccountabilityPartner(partner: Pick<AccountabilityPartner, 'name' | 'email'> | null): Promise<AccountabilityPartner | null>;
  reportProfile(profile_id: Id, reason: string, match_id?: Id): Promise<void>;
  blockProfile(profile_id: Id): Promise<void>;

  /* Dev panel (prototype only) */
  devSimulate(event: DevEvent): Promise<void>;

  /** Screens re-read after any change. The mock emits on every mutation. */
  subscribe(listener: () => void): Unsubscribe;
}
