import AsyncStorage from '@react-native-async-storage/async-storage';

import { currency } from '@/config/currency';
import { rules } from '@/config/rules';
import { MockAdapter } from '@/data/mock';
import { DEMO_USER_ID } from '@/data/mock/seed/demo';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// The AsyncStorage mock keeps state between tests, so each test starts from a clean seed
// with simulated replies off (they fire on timers and would leak across tests).
async function demo(): Promise<MockAdapter> {
  await AsyncStorage.clear();
  const a = new MockAdapter();
  await a.signInAsDemo();
  await a.setAutoReply(false);
  return a;
}

describe('MockAdapter', () => {
  test('daily batch has at most 10 cards and ranks voice and verified higher', async () => {
    const a = await demo();
    const batch = await a.getBatch();
    expect(batch.cards.length).toBeLessThanOrEqual(rules.dailyBatch.size);
    expect(batch.cards.length).toBeGreaterThan(0);
    // Voice intros are ~60% of profiles; with the boost the batch should be mostly voice profiles.
    const withVoice = batch.cards.filter((c) => c.voice_intro).length;
    expect(withVoice / batch.cards.length).toBeGreaterThanOrEqual(0.6);
    // Only the opposite gender, only the Christian room.
    expect(batch.cards.every((c) => c.profile.gender === 'male' && c.profile.faith === 'christian')).toBe(true);
  });

  test('"Has voice intro" filter leaves only voice profiles', async () => {
    const a = await demo();
    const batch = await a.getBatch({ has_voice_intro: true });
    expect(batch.cards.every((c) => c.voice_intro !== null)).toBe(true);
  });

  test('Discover never returns full photos', async () => {
    const a = await demo();
    const batch = await a.getBatch();
    for (const card of batch.cards) {
      expect(card.photos.length).toBeGreaterThan(0);
      expect(card.photos.every((p) => p.full_path === null)).toBe(true);
    }
  });

  test('Lilies pin to the top of the likes inbox', async () => {
    const a = await demo();
    const inbox = await a.getLikesInbox();
    expect(inbox.length).toBeGreaterThanOrEqual(3);
    expect(inbox[0]!.like.is_lily).toBe(true);
    expect(inbox[0]!.from.profile.first_name).toBe('David');
  });

  test('like back creates a match with a 48h women-first window', async () => {
    const a = await demo();
    const inbox = await a.getLikesInbox();
    const match = await a.likeBack(inbox[0]!.like.id);
    expect(match.opened_at).toBeNull();
    const summary = await a.getMatch(match.id);
    expect(summary.status).toBe('awaiting_her_move');
    expect(summary.my_move).toBe(true);
    expect(summary.hours_left).toBeGreaterThan(47);
    expect(summary.hours_left).toBeLessThanOrEqual(48);
    // David and Grace are both verified spouse-seekers: fast lane.
    expect(summary.exchange.fast_lane).toBe(true);
  });

  test('the window can be extended exactly once', async () => {
    const a = await demo();
    const before = await a.getMatch('m_daniel');
    const after = await a.extendWindow('m_daniel');
    expect(after.match.extended).toBe(true);
    expect((after.hours_left ?? 0) - (before.hours_left ?? 0)).toBeCloseTo(rules.womenFirst.extensionHours, 0);
    await expect(a.extendWindow('m_daniel')).rejects.toThrow(/already been extended/);
  });

  test('a man cannot message before she starts the chat', async () => {
    const a = await demo();
    await a.devSimulate({ type: 'toggle_gender' });
    await expect(a.sendMessage('m_daniel', { text: 'Hello' })).rejects.toThrow(/first move/);
    await expect(a.openChat('m_daniel')).rejects.toThrow(/She starts/);
  });

  test('she opens the chat by sending the first message', async () => {
    const a = await demo();
    const msg = await a.sendMessage('m_daniel', { text: 'Hi Daniel, which gospel playlist?' });
    expect(msg.sender_id).toBe(DEMO_USER_ID);
    const summary = await a.getMatch('m_daniel');
    expect(summary.status).toBe('open');
    expect(summary.match.opened_by).toBe(DEMO_USER_ID);
  });

  test('contact info is blocked before the exchange and allowed after', async () => {
    const a = await demo();
    await expect(a.sendMessage('m_marcus', { text: 'Text me at 704-555-0199' })).rejects.toThrow(/Photo Exchange/);
    await expect(a.sendMessage('m_marcus', { text: 'my insta is @grace_sings' })).rejects.toThrow(/Photo Exchange/);
    await a.requestExchange('m_marcus');
    await a.devSimulate({ type: 'exchange_request', match_id: 'm_marcus' });
    const ex = await a.respondToExchange('m_marcus', true);
    expect(ex.exchanged_at).not.toBeNull();
    await expect(a.sendMessage('m_marcus', { text: 'Text me at 704-555-0199' })).resolves.toBeTruthy();
  });

  test('photos are blurred until both agree, then both sides see full photos', async () => {
    const a = await demo();
    const before = await a.getPhotos('m_marcus');
    expect(before.exchanged_at).toBeNull();
    expect(before.theirs.every((p) => p.full_path === null)).toBe(true);
    expect(before.mine.every((p) => p.full_path === null)).toBe(true);

    // One side agreeing is not enough.
    await a.requestExchange('m_marcus');
    const half = await a.getPhotos('m_marcus');
    expect(half.exchanged_at).toBeNull();
    expect(half.theirs.every((p) => p.full_path === null)).toBe(true);

    await a.devSimulate({ type: 'exchange_request', match_id: 'm_marcus' });
    await a.respondToExchange('m_marcus', true);
    const after = await a.getPhotos('m_marcus');
    expect(after.exchanged_at).not.toBeNull();
    expect(after.theirs.every((p) => p.full_path !== null)).toBe(true);
    expect(after.mine.every((p) => p.full_path !== null)).toBe(true);
  });

  test('"Not yet" clears the request and keeps the chat open', async () => {
    const a = await demo();
    await a.devSimulate({ type: 'exchange_request', match_id: 'm_marcus' });
    const ex = await a.respondToExchange('m_marcus', false);
    expect(ex.requested_by).toBeNull();
    expect(ex.exchanged_at).toBeNull();
    const summary = await a.getMatch('m_marcus');
    expect(summary.status).toBe('open');
  });

  test('standard lane needs 10 messages from each person; voice notes count double', async () => {
    const a = await demo();
    await a.devSimulate({ type: 'toggle_verified' }); // Grace no longer verified
    const inbox = await a.getLikesInbox();
    const samuel = inbox.find((i) => i.from.profile.first_name === 'Samuel')!;
    const match = await a.likeBack(samuel.like.id);
    let summary = await a.getMatch(match.id);
    expect(summary.exchange.fast_lane).toBe(false);
    await a.sendMessage(match.id, { text: 'Hi' });
    await a.devSimulate({ type: 'fast_forward_messages', match_id: match.id, count: 8 });
    summary = await a.getMatch(match.id);
    expect(summary.exchange_ready).toBe(false);
    await a.sendMessage(match.id, { voice_clip: { storage_path: 'placeholder:1', duration_s: 12 } });
    summary = await a.getMatch(match.id);
    expect(summary.exchange.a_msg_count).toBe(1 + 8 + rules.photoExchange.voiceNoteMessageWeight);
    // The other side only has 8 so far.
    expect(summary.exchange_ready).toBe(false);
    await a.devSimulate({ type: 'fast_forward_messages', match_id: match.id, count: 2 });
    summary = await a.getMatch(match.id);
    expect(summary.exchange_ready).toBe(true);
  });

  test('a completed voice date counts as 10 messages from each person', async () => {
    const a = await demo();
    const vd = await a.inviteVoiceDate('m_marcus');
    await a.startVoiceDate(vd.id);
    await a.endVoiceDate(vd.id, 6 * 60);
    const summary = await a.getMatch('m_marcus');
    expect(summary.exchange.a_msg_count).toBeGreaterThanOrEqual(rules.voiceDates.completedMessageCredit);
    expect(summary.exchange.b_msg_count).toBeGreaterThanOrEqual(rules.voiceDates.completedMessageCredit);
  });

  test('Plan a date is only allowed after a completed exchange', async () => {
    const a = await demo();
    const places = await a.searchPlaces('coffee', 'Atlanta, GA');
    expect(places.length).toBeGreaterThan(0);
    const input = { activity: 'coffee' as const, time_options: [new Date().toISOString()], place: places[0]!, who_pays: 'split' as const, share_with_partner: false };
    await expect(a.proposeDatePlan('m_marcus', input)).rejects.toThrow(/Photo Exchange/);
    await a.requestExchange('m_marcus');
    await a.devSimulate({ type: 'exchange_request', match_id: 'm_marcus' });
    await a.respondToExchange('m_marcus', true);
    const plan = await a.proposeDatePlan('m_marcus', input);
    expect(plan.status).toBe('proposed');
    expect(plan.who_pays).toBe('split');
    await expect(a.proposeDatePlan('m_marcus', input)).rejects.toThrow(/already/);
  });

  test('Talents: a Lily costs Talents, profile coaching is free, extra questions cost 1 Talent', async () => {
    const a = await demo();
    const start = (await a.getWallet()).balance;
    const batch = await a.getBatch();
    const target = batch.cards[0]!;
    await a.sendLily({ to_id: target.profile.id, target_type: 'intro', target_id: target.voice_intro?.id ?? target.answers[0]!.id });
    expect((await a.getWallet()).balance).toBe(start - currency.spend.sendLily);

    const afterLily = (await a.getWallet()).balance;
    for (let i = 0; i < rules.auntMartha.freeQuestionsPerWeek; i++) {
      const r = await a.askAuntMartha({ text: 'What should I ask him?', context_type: 'none' });
      expect(r.charged_talents).toBe(0);
    }
    const paid = await a.askAuntMartha({ text: 'First date ideas', context_type: 'none' });
    expect(paid.charged_talents).toBe(rules.auntMartha.talentsPerExtraQuestion);
    expect((await a.getWallet()).balance).toBe(afterLily - rules.auntMartha.talentsPerExtraQuestion);

    const free = await a.askAuntMartha({ text: 'Can you look at my profile?', context_type: 'profile' });
    expect(free.charged_talents).toBe(0);
    expect(free.reply.review?.level).toBe('go_deeper');
  });

  test('Aunt Martha flags money requests in shared chats', async () => {
    const a = await demo();
    const r = await a.askAuntMartha({
      text: 'Is this a red flag?',
      context_type: 'shared_chat',
      match_id: 'm_marcus',
      shared_messages: [{ id: 'x', match_id: 'm_marcus', sender_id: 'p_marcus', text: 'Can you send me money on Cash App?', voice_clip_id: null, created_at: new Date().toISOString() }],
    });
    expect(r.reply.flagged).toBe(true);
  });

  test('Close kindly closes the match and leaves a closing message', async () => {
    const a = await demo();
    const templates = await a.getCloseKindlyTemplates();
    await a.closeMatch('m_jonathan', templates[0]!);
    const matches = await a.getMatches();
    expect(matches.some((m) => m.match.id === 'm_jonathan')).toBe(false);
    const chat = await a.getChat('m_jonathan');
    expect(chat.status).toBe('closed');
    expect(chat.messages[chat.messages.length - 1]!.kind).toBe('system');
  });

  test('onboarding draft saves and resumes, and finishing awards Talents', async () => {
    const a = new MockAdapter();
    await a.saveOnboardingStep('welcome', { completed_step: 1 });
    await a.saveOnboardingStep('basics', { completed_step: 2, profile: { first_name: 'Ruth', gender: 'female', birthdate: '1996-04-02', city: 'Austin, TX' } });
    const session = await a.getSession();
    expect(session.resume_step).toBe(3);
    const draft = await a.getOnboardingDraft();
    expect(draft.profile.first_name).toBe('Ruth');
    const result = await a.finishOnboarding();
    expect(result.profile.first_name).toBe('Ruth');
    expect(result.profile.seeking).toBe('male');
    expect(result.talents_awarded).toBe(currency.earn.completeProfile);
    expect((await a.getWallet()).balance).toBe(currency.earn.completeProfile);
  });
});
