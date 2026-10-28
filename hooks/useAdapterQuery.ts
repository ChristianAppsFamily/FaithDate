import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';

import { adapter } from '@/data';

export interface QueryState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Runs an adapter read and re-runs it whenever the adapter reports a change,
 * so screens stay current without manual refetching.
 */
export function useAdapterQuery<T>(query: () => Promise<T>, deps: DependencyList = []): QueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const queryRef = useRef(query);
  queryRef.current = query;
  const alive = useRef(true);

  const run = useCallback(async () => {
    try {
      const result = await queryRef.current();
      if (!alive.current) return;
      setData(result);
      setError(null);
    } catch (e) {
      if (!alive.current) return;
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    setLoading(true);
    void run();
    const unsubscribe = adapter.subscribe(() => {
      void run();
    });
    return () => {
      alive.current = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, refresh: run };
}
