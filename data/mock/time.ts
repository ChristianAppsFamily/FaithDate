import type { IsoDate } from '@/data/types';

export const HOUR_MS = 60 * 60 * 1000;
export const DAY_MS = 24 * HOUR_MS;

export function nowIso(): IsoDate {
  return new Date().toISOString();
}

export function hoursFromNow(hours: number): IsoDate {
  return new Date(Date.now() + hours * HOUR_MS).toISOString();
}

export function hoursAgo(hours: number): IsoDate {
  return new Date(Date.now() - hours * HOUR_MS).toISOString();
}

export function minutesAgo(minutes: number): IsoDate {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

export function daysAgo(days: number): IsoDate {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

/** A birthdate that yields `age` today. `salt` spreads birthdays through the year. */
export function birthdateForAge(age: number, salt = 0): IsoDate {
  const d = new Date();
  d.setFullYear(d.getFullYear() - age);
  d.setDate(d.getDate() - 10 - (salt * 7) % 300);
  return d.toISOString().slice(0, 10);
}

export function ageFromBirthdate(birthdate: IsoDate, at: Date = new Date()): number {
  const b = new Date(birthdate);
  let age = at.getFullYear() - b.getFullYear();
  const m = at.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < b.getDate())) age -= 1;
  return age;
}

/** Local calendar date (YYYY-MM-DD) that the daily batch belongs to, given a refresh hour. */
export function batchDateFor(at: Date, refreshHourLocal: number): string {
  const d = new Date(at);
  if (d.getHours() >= refreshHourLocal) d.setDate(d.getDate() + 1);
  return localDateKey(d);
}

export function nextBatchRefresh(at: Date, refreshHourLocal: number): IsoDate {
  const d = new Date(at);
  d.setHours(refreshHourLocal, 0, 0, 0);
  if (d.getTime() <= at.getTime()) d.setDate(d.getDate() + 1);
  return d.toISOString();
}

export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Monday 00:00 local of the week containing `at`. */
export function weekStartFor(at: Date): IsoDate {
  const d = new Date(at);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function hoursUntil(iso: IsoDate, from: Date = new Date()): number {
  return Math.max(0, (new Date(iso).getTime() - from.getTime()) / HOUR_MS);
}
