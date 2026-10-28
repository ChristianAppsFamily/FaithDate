/**
 * Talents and Lilies (SPEC.md section 7). Names are configurable.
 * Guardrail: Talents can never buy photo access, faster exchanges, or bypass women-first.
 */
export const currency = {
  name: 'Talents',
  singular: 'Talent',
  giftName: 'Lily',
  giftPlural: 'Lilies',
  earn: {
    completeProfile: 50,
    addVoiceIntro: 25,
    getVerified: 25,
    dailyCheckIn: 5,
  },
  spend: {
    extraLike: 2,
    profileBoost: 20,
    sendLily: 15,
    auntMarthaQuestion: 1,
  },
  bundles: [
    { id: 'bundle_small', talents: 30, priceUsd: 4.99, label: 'A handful' },
    { id: 'bundle_medium', talents: 80, priceUsd: 9.99, label: 'A good measure', popular: true },
    { id: 'bundle_large', talents: 200, priceUsd: 19.99, label: 'Pressed down, running over' },
  ],
  /** Things Talents can never buy. Enforced in the adapter and shown in the wallet. */
  neverBuys: ['Photo access', 'Faster Photo Exchange', 'Skipping women-first'],
} as const;

export type TalentBundle = (typeof currency.bundles)[number];

export type TalentReason =
  | 'complete_profile'
  | 'add_voice_intro'
  | 'get_verified'
  | 'daily_check_in'
  | 'extra_like'
  | 'profile_boost'
  | 'send_lily'
  | 'aunt_martha_question'
  | 'purchase'
  | 'dev_grant';
