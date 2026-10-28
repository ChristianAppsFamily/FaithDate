/**
 * Mock implementation of the data adapter (SPEC.md section 10).
 * Enforces the same rules the Supabase implementation will: women-first windows,
 * exchange eligibility, photo gating, Talent guardrails, and contact-info blocking.
 */
import { auntMartha } from '@/config/auntMartha';
import { currency, type TalentReason } from '@/config/currency';
import { getAttendance, getDenominationLabel, getPrompt } from '@/config/faiths';
import type { OnboardingStepId } from '@/config/onboarding';
import { rules } from '@/config/rules';
import { track } from '@/lib/analytics';
import { detectContactInfo } from '@/lib/contactFilter';
import { computeStrength } from '@/lib/strength';

import type {
  AskAuntMarthaInput,
  AskAuntMarthaResult,
  BatchFilters,
  BatchResult,
  ChatStatus,
  ChatThread,
  CoachThread,
  DataAdapter,
  DatePlanInput,
  DatePlanResponse,
  DevEvent,
  LikeInboxItem,
  LikeInput,
  MatchSummary,
  OnboardingDraft,
  ProfileCard,
  ProfileStrength,
  PromptAnswerView,
  SendMessageInput,
  SessionInfo,
  Unsubscribe,
  VoiceDateResponse,
  Wallet,
} from '../adapter';
import type {
  AccountabilityPartner,
  AppNotification,
  CheckinOutcome,
  CoachMessage,
  CoachSettings,
  CoachUsage,
  DateCheckin,
  DatePlan,
  DateShare,
  Id,
  IsoDate,
  Like,
  Match,
  Message,
  NotificationType,
  PhotoExchange,
  Place,
  Preferences,
  Profile,
  PromptAnswer,
  Save,
  Testimony,
  VisiblePhoto,
  VoiceClip,
  VoiceDate,
  VoiceDateFeedback,
} from '../types';
import { cannedReplies, closeKindlyTemplates, profileReviewCard } from './seed/auntMartha';
import { DEMO_USER_ID } from './seed/demo';
import { searchSeedPlaces } from './seed/places';
import { emptyDraft, MockStore, type MockState } from './store';
import {
  ageFromBirthdate,
  batchDateFor,
  hoursFromNow,
  hoursUntil,
  localDateKey,
  nextBatchRefresh,
  nowIso,
  weekStartFor,
} from './time';

export class AdapterError extends Error {
  constructor(
    public readonly code:
      | 'not_signed_in'
      | 'not_found'
      | 'women_first'
      | 'contact_info_blocked'
      | 'insufficient_talents'
      | 'no_likes_left'
      | 'not_allowed'
      | 'already_extended'
      | 'exchange_required'
      | 'open_plan_exists',
    message: string,
  ) {
    super(message);
    this.name = 'AdapterError';
  }
}

