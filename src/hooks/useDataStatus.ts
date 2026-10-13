import { useEffect, useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import type { DataStatus } from '../types/table';

const SIMULATED_FETCH_MS = 280;

/** Simulates a short data fetch per screen and honours the global data-state control. */
export function useDataStatus() {
  const { dataState } = useAppState();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), SIMULATED_FETCH_MS);
    return () => clearTimeout(t);
  }, [attempt]);

  const status: DataStatus = dataState === 'loading' || loading ? 'loading' : dataState === 'error' ? 'error' : 'ready';
  return { status, isEmptyForced: dataState === 'empty', retry: () => setAttempt((a) => a + 1) };
}