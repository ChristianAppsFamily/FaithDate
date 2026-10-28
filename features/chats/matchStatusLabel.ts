import type { MatchSummary } from '@/data';
import { formatHoursLeft, formatTime, isTomorrow } from '@/lib/time';

/** Status pill copy for a chats-list row (design 14). */
export function matchStatusLabel(m: MatchSummary): string | null {
  if (m.exchange.exchanged_at) return 'Photos exchanged';
  if (m.exchange_pending_for_me) return 'Wants to exchange photos';
  if (m.exchange_ready) return 'Photo Exchange ready';
  if (m.next_voice_date?.scheduled_for) {
    const when = m.next_voice_date.scheduled_for;
    if (isTomorrow(when)) return `Voice date tomorrow, ${formatTime(when)}`;
    return `Voice date · ${formatTime(when)}`;
  }
  if (m.status === 'awaiting_her_move' || m.status === 'intro_invited') {
    if (m.my_move && m.hours_left != null) return `Your move · ${formatHoursLeft(m.hours_left)}`;
    if (!m.my_move && m.hours_left != null) return `Waiting on her · ${formatHoursLeft(m.hours_left)}`;
    return m.my_move ? 'Your move' : 'Waiting on her';
  }
  if (m.status === 'expired') return 'Expired';
  return null;
}

export function matchPreview(m: MatchSummary): string {
  if (m.last_message?.kind === 'voice' || m.last_message?.kind === 'intro_invite') return 'Voice note';
  if (m.last_message?.text) return m.last_message.text;
  if (m.my_move) return 'You matched. Start when you are ready.';
  return 'You matched. She will start when she is ready.';
}
