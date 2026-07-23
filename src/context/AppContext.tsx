import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { comlinkApi, type ComlinkPlayerResponse, type ComlinkGuildResponse } from '../services/comlink';

interface AppState {
  allyCode: string;
  player: ComlinkPlayerResponse | null;
  guild: ComlinkGuildResponse['guild'] | null;
  loading: boolean;
  error: string | null;
  setAllyCode: (code: string) => void;
  refresh: () => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = 'swgoh_ally_code';

export function AppProvider({ children }: { children: ReactNode }) {
  const [allyCode, setAllyCodeState] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '');
  const [player, setPlayer] = useState<ComlinkPlayerResponse | null>(null);
  const [guild, setGuild] = useState<ComlinkGuildResponse['guild'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (code: string) => {
    if (!code || code.length < 9) return;
    setLoading(true);
    setError(null);

    try {
      const playerData = await comlinkApi.getPlayer(code);
      setPlayer(playerData);

      if (playerData.guildId) {
        const guildData = await comlinkApi.getGuild(playerData.guildId);
        setGuild(guildData.guild);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const setAllyCode = useCallback((code: string) => {
    const trimmed = code.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setAllyCodeState(trimmed);
  }, []);

  useEffect(() => {
    if (allyCode) {
      fetchAll(allyCode);
    }
  }, [allyCode, fetchAll]);

  return (
    <AppContext.Provider value={{
      allyCode,
      player,
      guild,
      loading,
      error,
      setAllyCode,
      refresh: () => fetchAll(allyCode),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
