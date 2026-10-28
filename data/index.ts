import type { DataAdapter } from './adapter';
import { MockAdapter } from './mock';

/**
 * The single adapter instance the app reads through.
 * Phase 3 swaps `new MockAdapter()` for the Supabase implementation; nothing in the UI changes.
 */
export const adapter: DataAdapter = new MockAdapter();

/** Mock-only extras (auto replies) used by the dev panel. Not part of the production interface. */
export const mockAdapter: MockAdapter = adapter as MockAdapter;

export { AdapterError } from './mock';
export type * from './adapter';
export type * from './types';
