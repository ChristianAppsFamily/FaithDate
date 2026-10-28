/** Age in whole years from an ISO birthdate (YYYY-MM-DD). */
export function ageFromBirthdate(birthdate: string, at: Date = new Date()): number {
  const b = new Date(birthdate);
  if (Number.isNaN(b.getTime())) return 0;
  let age = at.getFullYear() - b.getFullYear();
  const m = at.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < b.getDate())) age -= 1;
  return age;
}

/** "0:42" style clock for clip durations and call timers. */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

/** "2m", "1h", "Today", "Mon" for list rows. */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24 && then.getDate() === now.getDate()) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return then.toLocaleDateString(undefined, { weekday: 'short' });
  return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** "Sat, Nov 7 · 11:00 AM" for date plan options. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

/** "7:00 PM" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** "47 hours left" style countdown. */
export function formatHoursLeft(hours: number): string {
  const h = Math.floor(hours);
  if (h >= 1) return `${h} hour${h === 1 ? '' : 's'} left`;
  const m = Math.max(1, Math.floor(hours * 60));
  return `${m} minute${m === 1 ? '' : 's'} left`;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isTomorrow(iso: string, now: Date = new Date()): boolean {
  const t = new Date(now);
  t.setDate(t.getDate() + 1);
  return isSameLocalDay(new Date(iso), t);
}
