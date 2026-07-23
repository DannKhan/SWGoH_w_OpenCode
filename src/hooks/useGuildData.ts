import { useState, useEffect, useCallback } from 'react';
import type { Guild } from '../types';

interface UseGuildDataResult {
  guild: Guild | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useGuildData(allyCode: string): UseGuildDataResult {
  const [guild, setGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuild = useCallback(async () => {
    if (!allyCode) return;
    setLoading(true);
    setError(null);

    try {
      // TODO: replace with actual Comlink API call
      const response = await fetch(`/api/guild/${allyCode}`);
      if (!response.ok) throw new Error('Failed to fetch guild data');
      const data = await response.json();
      setGuild(data as Guild);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [allyCode]);

  useEffect(() => {
    fetchGuild();
  }, [fetchGuild]);

  return { guild, loading, error, refresh: fetchGuild };
}
