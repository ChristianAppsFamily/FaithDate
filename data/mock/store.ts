/**
 * In-memory mock database persisted to AsyncStorage (localStorage on web) so the
 * prototype survives reloads. Every table from SPEC.md section 9 lives here.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { OnboardingDraft } from '@/data/adapter';
import type {
  AccountabilityPartner,
  AppNotification,
  Block,
  CoachMessage,
  CoachSettings,
  CoachUsage,
  DailyBatch,
  DateCheckin,
  DatePlan,
  DateShare,
  Id,
  Like,
  Match,
  Message,
  Photo,
  PhotoExchange,
  Preferences,
  Profile,
  PromptAnswer,
  Report,
  Save,
  TalentLedgerEntry,
  Testimony,
  VoiceClip,
  VoiceDate,
  VoiceDateFeedback,
} from '@/data/types';

import {
  demoAnswers,
  demoChatVoiceClips,
  demoExchanges,
  demoLedger,
  demoLikes,
  demoMatches,
  demoMessages,
  demoNotifications,
  demoPhotos,
  demoPreferences,
  demoProfile,
  demoVoiceClips,
  demoVoiceDates,
} from './seed/demo';
import { seedPhotos, seedProfiles, seedPromptAnswers, seedTestimonies, seedVoiceClips } from './seed/profiles';

export const STORAGE_KEY = 'faithdate.mock.v1';

export interface MockSession {
  current_user_id: Id | null;
  draft: OnboardingDraft;
  /** Per-day like counters keyed by local date. */
  likes_sent_by_day: Record<string, number>;
  /** Profiles acted on (liked, passed) per batch date. */
  batch_actions: Record<string, Id[]>;
  /** Mock-only behaviors toggled from the dev panel. */
  auto_reply: boolean;
  theme_preference: 'system' | 'light' | 'dark';
}

export interface MockState {
  version: number;
  session: MockSession;
  profiles: Profile[];
  preferences: Preferences[];
  voice_clips: VoiceClip[];
  prompt_answers: PromptAnswer[];
  testimonies: Testimony[];
  photos: Photo[];
  saves: Save[];
  likes: Like[];
  passed_likes: Id[];
  matches: Match[];
  messages: Message[];
  photo_exchanges: PhotoExchange[];
  daily_batches: DailyBatch[];
  talent_ledger: TalentLedgerEntry[];
  notifications: AppNotification[];
  voice_dates: VoiceDate[];
  voice_date_feedback: VoiceDateFeedback[];
  date_plans: DatePlan[];
  date_shares: DateShare[];
  date_checkins: DateCheckin[];
  coach_messages: CoachMessage[];
  coach_usage: CoachUsage[];
  coach_settings: CoachSettings[];
  accountability_partners: AccountabilityPartner[];
  reports: Report[];
  blocks: Block[];
}

export function emptyDraft(): OnboardingDraft {
  return {
    profile: {},
    preferences: {},
    answers: [],
    testimony: null,
    voice_intro: null,
    photo_count: 0,
    completed_step: 0,
  };
}

/** Seed rows are module constants; clone them so mutations never leak into a later reset. */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function initialState(): MockState {
  return clone<MockState>({
    version: 1,
    session: {
      current_user_id: null,
      draft: emptyDraft(),
      likes_sent_by_day: {},
      batch_actions: {},
      auto_reply: true,
      theme_preference: 'system',
    },
    profiles: [...seedProfiles, demoProfile],
    preferences: [demoPreferences],
    voice_clips: [...seedVoiceClips, ...demoVoiceClips, ...demoChatVoiceClips],
    prompt_answers: [...seedPromptAnswers, ...demoAnswers],
    testimonies: [...seedTestimonies],
    photos: [...seedPhotos, ...demoPhotos],
    saves: [],
    likes: [...demoLikes],
    passed_likes: [],
    matches: [...demoMatches],
    messages: [...demoMessages],
    photo_exchanges: [...demoExchanges],
    daily_batches: [],
    talent_ledger: [...demoLedger],
    notifications: [...demoNotifications],
    voice_dates: demoVoiceDates(),
    voice_date_feedback: [],
    date_plans: [],
    date_shares: [],
    date_checkins: [],
    coach_messages: [],
    coach_usage: [],
    coach_settings: [],
    accountability_partners: [],
    reports: [],
    blocks: [],
  });
}

type Listener = () => void;

export class MockStore {
  private state: MockState = initialState();
  private loaded: Promise<void> | null = null;
  private listeners = new Set<Listener>();
  private persistTimer: ReturnType<typeof setTimeout> | null = null;

  /** Resolves once persisted state (if any) has been read. Safe to call repeatedly. */
  ready(): Promise<void> {
    if (!this.loaded) {
      this.loaded = AsyncStorage.getItem(STORAGE_KEY)
        .then((raw) => {
          if (!raw) return;
          const parsed = JSON.parse(raw) as Partial<MockState>;
          if (parsed.version === 1) {
            this.state = { ...initialState(), ...parsed } as MockState;
          }
        })
        .catch(() => {
          // Corrupt or unavailable storage: fall back to seed data.
        });
    }
    return this.loaded;
  }

  get(): MockState {
    return this.state;
  }

  /** Apply a mutation, notify listeners, and schedule a persist. */
  update(mutator: (state: MockState) => void): void {
    mutator(this.state);
    this.state = { ...this.state };
    this.schedulePersist();
    this.listeners.forEach((l) => l());
  }

  reset(): void {
    this.state = initialState();
    this.schedulePersist();
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private schedulePersist(): void {
    if (this.persistTimer) clearTimeout(this.persistTimer);
    this.persistTimer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state)).catch(() => {
        // Persistence is best-effort in the prototype.
      });
    }, 150);
  }
}