let counter = 0;
function uid(prefix: string): Id {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const autoReplyPool = [
  'That is a good question. Give me a second to answer it properly.',
  'Ha, I was hoping you would ask that.',
  'Honestly? I have been thinking about that all week.',
  'Okay, now I need to hear the story behind that.',
  'Same. My mother would say the exact same thing.',
  'You are easy to talk to, you know that?',
];

export class MockAdapter implements DataAdapter {
  private readonly store = new MockStore();
  private timers = new Set<ReturnType<typeof setTimeout>>();

  /* ---------- helpers ---------- */

  private async state(): Promise<MockState> {
    await this.store.ready();
    return this.store.get();
  }

  private meId(state: MockState): Id {
    const id = state.session.current_user_id;
    if (!id) throw new AdapterError('not_signed_in', 'No one is signed in.');
    return id;
  }

  private profile(state: MockState, id: Id): Profile {
    const p = state.profiles.find((x) => x.id === id);
    if (!p) throw new AdapterError('not_found', `Profile ${id} not found.`);
    return p;
  }

  private match(state: MockState, id: Id): Match {
    const m = state.matches.find((x) => x.id === id);
    if (!m) throw new AdapterError('not_found', `Match ${id} not found.`);
    return m;
  }

  private exchange(state: MockState, matchId: Id): PhotoExchange {
    let ex = state.photo_exchanges.find((x) => x.match_id === matchId);
    if (!ex) {
      ex = {
        match_id: matchId,
        requested_by: null,
        requested_at: null,
        a_agreed: false,
        b_agreed: false,
        a_msg_count: 0,
        b_msg_count: 0,
        fast_lane: false,
        exchanged_at: null,
      };
      state.photo_exchanges.push(ex);
    }
    return ex;
  }

  private otherId(match: Match, me: Id): Id {
    return match.user_a === me ? match.user_b : match.user_a;
  }

  private balance(state: MockState, id: Id): number {
    return state.talent_ledger.filter((t) => t.profile_id === id).reduce((s, t) => s + t.amount, 0);
  }

  private addLedger(state: MockState, id: Id, amount: number, reason: TalentReason): void {
    state.talent_ledger.push({ id: uid('tl'), profile_id: id, amount, reason, created_at: nowIso() });
  }

  private spend(state: MockState, id: Id, amount: number, reason: TalentReason): void {
    if (this.balance(state, id) < amount) {
      throw new AdapterError('insufficient_talents', `You need ${amount} ${currency.name} for that.`);
    }
    this.addLedger(state, id, -amount, reason);
  }

  private notify(state: MockState, to: Id, type: NotificationType, payload: AppNotification['payload']): void {
    state.notifications.unshift({ id: uid('n'), profile_id: to, type, payload, read_at: null, created_at: nowIso() });
  }

  private visiblePhotos(state: MockState, profileId: Id, exchanged: boolean): VisiblePhoto[] {
    return state.photos
      .filter((p) => p.profile_id === profileId)
      .sort((a, b) => a.order - b.order)
      .map((p) => ({ id: p.id, order: p.order, blurred_path: p.blurred_path, full_path: exchanged ? p.storage_path : null }));
  }

  private answerViews(state: MockState, profileId: Id): PromptAnswerView[] {
    return state.prompt_answers
      .filter((a) => a.profile_id === profileId)
      .map((a) => {
        const prompt = getPrompt('christian', a.prompt_id);
        return {
          ...a,
          prompt_text: prompt?.text ?? a.prompt_id,
          prompt_short_label: prompt?.shortLabel ?? a.prompt_id,
          voice_clip: a.voice_clip_id ? (state.voice_clips.find((v) => v.id === a.voice_clip_id) ?? null) : null,
        };
      });
  }

  /** Builds a card. Photos here are always blurred: Discover never shows full photos. */
  private card(state: MockState, profileId: Id, viewerId: Id | null): ProfileCard {
    const profile = this.profile(state, profileId);
    const todayKey = localDateKey(new Date());
    const liked = viewerId
      ? state.likes.find((l) => l.from_id === viewerId && l.to_id === profileId && l.created_at.slice(0, 10) === todayKey)
      : undefined;
    return {
      profile,
      age: ageFromBirthdate(profile.birthdate),
      denomination_label: getDenominationLabel(profile.faith, profile.denomination),
      attendance_label: getAttendance(profile.faith, profile.church_attendance).cardLabel,
      voice_intro: state.voice_clips.find((v) => v.profile_id === profileId && v.kind === 'intro') ?? null,
      answers: this.answerViews(state, profileId),
      testimony: state.testimonies.find((t) => t.profile_id === profileId) ?? null,
      photos: this.visiblePhotos(state, profileId, false),
      is_saved: viewerId ? state.saves.some((s) => s.profile_id === viewerId && s.saved_profile_id === profileId) : false,
      liked_target: liked ? { target_type: liked.target_type, target_id: liked.target_id } : null,
    };
  }

  private chatStatus(match: Match): ChatStatus {
    if (match.closed_at) return 'closed';
    if (match.opened_at) return 'open';
    if (match.expires_at && new Date(match.expires_at).getTime() < Date.now()) return 'expired';
    if (match.intro_invited_at) return 'intro_invited';
    return 'awaiting_her_move';
  }

  private isWoman(state: MockState, id: Id): boolean {
    return this.profile(state, id).gender === 'female';
  }

  private exchangeReady(ex: PhotoExchange): boolean {
    const n = rules.photoExchange.messagesPerPersonStandard;
    return ex.fast_lane || (ex.a_msg_count >= n && ex.b_msg_count >= n);
  }

  private summary(state: MockState, match: Match, me: Id): MatchSummary {
    const otherId = this.otherId(match, me);
    const status = this.chatStatus(match);
    const ex = this.exchange(state, match.id);
    const msgs = state.messages.filter((m) => m.match_id === match.id);
    const last = msgs.length > 0 ? msgs[msgs.length - 1]! : null;
    const myMove = (status === 'awaiting_her_move' || status === 'intro_invited') && this.isWoman(state, me);
    const requestedByOther = ex.requested_by !== null && ex.requested_by !== me && ex.exchanged_at === null;
    const liked = state.likes
      .filter((l) => l.from_id === otherId && l.to_id === me && (l.comment_text || l.comment_voice_id))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
    const voiceDates = state.voice_dates.filter((v) => v.match_id === match.id);
    const nextVoiceDate =
      voiceDates
        .filter((v) => v.status === 'invited' || v.status === 'scheduled' || v.status === 'live')
        .sort((a, b) => (a.scheduled_for ?? '').localeCompare(b.scheduled_for ?? ''))[0] ?? null;
    const openPlan =
      state.date_plans.find(
        (d) => d.match_id === match.id && (d.status === 'proposed' || d.status === 'changes_requested' || d.status === 'confirmed'),
      ) ?? null;
    return {
      match,
      other: this.card(state, otherId, me),
      status,
      my_move: myMove,
      hours_left: match.opened_at || !match.expires_at ? null : hoursUntil(match.expires_at),
      can_extend: !match.opened_at && !match.extended && status !== 'expired' && status !== 'closed',
      last_message: last,
      unread_count: state.notifications.filter((n) => n.profile_id === me && n.payload.match_id === match.id && n.type === 'message' && !n.read_at).length,
      exchange: ex,
      exchange_ready: this.exchangeReady(ex) && ex.exchanged_at === null && status === 'open',
      exchange_pending_for_me: requestedByOther,
      liked_comment: liked ?? null,
      next_voice_date: nextVoiceDate,
      open_date_plan: openPlan,
    };
  }

  private myDraftStrength(state: MockState): ProfileStrength {
    const d = state.session.draft;
    return computeStrength({
      profile: d.profile,
      answers: d.answers.map((a) => ({ text: a.text ?? '' })),
      voice_intro: d.voice_intro,
      testimony: d.testimony ? { text: d.testimony.text ?? null, voice_clip_id: d.testimony.voice_clip_id ?? null } : null,
      photo_count: d.photo_count,
    });
  }

  private strengthFor(state: MockState, id: Id): ProfileStrength {
    const profile = this.profile(state, id);
    const testimony = state.testimonies.find((t) => t.profile_id === id) ?? null;
    return computeStrength({
      profile,
      answers: state.prompt_answers.filter((a) => a.profile_id === id),
      voice_intro: state.voice_clips.find((v) => v.profile_id === id && v.kind === 'intro') ?? null,
      testimony,
      photo_count: state.photos.filter((p) => p.profile_id === id).length,
    });
  }

  private later(ms: number, fn: () => void): void {
    const t = setTimeout(() => {
      this.timers.delete(t);
      fn();
    }, ms);
    this.timers.add(t);
  }

  private pushMessage(state: MockState, match: Match, senderId: Id, input: SendMessageInput, kind: Message['kind'] = 'text'): Message {
    let voiceId: Id | null = null;
    if (input.voice_clip) {
      const clip: VoiceClip = {
        id: uid('vc'),
        profile_id: senderId,
        kind: 'chat',
        storage_path: input.voice_clip.storage_path,
        duration_s: input.voice_clip.duration_s,
        transcript: null,
      };
      state.voice_clips.push(clip);
      voiceId = clip.id;
      kind = 'voice';
    }
    const msg: Message = {
      id: uid('msg'),
      match_id: match.id,
      sender_id: senderId,
      text: input.text ?? null,
      voice_clip_id: voiceId,
      created_at: nowIso(),
      kind,
    };
    state.messages.push(msg);
    const ex = this.exchange(state, match.id);
    const weight = voiceId ? rules.photoExchange.voiceNoteMessageWeight : 1;
    if (senderId === match.user_a) ex.a_msg_count += weight;
    else ex.b_msg_count += weight;
    return msg;
  }

  private scheduleAutoReply(matchId: Id, otherId: Id): void {
    this.later(2500, () => {
      this.store.update((s) => {
        if (!s.session.auto_reply) return;
        const match = s.matches.find((m) => m.id === matchId);
        if (!match || match.closed_at) return;
        const text = autoReplyPool[hash(matchId + s.messages.length) % autoReplyPool.length]!;
        this.pushMessage(s, match, otherId, { text });
        const me = s.session.current_user_id;
        if (me) {
          const other = this.profile(s, otherId);
          this.notify(s, me, 'message', { title: `${other.first_name} replied`, body: text, match_id: matchId });
        }
      });
    });
  }

  /* ---------- session and onboarding ---------- */

  async getSession(): Promise<SessionInfo> {
    const s = await this.state();
    const id = s.session.current_user_id;
    const profile = id ? (s.profiles.find((p) => p.id === id) ?? null) : null;
    return {
      profile,
      onboarding_complete: profile !== null && profile.onboarding_step > rules.onboarding.totalSteps,
      resume_step: s.session.draft.completed_step + 1,
    };
  }

  async signInAsDemo(): Promise<SessionInfo> {
    await this.store.ready();
    this.store.update((s) => {
      s.session.current_user_id = DEMO_USER_ID;
      s.session.draft = emptyDraft();
    });
    return this.getSession();
  }

  async signOut(): Promise<void> {
    await this.store.ready();
    this.store.update((s) => {
      s.session.current_user_id = null;
    });
  }

  async getOnboardingDraft(): Promise<OnboardingDraft> {
    const s = await this.state();
    return s.session.draft;
  }

  async saveOnboardingStep(step: OnboardingStepId, patch: Partial<OnboardingDraft>): Promise<OnboardingDraft> {
    await this.store.ready();
    if (step === 'welcome' && this.store.get().session.draft.completed_step === 0) track('onboarding_started');
    this.store.update((s) => {
      const d = s.session.draft;
      s.session.draft = {
        ...d,
        ...patch,
        profile: { ...d.profile, ...(patch.profile ?? {}) },
        preferences: { ...d.preferences, ...(patch.preferences ?? {}) },
        completed_step: Math.max(d.completed_step, patch.completed_step ?? d.completed_step),
      };
    });
    track('onboarding_step_completed', { step });
    return this.store.get().session.draft;
  }

  async finishOnboarding(): Promise<{ profile: Profile; strength: ProfileStrength; talents_awarded: number }> {
    const s = await this.state();
    const d = s.session.draft;
    const id = uid('me');
    const profile: Profile = {
      id,
      first_name: d.profile.first_name ?? 'Friend',
      birthdate: d.profile.birthdate ?? '1995-01-01',
      city: d.profile.city ?? '',
      gender: d.profile.gender ?? 'female',
      seeking: d.profile.gender === 'male' ? 'female' : 'male',
      faith: 'christian',
      denomination: d.profile.denomination ?? 'non_denominational',
      church_attendance: d.profile.church_attendance ?? 'weekly',
      home_church: d.profile.home_church ?? null,
      marital_history: d.profile.marital_history ?? 'never',
      marital_since_year: d.profile.marital_since_year ?? null,
      has_children: d.profile.has_children ?? false,
      children_ages: d.profile.children_ages ?? [],
      wants_children: d.profile.wants_children ?? 'open',
      intent: d.profile.intent ?? 'spouse',
      interests: d.profile.interests ?? [],
      core_values: d.profile.core_values ?? '',
      verified: d.profile.verified ?? false,
      has_voice_intro: d.voice_intro !== null,
      onboarding_step: rules.onboarding.totalSteps + 1,
      ghost_count: 0,
      created_at: nowIso(),
    };
    const strength = this.myDraftStrength(s);
    let awarded = currency.earn.completeProfile;
    this.store.update((st) => {
      st.profiles.push(profile);
      st.preferences.push({
        profile_id: id,
        age_min: d.preferences.age_min ?? 25,
        age_max: d.preferences.age_max ?? 40,
        distance_km: d.preferences.distance_km ?? 80,
        denominations: d.preferences.denominations ?? [],
        open_to_divorced: d.preferences.open_to_divorced ?? true,
        open_to_children: d.preferences.open_to_children ?? true,
      });
      d.answers.forEach((a, i) => {
        if (a.prompt_id && a.text) {
          st.prompt_answers.push({ id: `pa_${id}_${i}`, profile_id: id, prompt_id: a.prompt_id, text: a.text, voice_clip_id: a.voice_clip_id ?? null });
        }
      });
      if (d.voice_intro) {
        st.voice_clips.push({ ...d.voice_intro, id: `vc_${id}_intro`, profile_id: id, kind: 'intro' });
        awarded += currency.earn.addVoiceIntro;
        this.addLedger(st, id, currency.earn.addVoiceIntro, 'add_voice_intro');
      }
      if (d.testimony && (d.testimony.text || d.testimony.voice_clip_id)) {
        st.testimonies.push({ id: `t_${id}`, profile_id: id, text: d.testimony.text ?? null, voice_clip_id: d.testimony.voice_clip_id ?? null });
      }
      for (let i = 0; i < d.photo_count; i++) {
        st.photos.push({ id: `ph_${id}_${i}`, profile_id: id, storage_path: `abstract:${id}:${i}`, blurred_path: `blur:${id}:${i}`, order: i });
      }
      this.addLedger(st, id, currency.earn.completeProfile, 'complete_profile');
      if (profile.verified) {
        awarded += currency.earn.getVerified;
        this.addLedger(st, id, currency.earn.getVerified, 'get_verified');
      }
      st.session.current_user_id = id;
      st.session.draft = emptyDraft();
    });
    track('onboarding_finished', { strength: strength.percent });
    return { profile, strength, talents_awarded: awarded };
  }

  async getMyCard(): Promise<ProfileCard> {
    const s = await this.state();
    const me = this.meId(s);
    return this.card(s, me, null);
  }

  async getProfileStrength(): Promise<ProfileStrength> {
    const s = await this.state();
    if (s.session.current_user_id) return this.strengthFor(s, s.session.current_user_id);
    return this.myDraftStrength(s);
  }

  async saveProfile(patch: Partial<Profile>): Promise<Profile> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      const idx = st.profiles.findIndex((p) => p.id === me);
      if (idx >= 0) st.profiles[idx] = { ...st.profiles[idx]!, ...patch, id: me };
    });
    return this.profile(this.store.get(), me);
  }

  async savePreferences(patch: Partial<Preferences>): Promise<Preferences> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      const idx = st.preferences.findIndex((p) => p.profile_id === me);
      if (idx >= 0) st.preferences[idx] = { ...st.preferences[idx]!, ...patch, profile_id: me };
      else {
        st.preferences.push({
          profile_id: me,
          age_min: 25,
          age_max: 40,
          distance_km: 80,
          denominations: [],
          open_to_divorced: true,
          open_to_children: true,
          ...patch,
        });
      }
    });
    return this.store.get().preferences.find((p) => p.profile_id === me)!;
  }

  async savePromptAnswer(answer: Pick<PromptAnswer, 'prompt_id' | 'text'> & { id?: Id; voice_clip_id?: Id | null }): Promise<PromptAnswer> {
    const s = await this.state();
    const me = this.meId(s);
    let result: PromptAnswer | null = null;
    this.store.update((st) => {
      const existing = st.prompt_answers.find((a) => a.profile_id === me && (a.id === answer.id || a.prompt_id === answer.prompt_id));
      if (existing) {
        existing.text = answer.text;
        existing.voice_clip_id = answer.voice_clip_id ?? existing.voice_clip_id;
        result = existing;
      } else {
        result = { id: uid('pa'), profile_id: me, prompt_id: answer.prompt_id, text: answer.text, voice_clip_id: answer.voice_clip_id ?? null };
        st.prompt_answers.push(result);
      }
    });
    track('profile_edited_after_feedback', { prompt_id: answer.prompt_id });
    return result!;
  }

  async saveVoiceIntro(clip: Pick<VoiceClip, 'storage_path' | 'duration_s'> & { starter_label?: string }): Promise<VoiceClip> {
    const s = await this.state();
    const me = this.meId(s);
    const vc: VoiceClip = { id: uid('vc'), profile_id: me, kind: 'intro', transcript: null, ...clip };
    this.store.update((st) => {
      const had = st.voice_clips.some((v) => v.profile_id === me && v.kind === 'intro');
      st.voice_clips = st.voice_clips.filter((v) => !(v.profile_id === me && v.kind === 'intro'));
      st.voice_clips.push(vc);
      const p = st.profiles.find((x) => x.id === me);
      if (p) p.has_voice_intro = true;
      if (!had) this.addLedger(st, me, currency.earn.addVoiceIntro, 'add_voice_intro');
    });
    track('voice_intro_added');
    return vc;
  }

  async removeVoiceIntro(): Promise<void> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      st.voice_clips = st.voice_clips.filter((v) => !(v.profile_id === me && v.kind === 'intro'));
      const p = st.profiles.find((x) => x.id === me);
      if (p) p.has_voice_intro = false;
    });
  }

  async saveTestimony(testimony: Pick<Testimony, 'text' | 'voice_clip_id'>): Promise<Testimony> {
    const s = await this.state();
    const me = this.meId(s);
    const t: Testimony = { id: `t_${me}`, profile_id: me, ...testimony };
    this.store.update((st) => {
      st.testimonies = st.testimonies.filter((x) => x.profile_id !== me);
      st.testimonies.push(t);
    });
    return t;
  }

  async completeVerification(): Promise<Profile> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      const p = st.profiles.find((x) => x.id === me);
      if (p && !p.verified) {
        p.verified = true;
        this.addLedger(st, me, currency.earn.getVerified, 'get_verified');
      }
    });
    track('verified');
    return this.profile(this.store.get(), me);
  }

  /* ---------- discover ---------- */

  private candidates(state: MockState, me: Profile): Profile[] {
    const prefs = state.preferences.find((p) => p.profile_id === me.id);
    const excluded = new Set<Id>([me.id]);
    state.matches.forEach((m) => {
      if (m.user_a === me.id) excluded.add(m.user_b);
      if (m.user_b === me.id) excluded.add(m.user_a);
    });
    state.likes.filter((l) => l.from_id === me.id).forEach((l) => excluded.add(l.to_id));
    state.blocks.filter((b) => b.blocker_id === me.id).forEach((b) => excluded.add(b.blocked_id));
    return state.profiles.filter((p) => {
      if (excluded.has(p.id)) return false;
      if (p.onboarding_step <= rules.onboarding.totalSteps) return false;
      if (p.gender !== me.seeking || p.seeking !== me.gender) return false;
      if (!prefs) return true;
      const age = ageFromBirthdate(p.birthdate);
      if (age < prefs.age_min || age > prefs.age_max) return false;
      if (prefs.denominations.length > 0 && !prefs.denominations.includes(p.denomination)) return false;
      if (!prefs.open_to_divorced && p.marital_history === 'divorced') return false;
      if (!prefs.open_to_children && p.has_children) return false;
      return true;
    });
  }

  /** Ranking (SPEC section 7): verified and voice rank higher, ghost_count ranks lower. */
  private rank(p: Profile, salt: string): number {
    return (
      (p.verified ? rules.ranking.verifiedBoost : 0) +
      (p.has_voice_intro ? rules.ranking.voiceIntroBoost : 0) -
      p.ghost_count * rules.ranking.ghostPenalty +
      (hash(p.id + salt) % 100) / 100
    );
  }

  private ensureBatch(state: MockState, me: Profile, dateKey: string): Id[] {
    let batch = state.daily_batches.find((b) => b.profile_id === me.id && b.date === dateKey);
    if (!batch) {
      const ranked = this.candidates(state, me)
        .map((p) => ({ p, score: this.rank(p, dateKey) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, rules.dailyBatch.size)
        .map((x) => x.p.id);
      batch = { id: uid('batch'), profile_id: me.id, date: dateKey, profile_ids: ranked };
      state.daily_batches.push(batch);
    }
    return batch.profile_ids;
  }

  async getBatch(filters: BatchFilters = {}): Promise<BatchResult> {
    const s = await this.state();
    const me = this.profile(s, this.meId(s));
    const now = new Date();
    const dateKey = batchDateFor(now, rules.dailyBatch.refreshHourLocal);
    let ids: Id[] = [];
    this.store.update((st) => {
      ids = this.ensureBatch(st, me, dateKey);
    });
    const st = this.store.get();
    const acted = new Set(st.session.batch_actions[dateKey] ?? []);
    const cards = ids
      .filter((id) => !acted.has(id))
      .filter((id) => st.profiles.some((p) => p.id === id))
      .map((id) => this.card(st, id, me.id))
      .filter((c) => {
        if (filters.has_voice_intro && !c.voice_intro) return false;
        if (filters.denominations && filters.denominations.length > 0 && !filters.denominations.includes(c.profile.denomination)) return false;
        if (filters.intent && c.profile.intent !== filters.intent) return false;
        if (filters.age_min !== undefined && c.age < filters.age_min) return false;
        if (filters.age_max !== undefined && c.age > filters.age_max) return false;
        return true;
      });
    const todayKey = localDateKey(now);
    const sent = st.session.likes_sent_by_day[todayKey] ?? 0;
    return {
      date: dateKey,
      cards,
      remaining: ids.filter((id) => !acted.has(id)).length,
      likes_left_today: Math.max(0, rules.likes.freePerDay - sent),
      next_refresh_at: nextBatchRefresh(now, rules.dailyBatch.refreshHourLocal),
    };
  }

  private recordBatchAction(state: MockState, profileId: Id): void {
    const dateKey = batchDateFor(new Date(), rules.dailyBatch.refreshHourLocal);
    const list = state.session.batch_actions[dateKey] ?? [];
    if (!list.includes(profileId)) list.push(profileId);
    state.session.batch_actions[dateKey] = list;
  }

  async passProfile(profile_id: Id): Promise<void> {
    await this.store.ready();
    this.store.update((st) => this.recordBatchAction(st, profile_id));
  }

  async saveProfileBookmark(profile_id: Id): Promise<Save> {
    const s = await this.state();
    const me = this.meId(s);
    const save: Save = { id: uid('save'), profile_id: me, saved_profile_id: profile_id, created_at: nowIso() };
    this.store.update((st) => {
      if (!st.saves.some((x) => x.profile_id === me && x.saved_profile_id === profile_id)) st.saves.push(save);
    });
    return save;
  }

  async unsaveProfile(profile_id: Id): Promise<void> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      st.saves = st.saves.filter((x) => !(x.profile_id === me && x.saved_profile_id === profile_id));
    });
  }

  async getSaved(): Promise<ProfileCard[]> {
    const s = await this.state();
    const me = this.meId(s);
    return s.saves
      .filter((x) => x.profile_id === me)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .filter((x) => s.profiles.some((p) => p.id === x.saved_profile_id))
      .map((x) => this.card(s, x.saved_profile_id, me));
  }

  async getProfileCard(profile_id: Id): Promise<ProfileCard> {
    const s = await this.state();
    return this.card(s, profile_id, s.session.current_user_id);
  }

  /* ---------- likes ---------- */

  private createMatch(state: MockState, me: Id, other: Id): Match {
    const meProfile = this.profile(state, me);
    const otherProfile = this.profile(state, other);
    const match: Match = {
      id: uid('m'),
      user_a: me,
      user_b: other,
      created_at: nowIso(),
      opened_by: null,
      opened_at: null,
      intro_invited_at: null,
      expires_at: hoursFromNow(rules.womenFirst.windowHours),
      extended: false,
      closed_at: null,
      closed_by: null,
    };
    state.matches.push(match);
    state.photo_exchanges.push({
      match_id: match.id,
      requested_by: null,
      requested_at: null,
      a_agreed: false,
      b_agreed: false,
      a_msg_count: 0,
      b_msg_count: 0,
      fast_lane: meProfile.verified && otherProfile.verified && meProfile.intent === 'spouse' && otherProfile.intent === 'spouse',
      exchanged_at: null,
    });
    this.notify(state, me, 'match', {
      title: `You matched with ${otherProfile.first_name}`,
      body: meProfile.gender === 'female' ? 'Start when you are ready. You have 48 hours.' : 'She will start the conversation when she is ready.',
      match_id: match.id,
    });
    track('match_created', { match_id: match.id, fast_lane: state.photo_exchanges[state.photo_exchanges.length - 1]!.fast_lane });
    return match;
  }

  private async like(input: LikeInput, isLily: boolean): Promise<{ like: Like; match: Match | null }> {
    const s = await this.state();
    const me = this.meId(s);
    const todayKey = localDateKey(new Date());
    const sent = s.session.likes_sent_by_day[todayKey] ?? 0;
    if (!isLily && sent >= rules.likes.freePerDay && this.balance(s, me) < currency.spend.extraLike) {
      throw new AdapterError('no_likes_left', `You have used your ${rules.likes.freePerDay} free likes today.`);
    }
    let like!: Like;
    let match: Match | null = null;
    this.store.update((st) => {
      if (isLily) this.spend(st, me, currency.spend.sendLily, 'send_lily');
      else if (sent >= rules.likes.freePerDay) this.spend(st, me, currency.spend.extraLike, 'extra_like');
      let voiceId: Id | null = null;
      if (input.comment_voice) {
        const clip: VoiceClip = { id: uid('vc'), profile_id: me, kind: 'chat', transcript: null, ...input.comment_voice };
        st.voice_clips.push(clip);
        voiceId = clip.id;
      }
      like = {
        id: uid('like'),
        from_id: me,
        to_id: input.to_id,
        target_type: input.target_type,
        target_id: input.target_id,
        comment_text: input.comment_text?.trim() || null,
        comment_voice_id: voiceId,
        is_lily: isLily,
        created_at: nowIso(),
      };
      st.likes.push(like);
      st.session.likes_sent_by_day[todayKey] = (st.session.likes_sent_by_day[todayKey] ?? 0) + (isLily ? 0 : 1);
      this.recordBatchAction(st, input.to_id);
      const theyLikedMe = st.likes.some((l) => l.from_id === input.to_id && l.to_id === me && !st.passed_likes.includes(l.id));
      if (theyLikedMe) match = this.createMatch(st, me, input.to_id);
    });
    track(isLily ? 'lily_sent' : 'like_sent', { target_type: input.target_type });
    return { like, match };
  }

  likeTarget(input: LikeInput): Promise<{ like: Like; match: Match | null }> {
    return this.like(input, false);
  }

  sendLily(input: LikeInput): Promise<{ like: Like; match: Match | null }> {
    return this.like(input, true);
  }

  private targetLabel(state: MockState, like: Like): string {
    if (like.target_type === 'intro') return 'Liked your voice intro';
    const answer = state.prompt_answers.find((a) => a.id === like.target_id);
    const prompt = answer ? getPrompt('christian', answer.prompt_id) : undefined;
    return `Liked your answer: ${prompt?.shortLabel ?? 'a prompt'}`;
  }

  async getLikesInbox(): Promise<LikeInboxItem[]> {
    const s = await this.state();
    const me = this.meId(s);
    const matchedWith = new Set<Id>();
    s.matches.forEach((m) => {
      if (m.user_a === me) matchedWith.add(m.user_b);
      if (m.user_b === me) matchedWith.add(m.user_a);
    });
    return s.likes
      .filter((l) => l.to_id === me && !s.passed_likes.includes(l.id) && !matchedWith.has(l.from_id))
      .filter((l) => s.profiles.some((p) => p.id === l.from_id))
      .sort((a, b) => Number(b.is_lily) - Number(a.is_lily) || b.created_at.localeCompare(a.created_at))
      .map((like) => ({
        like,
        from: this.card(s, like.from_id, me),
        target_label: this.targetLabel(s, like),
        comment_voice: like.comment_voice_id ? (s.voice_clips.find((v) => v.id === like.comment_voice_id) ?? null) : null,
      }));
  }

  async likeBack(like_id: Id): Promise<Match> {
    const s = await this.state();
    const me = this.meId(s);
    const like = s.likes.find((l) => l.id === like_id);
    if (!like) throw new AdapterError('not_found', 'That like is gone.');
    let match!: Match;
    this.store.update((st) => {
      st.likes.push({
        id: uid('like'),
        from_id: me,
        to_id: like.from_id,
        target_type: like.target_type,
        target_id: like.target_id,
        comment_text: null,
        comment_voice_id: null,
        is_lily: false,
        created_at: nowIso(),
      });
      match = this.createMatch(st, me, like.from_id);
    });
    return match;
  }

  async passLike(like_id: Id): Promise<void> {
    await this.store.ready();
    this.store.update((st) => {
      if (!st.passed_likes.includes(like_id)) st.passed_likes.push(like_id);
    });
  }

  /* ---------- matches and chat ---------- */

  async getMatches(): Promise<MatchSummary[]> {
    const s = await this.state();
    const me = this.meId(s);
    return s.matches
      .filter((m) => (m.user_a === me || m.user_b === me) && s.profiles.some((p) => p.id === this.otherId(m, me)))
      .map((m) => this.summary(s, m, me))
      .filter((x) => x.status !== 'closed')
      .sort((a, b) => (b.last_message?.created_at ?? b.match.created_at).localeCompare(a.last_message?.created_at ?? a.match.created_at));
  }

  async getMatch(match_id: Id): Promise<MatchSummary> {
    const s = await this.state();
    return this.summary(s, this.match(s, match_id), this.meId(s));
  }

  async getChat(match_id: Id): Promise<ChatThread> {
    const s = await this.state();
    const me = this.meId(s);
    const match = this.match(s, match_id);
    const summary = this.summary(s, match, me);
    const messages = s.messages.filter((m) => m.match_id === match_id);
    const clips: Record<Id, VoiceClip> = {};
    messages.forEach((m) => {
      if (m.voice_clip_id) {
        const c = s.voice_clips.find((v) => v.id === m.voice_clip_id);
        if (c) clips[c.id] = c;
      }
    });
    const exchanged = summary.exchange.exchanged_at !== null;
    return {
      ...summary,
      messages,
      voice_clips: clips,
      voice_dates: s.voice_dates.filter((v) => v.match_id === match_id),
      date_plans: s.date_plans.filter((d) => d.match_id === match_id),
      photos_mine: this.visiblePhotos(s, me, exchanged),
      photos_theirs: this.visiblePhotos(s, this.otherId(match, me), exchanged),
      contact_info_blocked: !exchanged,
      can_plan_date: exchanged && summary.status === 'open',
      can_invite_voice_date: summary.status === 'open',
    };
  }

  async openChat(match_id: Id): Promise<MatchSummary> {
    const s = await this.state();
    const me = this.meId(s);
    const match = this.match(s, match_id);
    if (!this.isWoman(s, me) && !match.opened_at) {
      throw new AdapterError('women_first', 'She starts the conversation. You will be notified when she does.');
    }
    this.store.update((st) => {
      const m = this.match(st, match_id);
      if (!m.opened_at) {
        m.opened_by = me;
        m.opened_at = nowIso();
        m.expires_at = null;
        track('chat_opened_by_her', { match_id });
      }
    });
    return this.summary(this.store.get(), this.match(this.store.get(), match_id), me);
  }

  async inviteIntro(match_id: Id): Promise<MatchSummary> {
    const s = await this.state();
    const me = this.meId(s);
    if (!this.isWoman(s, me)) throw new AdapterError('women_first', 'Only she can invite a voice intro.');
    const match = this.match(s, match_id);
    const other = this.otherId(match, me);
    this.store.update((st) => {
      const m = this.match(st, match_id);
      m.intro_invited_at = nowIso();
      this.pushMessage(st, m, me, { text: `${this.profile(st, me).first_name} asked you to introduce yourself.` }, 'system');
      this.notify(st, other, 'message', { title: `${this.profile(st, me).first_name} wants to hear from you`, body: 'Send one voice intro to introduce yourself.', match_id });
    });
    if (this.store.get().session.auto_reply) {
      this.later(3000, () => {
        this.store.update((st) => {
          const m = st.matches.find((x) => x.id === match_id);
          if (!m || m.opened_at || m.closed_at) return;
          const hasIntro = st.messages.some((x) => x.match_id === match_id && x.kind === 'intro_invite');
          if (hasIntro) return;
          this.pushMessage(st, m, other, { voice_clip: { storage_path: 'placeholder:3', duration_s: 41 } }, 'intro_invite');
          const otherProfile = this.profile(st, other);
          this.notify(st, me, 'message', { title: `${otherProfile.first_name} sent a voice intro`, body: 'Tap to listen.', match_id });
        });
      });
    }
    return this.summary(this.store.get(), this.match(this.store.get(), match_id), me);
  }

  async sendIntro(match_id: Id, input: SendMessageInput): Promise<Message> {
    const s = await this.state();
    const me = this.meId(s);
    const match = this.match(s, match_id);
    if (!match.intro_invited_at) throw new AdapterError('women_first', 'Wait for her to invite your intro.');
    if (s.messages.some((m) => m.match_id === match_id && m.sender_id === me && m.kind === 'intro_invite')) {
      throw new AdapterError('not_allowed', 'You can send one intro. She will take it from here.');
    }
    let msg!: Message;
    this.store.update((st) => {
      msg = this.pushMessage(st, this.match(st, match_id), me, input, 'intro_invite');
    });
    return msg;
  }

  async extendWindow(match_id: Id): Promise<MatchSummary> {
    const s = await this.state();
    const me = this.meId(s);
    const match = this.match(s, match_id);
    if (match.extended) throw new AdapterError('already_extended', 'This match has already been extended once.');
    if (!match.expires_at) throw new AdapterError('not_allowed', 'The chat is already open.');
    this.store.update((st) => {
      const m = this.match(st, match_id);
      m.extended = true;
      m.expires_at = new Date(new Date(m.expires_at!).getTime() + rules.womenFirst.extensionHours * 3600_000).toISOString();
    });
    return this.summary(this.store.get(), this.match(this.store.get(), match_id), me);
  }

  async sendMessage(match_id: Id, input: SendMessageInput): Promise<Message> {
    const s = await this.state();
    const me = this.meId(s);
    const match = this.match(s, match_id);
    if (match.closed_at) throw new AdapterError('not_allowed', 'This match is closed.');
    const ex = this.exchange(s, match_id);
    if (input.text && ex.exchanged_at === null && detectContactInfo(input.text)) {
      throw new AdapterError('contact_info_blocked', 'Phone numbers and social handles are shared after your Photo Exchange.');
    }
    if (!match.opened_at) {
      if (!this.isWoman(s, me)) throw new AdapterError('women_first', "She makes the first move. You'll be notified when she does.");
    }
    const other = this.otherId(match, me);
    let msg!: Message;
    const firstFromMe = !s.messages.some((m) => m.match_id === match_id && m.sender_id === me && m.kind !== 'system');
    this.store.update((st) => {
      const m = this.match(st, match_id);
      if (!m.opened_at) {
        m.opened_by = me;
        m.opened_at = nowIso();
        m.expires_at = null;
        track('chat_opened_by_her', { match_id });
      }
      msg = this.pushMessage(st, m, me, input);
    });
    if (firstFromMe && match.opened_at && match.opened_by !== me) track('first_reply', { match_id });
    this.scheduleAutoReply(match_id, other);
    return msg;
  }

  async markRead(match_id: Id): Promise<void> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      st.notifications.forEach((n) => {
        if (n.profile_id === me && n.payload.match_id === match_id && !n.read_at) n.read_at = nowIso();
      });
    });
  }

  async closeMatch(match_id: Id, closing_message: string): Promise<void> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      const m = this.match(st, match_id);
      this.pushMessage(st, m, me, { text: closing_message }, 'system');
      m.closed_at = nowIso();
      m.closed_by = me;
      st.voice_dates.forEach((v) => {
        if (v.match_id === match_id && (v.status === 'invited' || v.status === 'scheduled')) v.status = 'declined';
      });
      st.date_plans.forEach((d) => {
        if (d.match_id === match_id && (d.status === 'proposed' || d.status === 'changes_requested')) d.status = 'cancelled';
      });
    });
    track('close_kindly_used', { match_id });
  }

  async getCloseKindlyTemplates(): Promise<string[]> {
    return closeKindlyTemplates;
  }

  /* ---------- photo exchange ---------- */

  async requestExchange(match_id: Id): Promise<PhotoExchange> {
    const s = await this.state();
    const me = this.meId(s);
    const match = this.match(s, match_id);
    if (!match.opened_at) throw new AdapterError('not_allowed', 'The chat has to be open first.');
    const other = this.otherId(match, me);
    this.store.update((st) => {
      const ex = this.exchange(st, match_id);
      if (ex.exchanged_at) return;
      ex.requested_by = me;
      ex.requested_at = nowIso();
      if (match.user_a === me) ex.a_agreed = true;
      else ex.b_agreed = true;
      this.notify(st, other, 'exchange_request', {
        title: `${this.profile(st, me).first_name} wants to exchange photos`,
        body: 'Nothing is shared until you both agree.',
        match_id,
      });
    });
    if (this.store.get().session.auto_reply && this.exchangeReady(this.exchange(this.store.get(), match_id))) {
      this.later(3500, () => {
        this.store.update((st) => {
          const ex = this.exchange(st, match_id);
          if (ex.exchanged_at || ex.requested_by !== me) return;
          this.agree(st, match, other);
        });
      });
    }
    return this.exchange(this.store.get(), match_id);
  }

  private agree(state: MockState, match: Match, who: Id): void {
    const ex = this.exchange(state, match.id);
    if (match.user_a === who) ex.a_agreed = true;
    else ex.b_agreed = true;
    if (ex.a_agreed && ex.b_agreed && !ex.exchanged_at) {
      ex.exchanged_at = nowIso();
      [match.user_a, match.user_b].forEach((id) => {
        const otherName = this.profile(state, this.otherId(match, id)).first_name;
        this.notify(state, id, 'exchange_complete', { title: 'Now you see each other', body: `You and ${otherName} exchanged photos.`, match_id: match.id });
      });
      this.pushMessage(state, match, who, { text: 'You exchanged photos together.' }, 'system');
      track('photo_exchange_completed', { match_id: match.id, fast_lane: ex.fast_lane });
    }
  }

  async respondToExchange(match_id: Id, agree: boolean): Promise<PhotoExchange> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      const match = this.match(st, match_id);
      const ex = this.exchange(st, match_id);
      if (agree) {
        if (!ex.requested_by) {
          ex.requested_by = me;
          ex.requested_at = nowIso();
        }
        this.agree(st, match, me);
      } else {
        // "Not yet" keeps the chat open with no penalty. The request is simply cleared.
        ex.requested_by = null;
        ex.requested_at = null;
        ex.a_agreed = false;
        ex.b_agreed = false;
      }
    });
    return this.exchange(this.store.get(), match_id);
  }

  async getPhotos(match_id: Id): Promise<{ mine: VisiblePhoto[]; theirs: VisiblePhoto[]; exchanged_at: IsoDate | null }> {
    const s = await this.state();
    const me = this.meId(s);
    const match = this.match(s, match_id);
    const ex = this.exchange(s, match_id);
    const exchanged = ex.exchanged_at !== null;
    return {
      mine: this.visiblePhotos(s, me, exchanged),
      theirs: this.visiblePhotos(s, this.otherId(match, me), exchanged),
      exchanged_at: ex.exchanged_at,
    };
  }

  /* ---------- wallet ---------- */

  async getWallet(): Promise<Wallet> {
    const s = await this.state();
    const me = this.meId(s);
    return {
      balance: this.balance(s, me),
      ledger: s.talent_ledger.filter((t) => t.profile_id === me).sort((a, b) => b.created_at.localeCompare(a.created_at)),
      bundles: currency.bundles,
    };
  }

  async purchaseBundle(bundle_id: string): Promise<Wallet> {
    const s = await this.state();
    const me = this.meId(s);
    const bundle = currency.bundles.find((b) => b.id === bundle_id);
    if (!bundle) throw new AdapterError('not_found', 'Unknown bundle.');
    this.store.update((st) => this.addLedger(st, me, bundle.talents, 'purchase'));
    return this.getWallet();
  }

  async claimDailyCheckIn(): Promise<Wallet> {
    const s = await this.state();
    const me = this.meId(s);
    const today = localDateKey(new Date());
    const already = s.talent_ledger.some((t) => t.profile_id === me && t.reason === 'daily_check_in' && localDateKey(new Date(t.created_at)) === today);
    if (!already) this.store.update((st) => this.addLedger(st, me, currency.earn.dailyCheckIn, 'daily_check_in'));
    return this.getWallet();
  }

  /* ---------- Front Porch voice dates ---------- */

  async inviteVoiceDate(match_id: Id, scheduled_for?: IsoDate): Promise<VoiceDate> {
    const s = await this.state();
    const me = this.meId(s);
    const match = this.match(s, match_id);
    if (!match.opened_at) throw new AdapterError('women_first', 'Voice dates open up once she has started the chat.');
    const other = this.otherId(match, me);
    const vd: VoiceDate = {
      id: uid('vd'),
      match_id,
      invited_by: me,
      scheduled_for: scheduled_for ?? null,
      status: scheduled_for ? 'scheduled' : 'invited',
      started_at: null,
      ended_at: null,
      duration_s: 0,
      extended_count: 0,
      extension_votes: [],
    };
    this.store.update((st) => {
      st.voice_dates.push(vd);
      this.notify(st, other, 'voice_date_invite', { title: `${this.profile(st, me).first_name} invited you to a voice date`, body: 'Join now or pick a time.', match_id, ref_id: vd.id });
    });
    track('voice_date_invited', { match_id });
    return vd;
  }

  async respondToVoiceDate(voice_date_id: Id, response: VoiceDateResponse): Promise<VoiceDate> {
    await this.store.ready();
    this.store.update((st) => {
      const vd = st.voice_dates.find((v) => v.id === voice_date_id);
      if (!vd) throw new AdapterError('not_found', 'Voice date not found.');
      if (response.action === 'join_now') {
        vd.status = 'live';
        vd.started_at = nowIso();
      } else if (response.action === 'schedule') {
        vd.status = 'scheduled';
        vd.scheduled_for = response.scheduled_for;
      } else {
        vd.status = 'declined';
      }
    });
    return this.store.get().voice_dates.find((v) => v.id === voice_date_id)!;
  }

  async startVoiceDate(voice_date_id: Id): Promise<VoiceDate> {
    await this.store.ready();
    this.store.update((st) => {
      const vd = st.voice_dates.find((v) => v.id === voice_date_id);
      if (!vd) throw new AdapterError('not_found', 'Voice date not found.');
      vd.status = 'live';
      vd.started_at = vd.started_at ?? nowIso();
    });
    return this.store.get().voice_dates.find((v) => v.id === voice_date_id)!;
  }

  async requestVoiceDateExtension(voice_date_id: Id): Promise<VoiceDate> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      const vd = st.voice_dates.find((v) => v.id === voice_date_id);
      if (!vd) throw new AdapterError('not_found', 'Voice date not found.');
      if (!vd.extension_votes.includes(me)) vd.extension_votes.push(me);
      if (vd.extension_votes.length >= 2) {
        vd.extended_count += 1;
        vd.extension_votes = [];
      }
    });
    if (this.store.get().session.auto_reply) {
      this.later(1500, () => {
        this.store.update((st) => {
          const vd = st.voice_dates.find((v) => v.id === voice_date_id);
          if (!vd || vd.status !== 'live' || vd.extension_votes.length === 0) return;
          const match = this.match(st, vd.match_id);
          const other = this.otherId(match, me);
          if (!vd.extension_votes.includes(other)) vd.extension_votes.push(other);
          if (vd.extension_votes.length >= 2) {
            vd.extended_count += 1;
            vd.extension_votes = [];
          }
        });
      });
    }
    return this.store.get().voice_dates.find((v) => v.id === voice_date_id)!;
  }

  async endVoiceDate(voice_date_id: Id, duration_s: number): Promise<VoiceDate> {
    await this.store.ready();
    this.store.update((st) => {
      const vd = st.voice_dates.find((v) => v.id === voice_date_id);
      if (!vd) throw new AdapterError('not_found', 'Voice date not found.');
      vd.status = 'completed';
      vd.ended_at = nowIso();
      vd.duration_s = duration_s;
      if (duration_s >= rules.voiceDates.completedMinMinutes * 60) {
        const ex = this.exchange(st, vd.match_id);
        ex.a_msg_count += rules.voiceDates.completedMessageCredit;
        ex.b_msg_count += rules.voiceDates.completedMessageCredit;
      }
      const match = this.match(st, vd.match_id);
      const minutes = Math.round(duration_s / 60);
      this.pushMessage(st, match, vd.invited_by, { text: `Voice date, ${minutes} minute${minutes === 1 ? '' : 's'}.` }, 'system');
    });
    track('voice_date_completed', { duration_s });
    return this.store.get().voice_dates.find((v) => v.id === voice_date_id)!;
  }

  async submitVoiceDateFeedback(feedback: VoiceDateFeedback): Promise<void> {
    await this.store.ready();
    this.store.update((st) => {
      st.voice_date_feedback = st.voice_date_feedback.filter((f) => !(f.voice_date_id === feedback.voice_date_id && f.profile_id === feedback.profile_id));
      st.voice_date_feedback.push(feedback);
    });
  }

  async reportVoiceDate(voice_date_id: Id, reason: string): Promise<void> {
    const s = await this.state();
    const me = this.meId(s);
    const vd = s.voice_dates.find((v) => v.id === voice_date_id);
    if (!vd) throw new AdapterError('not_found', 'Voice date not found.');
    const match = this.match(s, vd.match_id);
    this.store.update((st) => {
      st.reports.push({ id: uid('rep'), reporter_id: me, reported_id: this.otherId(match, me), match_id: match.id, reason, created_at: nowIso() });
    });
    track('safety_flag_raised', { source: 'voice_date' });
  }

  /* ---------- plan a date ---------- */

  async searchPlaces(query: string, city: string): Promise<Place[]> {
    return searchSeedPlaces(query, city);
  }

  async proposeDatePlan(match_id: Id, input: DatePlanInput): Promise<DatePlan> {
    const s = await this.state();
    const me = this.meId(s);
    const match = this.match(s, match_id);
    const ex = this.exchange(s, match_id);
    if (!ex.exchanged_at) throw new AdapterError('exchange_required', 'Plan a date opens up after your Photo Exchange.');
    if (s.date_plans.some((d) => d.match_id === match_id && (d.status === 'proposed' || d.status === 'changes_requested'))) {
      throw new AdapterError('open_plan_exists', 'There is already a date plan waiting for a reply.');
    }
    const other = this.otherId(match, me);
    const plan: DatePlan = {
      id: uid('dp'),
      match_id,
      proposed_by: me,
      activity: input.activity,
      activity_other: input.activity_other ?? null,
      time_options: input.time_options,
      chosen_time: null,
      place_name: input.place.name,
      place_address: input.place.address,
      place_id: input.place.id,
      who_pays: input.who_pays,
      status: 'proposed',
      change_note: null,
      confirmed_at: null,
      created_at: nowIso(),
    };
    this.store.update((st) => {
      st.date_plans.push(plan);
      const m = this.match(st, match_id);
      const planMsg = this.pushMessage(st, m, me, {}, 'date_plan');
      planMsg.ref_id = plan.id;
      this.notify(st, other, 'date_plan', { title: `${this.profile(st, me).first_name} planned a date`, body: `${plan.place_name}. Pick a time that works.`, match_id, ref_id: plan.id });
      if (input.share_with_partner) {
        st.date_shares.push({ id: uid('ds'), date_plan_id: plan.id, profile_id: me, shared_with: 'partner', share_token: uid('tok'), created_at: nowIso() });
      }
    });
    track('date_plan_proposed', { activity: input.activity, who_pays: input.who_pays });
    if (this.store.get().session.auto_reply) {
      this.later(4000, () => {
        this.store.update((st) => {
          const p = st.date_plans.find((d) => d.id === plan.id);
          if (!p || p.status !== 'proposed') return;
          this.confirmPlan(st, p, p.time_options[0]!);
        });
      });
    }
    return plan;
  }

  private confirmPlan(state: MockState, plan: DatePlan, chosen: IsoDate): void {
    plan.status = 'confirmed';
    plan.chosen_time = chosen;
    plan.confirmed_at = nowIso();
    const match = this.match(state, plan.match_id);
    [match.user_a, match.user_b].forEach((id) => {
      this.notify(state, id, 'date_plan', { title: 'Your date is confirmed', body: `${plan.place_name}. Add it to your calendar.`, match_id: plan.match_id, ref_id: plan.id });
    });
    track('date_plan_confirmed', { activity: plan.activity });
  }

  async respondToDatePlan(date_plan_id: Id, response: DatePlanResponse): Promise<DatePlan> {
    await this.store.ready();
    this.store.update((st) => {
      const plan = st.date_plans.find((d) => d.id === date_plan_id);
      if (!plan) throw new AdapterError('not_found', 'Date plan not found.');
      if (response.action === 'accept') this.confirmPlan(st, plan, response.chosen_time);
      else if (response.action === 'suggest_changes') {
        plan.status = 'changes_requested';
        plan.change_note = response.note;
      } else {
        // "Not yet" declines quietly so the other person can propose again later.
        plan.status = 'declined';
      }
    });
    return this.store.get().date_plans.find((d) => d.id === date_plan_id)!;
  }

  async cancelDatePlan(date_plan_id: Id): Promise<DatePlan> {
    await this.store.ready();
    this.store.update((st) => {
      const plan = st.date_plans.find((d) => d.id === date_plan_id);
      if (plan) plan.status = 'cancelled';
    });
    return this.store.get().date_plans.find((d) => d.id === date_plan_id)!;
  }

  async shareDatePlan(date_plan_id: Id, shared_with: DateShare['shared_with']): Promise<DateShare> {
    const s = await this.state();
    const me = this.meId(s);
    const share: DateShare = { id: uid('ds'), date_plan_id, profile_id: me, shared_with, share_token: uid('tok'), created_at: nowIso() };
    this.store.update((st) => st.date_shares.push(share));
    return share;
  }

  async getPendingCheckins(): Promise<DatePlan[]> {
    const s = await this.state();
    const me = this.meId(s);
    const now = Date.now();
    return s.date_plans.filter(
      (d) =>
        d.status === 'confirmed' &&
        d.chosen_time !== null &&
        new Date(d.chosen_time).getTime() < now &&
        s.matches.some((m) => m.id === d.match_id && (m.user_a === me || m.user_b === me)) &&
        !s.date_checkins.some((c) => c.date_plan_id === d.id && c.profile_id === me),
    );
  }

  async submitDateCheckin(date_plan_id: Id, outcome: CheckinOutcome, note?: string): Promise<DateCheckin> {
    const s = await this.state();
    const me = this.meId(s);
    const checkin: DateCheckin = { date_plan_id, profile_id: me, outcome, note: note?.trim() || null, created_at: nowIso() };
    this.store.update((st) => st.date_checkins.push(checkin));
    track('date_checkin', { outcome });
    return checkin;
  }

  /* ---------- Aunt Martha ---------- */

  private usage(state: MockState, me: Id): CoachUsage {
    const week = weekStartFor(new Date());
    let u = state.coach_usage.find((x) => x.profile_id === me && x.week_start === week);
    if (!u) {
      u = { profile_id: me, week_start: week, free_used: 0, talents_spent: 0 };
      state.coach_usage.push(u);
    }
    return u;
  }

  private coachSettings(state: MockState, me: Id): CoachSettings {
    let s = state.coach_settings.find((x) => x.profile_id === me);
    if (!s) {
      s = { profile_id: me, nudges_on: true };
      state.coach_settings.push(s);
    }
    return s;
  }

  private ensureGreeting(state: MockState, me: Id): void {
    if (!state.coach_messages.some((m) => m.profile_id === me)) {
      state.coach_messages.push({
        id: uid('cm'),
        profile_id: me,
        role: 'martha',
        text: auntMartha.greeting,
        context_type: 'none',
        match_id: null,
        flagged: false,
        prompt_version: auntMartha.promptVersion,
        created_at: nowIso(),
      });
    }
  }

  private pickReply(input: AskAuntMarthaInput): { text: string; flagged: boolean; review: CoachMessage['review'] } {
    const haystack = [input.text, ...(input.shared_messages ?? []).map((m) => m.text ?? '')].join(' ').toLowerCase();
    const flagged = cannedReplies.find((r) => r.flagged && r.keywords.some((k) => haystack.includes(k)));
    if (flagged) return { text: flagged.text, flagged: true, review: undefined };
    if (input.context_type === 'profile' && /look|review|profile|check/.test(haystack)) {
      const base = cannedReplies.find((r) => r.id === 'profile_review')!;
      return {
        text: base.text,
        flagged: false,
        review: {
          prompt_answer_id: profileReviewCard.prompt_answer_id,
          prompt_short_label: profileReviewCard.prompt_short_label,
          answer_excerpt: profileReviewCard.answer_excerpt,
          level: profileReviewCard.level,
        },
      };
    }
    const keyword = cannedReplies.find(
      (r) => !r.flagged && r.keywords.length > 0 && (r.context === 'any' || r.context === input.context_type) && r.keywords.some((k) => haystack.includes(k)),
    );
    if (keyword) return { text: keyword.text, flagged: false, review: undefined };
    const contextual = cannedReplies.find((r) => r.context === input.context_type && r.keywords.length === 0);
    if (contextual) return { text: contextual.text, flagged: false, review: undefined };
    return { text: cannedReplies.find((r) => r.id === 'fallback')!.text, flagged: false, review: undefined };
  }

  async askAuntMartha(input: AskAuntMarthaInput): Promise<AskAuntMarthaResult> {
    const s = await this.state();
    const me = this.meId(s);
    const isProfileCoaching = input.context_type === 'profile';
    let charged = 0;
    let reply!: CoachMessage;
    this.store.update((st) => {
      this.ensureGreeting(st, me);
      const usage = this.usage(st, me);
      if (!isProfileCoaching) {
        if (usage.free_used < rules.auntMartha.freeQuestionsPerWeek) usage.free_used += 1;
        else {
          this.spend(st, me, rules.auntMartha.talentsPerExtraQuestion, 'aunt_martha_question');
          usage.talents_spent += rules.auntMartha.talentsPerExtraQuestion;
          charged = rules.auntMartha.talentsPerExtraQuestion;
        }
      }
      st.coach_messages.push({
        id: uid('cm'),
        profile_id: me,
        role: 'user',
        text: input.text,
        context_type: input.context_type,
        match_id: input.match_id ?? null,
        flagged: false,
        prompt_version: auntMartha.promptVersion,
        created_at: nowIso(),
      });
      const picked = this.pickReply(input);
      reply = {
        id: uid('cm'),
        profile_id: me,
        role: 'martha',
        text: picked.text,
        context_type: input.context_type,
        match_id: input.match_id ?? null,
        flagged: picked.flagged,
        prompt_version: auntMartha.promptVersion,
        created_at: nowIso(),
        review: picked.review,
      };
      st.coach_messages.push(reply);
      if (picked.review) {
        st.coach_messages.push({
          id: uid('cm'),
          profile_id: me,
          role: 'martha',
          text: profileReviewCard.followup,
          context_type: input.context_type,
          match_id: null,
          flagged: false,
          prompt_version: auntMartha.promptVersion,
          created_at: nowIso(),
        });
      }
    });
    track('aunt_martha_question', { context_type: input.context_type, charged });
    if (reply.flagged) track('safety_flag_raised', { source: 'aunt_martha' });
    const usage = this.usage(this.store.get(), me);
    return { reply, charged_talents: charged, free_left: Math.max(0, rules.auntMartha.freeQuestionsPerWeek - usage.free_used) };
  }

  async getCoachThread(): Promise<CoachThread> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      this.ensureGreeting(st, me);
      this.usage(st, me);
      this.coachSettings(st, me);
    });
    const st = this.store.get();
    const usage = this.usage(st, me);
    return {
      messages: st.coach_messages.filter((m) => m.profile_id === me),
      usage,
      free_left: Math.max(0, rules.auntMartha.freeQuestionsPerWeek - usage.free_used),
      settings: this.coachSettings(st, me),
    };
  }

  async clearCoachThread(): Promise<void> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      st.coach_messages = st.coach_messages.filter((m) => m.profile_id !== me);
    });
  }

  async getCoachUsage(): Promise<CoachUsage & { free_left: number }> {
    const s = await this.state();
    const me = this.meId(s);
    let usage!: CoachUsage;
    this.store.update((st) => {
      usage = this.usage(st, me);
    });
    return { ...usage, free_left: Math.max(0, rules.auntMartha.freeQuestionsPerWeek - usage.free_used) };
  }

  async setCoachNudges(on: boolean): Promise<CoachSettings> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      this.coachSettings(st, me).nudges_on = on;
    });
    return this.coachSettings(this.store.get(), me);
  }

  /* ---------- notifications, settings, safety ---------- */

  async getNotifications(): Promise<AppNotification[]> {
    const s = await this.state();
    const me = this.meId(s);
    return s.notifications.filter((n) => n.profile_id === me).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async markNotificationRead(notification_id: Id): Promise<void> {
    await this.store.ready();
    this.store.update((st) => {
      const n = st.notifications.find((x) => x.id === notification_id);
      if (n && !n.read_at) n.read_at = nowIso();
    });
  }

  async markAllNotificationsRead(): Promise<void> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      st.notifications.forEach((n) => {
        if (n.profile_id === me && !n.read_at) n.read_at = nowIso();
      });
    });
  }

  async getAccountabilityPartner(): Promise<AccountabilityPartner | null> {
    const s = await this.state();
    const me = this.meId(s);
    return s.accountability_partners.find((p) => p.profile_id === me && p.status !== 'removed') ?? null;
  }

  async setAccountabilityPartner(partner: Pick<AccountabilityPartner, 'name' | 'email'> | null): Promise<AccountabilityPartner | null> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      st.accountability_partners = st.accountability_partners.filter((p) => p.profile_id !== me);
      if (partner) st.accountability_partners.push({ id: uid('ap'), profile_id: me, name: partner.name, email: partner.email, status: 'invited' });
    });
    return this.getAccountabilityPartner();
  }

  async reportProfile(profile_id: Id, reason: string, match_id?: Id): Promise<void> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      st.reports.push({ id: uid('rep'), reporter_id: me, reported_id: profile_id, match_id: match_id ?? null, reason, created_at: nowIso() });
    });
    track('safety_flag_raised', { source: 'report' });
  }

  async blockProfile(profile_id: Id): Promise<void> {
    const s = await this.state();
    const me = this.meId(s);
    this.store.update((st) => {
      st.blocks.push({ id: uid('blk'), blocker_id: me, blocked_id: profile_id, created_at: nowIso() });
      st.matches.forEach((m) => {
        if ((m.user_a === me && m.user_b === profile_id) || (m.user_b === me && m.user_a === profile_id)) {
          m.closed_at = m.closed_at ?? nowIso();
          m.closed_by = m.closed_by ?? me;
        }
      });
    });
  }

  /* ---------- dev panel ---------- */

  async devSimulate(event: DevEvent): Promise<void> {
    await this.store.ready();
    if (event.type === 'reset_all') {
      this.timers.forEach((t) => clearTimeout(t));
      this.timers.clear();
      this.store.reset();
      return;
    }
    this.store.update((st) => {
      const me = this.meId(st);
      const meProfile = this.profile(st, me);
      const pickStranger = (): Profile | undefined => {
        const taken = new Set<Id>();
        st.matches.forEach((m) => {
          taken.add(m.user_a);
          taken.add(m.user_b);
        });
        st.likes.filter((l) => l.to_id === me).forEach((l) => taken.add(l.from_id));
        return st.profiles.find((p) => p.id !== me && p.gender === meProfile.seeking && !taken.has(p.id));
      };
      const anyOpenMatch = (matchId?: Id): Match | undefined =>
        matchId ? st.matches.find((m) => m.id === matchId) : st.matches.find((m) => (m.user_a === me || m.user_b === me) && m.opened_at && !m.closed_at);

      switch (event.type) {
        case 'incoming_like': {
          const from = pickStranger();
          if (!from) return;
          const myIntro = st.voice_clips.find((v) => v.profile_id === me && v.kind === 'intro');
          const myAnswer = st.prompt_answers.find((a) => a.profile_id === me);
          const useIntro = Boolean(myIntro) && hash(from.id) % 2 === 0;
          st.likes.push({
            id: uid('like'),
            from_id: from.id,
            to_id: me,
            target_type: useIntro ? 'intro' : 'prompt_answer',
            target_id: useIntro ? myIntro!.id : (myAnswer?.id ?? 'none'),
            comment_text: useIntro ? 'Your voice intro made me smile. Tell me more about your church.' : 'This answer sounds like something I would say. Coffee sometime?',
            comment_voice_id: null,
            is_lily: event.is_lily ?? false,
            created_at: nowIso(),
          });
          this.notify(st, me, event.is_lily ? 'lily' : 'like', {
            title: event.is_lily ? `${from.first_name} sent you a Lily` : `${from.first_name} liked your profile`,
            body: useIntro ? 'They liked your voice intro.' : 'They liked one of your answers.',
            from_id: from.id,
          });
          return;
        }
        case 'incoming_match': {
          const from = pickStranger();
          if (!from) return;
          st.likes.push({
            id: uid('like'),
            from_id: from.id,
            to_id: me,
            target_type: 'prompt_answer',
            target_id: st.prompt_answers.find((a) => a.profile_id === me)?.id ?? 'none',
            comment_text: 'Something about this felt familiar. Glad we matched.',
            comment_voice_id: null,
            is_lily: false,
            created_at: nowIso(),
          });
          this.createMatch(st, me, from.id);
          return;
        }
        case 'incoming_message': {
          const m = anyOpenMatch(event.match_id);
          if (!m) return;
          const other = this.otherId(m, me);
          const text = autoReplyPool[hash(m.id + st.messages.length) % autoReplyPool.length]!;
          this.pushMessage(st, m, other, { text });
          this.notify(st, me, 'message', { title: `${this.profile(st, other).first_name} sent a message`, body: text, match_id: m.id });
          return;
        }
        case 'exchange_request': {
          const m = anyOpenMatch(event.match_id);
          if (!m) return;
          const other = this.otherId(m, me);
          const ex = this.exchange(st, m.id);
          if (ex.exchanged_at) return;
          ex.requested_by = other;
          ex.requested_at = nowIso();
          if (m.user_a === other) ex.a_agreed = true;
          else ex.b_agreed = true;
          this.notify(st, me, 'exchange_request', { title: `${this.profile(st, other).first_name} wants to exchange photos`, body: 'Nothing is shared until you both agree.', match_id: m.id });
          return;
        }
        case 'voice_date_invite': {
          const m = anyOpenMatch(event.match_id);
          if (!m) return;
          const other = this.otherId(m, me);
          const vd: VoiceDate = {
            id: uid('vd'),
            match_id: m.id,
            invited_by: other,
            scheduled_for: null,
            status: 'invited',
            started_at: null,
            ended_at: null,
            duration_s: 0,
            extended_count: 0,
            extension_votes: [],
          };
          st.voice_dates.push(vd);
          this.notify(st, me, 'voice_date_invite', { title: `${this.profile(st, other).first_name} invited you to a voice date`, body: 'Join now or pick a time.', match_id: m.id, ref_id: vd.id });
          return;
        }
        case 'date_plan': {
          const m = anyOpenMatch(event.match_id);
          if (!m) return;
          const other = this.otherId(m, me);
          const ex = this.exchange(st, m.id);
          if (!ex.exchanged_at) {
            ex.a_agreed = true;
            ex.b_agreed = true;
            ex.exchanged_at = nowIso();
          }
          const yesterday = new Date(Date.now() - 20 * 3600_000).toISOString();
          const plan: DatePlan = {
            id: uid('dp'),
            match_id: m.id,
            proposed_by: other,
            activity: 'coffee',
            activity_other: null,
            time_options: [yesterday],
            chosen_time: yesterday,
            place_name: 'Chocolate Coffee Co.',
            place_address: '1101 Hemphill Ave NW',
            place_id: 'pl_4',
            who_pays: 'split',
            status: 'confirmed',
            change_note: null,
            confirmed_at: yesterday,
            created_at: yesterday,
          };
          st.date_plans.push(plan);
          const planMsg = this.pushMessage(st, m, other, {}, 'date_plan');
          planMsg.ref_id = plan.id;
          this.notify(st, me, 'checkin', { title: 'How did it go?', body: `Your coffee date with ${this.profile(st, other).first_name}. Private, just for you.`, match_id: m.id, ref_id: plan.id });
          return;
        }
        case 'fast_forward_messages': {
          const m = st.matches.find((x) => x.id === event.match_id);
          if (!m) return;
          const ex = this.exchange(st, m.id);
          ex.a_msg_count += event.count;
          ex.b_msg_count += event.count;
          return;
        }
        case 'reset_batch': {
          st.daily_batches = st.daily_batches.filter((b) => b.profile_id !== me);
          st.session.batch_actions = {};
          st.session.likes_sent_by_day = {};
          return;
        }
        case 'toggle_verified':
          meProfile.verified = !meProfile.verified;
          return;
        case 'toggle_intent':
          meProfile.intent = meProfile.intent === 'spouse' ? 'purpose' : 'spouse';
          return;
        case 'toggle_gender':
          meProfile.gender = meProfile.gender === 'female' ? 'male' : 'female';
          meProfile.seeking = meProfile.gender === 'female' ? 'male' : 'female';
          st.daily_batches = st.daily_batches.filter((b) => b.profile_id !== me);
          return;
        case 'add_talents':
          this.addLedger(st, me, event.amount, 'dev_grant');
          return;
      }
    });
  }

  /** Mock-only toggle for simulated replies from the other person. */
  async setAutoReply(on: boolean): Promise<void> {
    await this.store.ready();
    this.store.update((st) => {
      st.session.auto_reply = on;
    });
  }

  async getAutoReply(): Promise<boolean> {
    const s = await this.state();
    return s.session.auto_reply;
  }

  subscribe(listener: () => void): Unsubscribe {
    return this.store.subscribe(listener);
  }
}
