/**
 * Detects phone numbers, emails, URLs, and social handles so chat can block them
 * before a Photo Exchange (SPEC.md section 6 item 8). The Edge Function in Phase 3
 * uses the same rules.
 */
const PHONE = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const URL = /\b(?:https?:\/\/|www\.)\S+|\b[\w-]+\.(?:com|net|org|io|me|co|app)\b/i;
const HANDLE = /(?:^|\s)@[A-Za-z0-9_.]{3,}/;
const SOCIAL_WORDS = /\b(?:instagram|insta|snap(?:chat)?|whatsapp|telegram|tiktok|facebook|my ig|my snap)\b/i;

export type ContactInfoKind = 'phone' | 'email' | 'url' | 'handle' | 'social';

export function detectContactInfo(text: string): ContactInfoKind | null {
  if (PHONE.test(text)) return 'phone';
  if (EMAIL.test(text)) return 'email';
  if (URL.test(text)) return 'url';
  if (HANDLE.test(text)) return 'handle';
  if (SOCIAL_WORDS.test(text)) return 'social';
  return null;
}

export const contactBlockedCopy = 'Phone numbers and social handles are shared after your Photo Exchange.';
