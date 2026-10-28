/**
 * Core rules (SPEC.md section 7). Every number the app enforces lives here.
 */
export const rules = {
  dailyBatch: {
    size: 10,
    /** Local hour (24h) at which the batch refreshes. */
    refreshHourLocal: 19,
  },
  likes: {
    freePerDay: 8,
  },
  ranking: {
    verifiedBoost: 2,
    voiceIntroBoost: 3,
    /** Penalty applied per ghost_count point. */
    ghostPenalty: 1.5,
  },
  womenFirst: {
    windowHours: 48,
    extensionHours: 24,
    maxExtensions: 1,
  },
  photoExchange: {
    /** Standard lane: messages required from each person. */
    messagesPerPersonStandard: 10,
    /** A voice note counts as this many messages. */
    voiceNoteMessageWeight: 2,
  },
  ghosting: {
    noReplyHours: 72,
  },
  voiceDates: {
    defaultMinutes: 20,
    extensionMinutes: 10,
    /** Minimum call length that counts toward Photo Exchange availability. */
    completedMinMinutes: 5,
    /** A completed voice date counts as this many messages from each person. */
    completedMessageCredit: 10,
  },
  datePlans: {
    minTimeOptions: 2,
    maxTimeOptions: 3,
    noResponseExpiryHours: 72,
    openPlansPerMatch: 1,
    reminderDayBeforeHours: 24,
    reminderBeforeHours: 2,
  },
  onboarding: {
    minAge: 18,
    totalSteps: 10,
    photosMin: 2,
    photosMax: 6,
    voiceIntroMinSeconds: 30,
    voiceIntroMaxSeconds: 90,
    promptAnswersRequired: 3,
  },
  auntMartha: {
    freeQuestionsPerWeek: 5,
    talentsPerExtraQuestion: 1,
    /** How many recent chat messages "Share with Aunt Martha" includes. */
    sharedMessageCount: 6,
  },
} as const;

export type Rules = typeof rules;
