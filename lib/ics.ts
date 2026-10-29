import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import type { DatePlan } from '@/data';

/** Build a minimal .ics calendar invite for a confirmed date plan. */
export function buildDatePlanIcs(plan: DatePlan, otherName: string): string {
  const start = plan.chosen_time ? new Date(plan.chosen_time) : new Date();
  const end = new Date(start.getTime() + 90 * 60_000);
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z');
  const summary = `FaithDate: ${plan.activity.replace('_', ' ')} with ${otherName}`;
  const location = `${plan.place_name}, ${plan.place_address}`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FaithDate//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${plan.id}@faithdate.app`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `LOCATION:${escapeIcs(location)}`,
    `DESCRIPTION:${escapeIcs('Planned on FaithDate. The app never books or charges for your date.')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function escapeIcs(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

/** Share or download the .ics for a confirmed plan. */
export async function shareDatePlanIcs(plan: DatePlan, otherName: string): Promise<void> {
  const ics = buildDatePlanIcs(plan, otherName);
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faithdate-${plan.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }
  // Native: write via data URI share when available.
  const available = await Sharing.isAvailableAsync();
  if (!available) return;
  const dataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  await Sharing.shareAsync(dataUri, { mimeType: 'text/calendar', dialogTitle: 'Add to calendar' });
}
