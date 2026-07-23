import { useState, useEffect, useCallback } from 'react';
import type { Player, PlayerRoster, PlayerInventory } from '../types';

interface UsePlayerDataResult {
  player: Player | null;
  roster: PlayerRoster | null;
  inventory: PlayerInventory | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePlayerData(allyCode: string): UsePlayerDataResult {
  const [player, setPlayer] = useState<Player | null>(null);
  const [roster, setRoster] = useState<PlayerRoster | null>(null);
  const [inventory] = useState<PlayerInventory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayer = useCallback(async () => {
    if (!allyCode) return;
    setLoading(true);
    setError(null);

    try {
      const [playerRes, rosterRes] = await Promise.all([
        fetch(`/api/player/${allyCode}`),
        fetch(`/api/roster/${allyCode}`),
      ]);

      if (!playerRes.ok || !rosterRes.ok) {
        throw new Error('Failed to fetch player data');
      }

      const playerData = await playerRes.json() as Player;
      const rosterData = await rosterRes.json() as PlayerRoster;

      setPlayer(playerData);
      setRoster(rosterData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [allyCode]);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  return { player, roster, inventory, loading, error, refresh: fetchPlayer };
}
