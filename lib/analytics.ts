/**
 * Metrics events (SPEC.md section 11). Phase 1 logs to the console in dev builds;
 * Phase 3 forwards the same calls to a real sink.
 */
export type AnalyticsEvent =
  | 'onboarding_started'
  | 'onboarding_step_completed'
  | 'onboarding_finished'
  | 'voice_intro_added'
  | 'verified'
  | 'like_sent'
  | 'lily_sent'
  | 'match_created'
  | 'chat_opened_by_her'
  | 'first_reply'
  | 'photo_exchange_completed'
  | 'voice_date_invited'
  | 'voice_date_completed'
  | 'date_plan_proposed'
  | 'date_plan_confirmed'
  | 'date_checkin'
  | 'close_kindly_used'
  | 'aunt_martha_question'
  | 'profile_edited_after_feedback'
  | 'safety_flag_raised';

type Props = Record<string, string | number | boolean | null | undefined>;

const listeners = new Set<(event: AnalyticsEvent, props: Props) => void>();

export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (__DEV__) {
    console.log(`[analytics] ${event}`, props);
  }
  listeners.forEach((l) => l(event, props));
}

export function onTrack(listener: (event: AnalyticsEvent, props: Props) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
