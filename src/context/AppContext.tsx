import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { comlinkApi, type ComlinkPlayerResponse, type ComlinkGuildResponse, type ComlinkGuildSearchItem } from '../services/comlink';

interface AppState {
  guildId: string;
  guildName: string;
  guild: ComlinkGuildResponse['guild'] | null;
  player: ComlinkPlayerResponse | null;
  loading: boolean;
  error: string | null;
  setGuild: (id: string, name: string) => void;
  setPlayerAllyCode: (code: string) => void;
  searchResults: ComlinkGuildSearchItem[];
  searchLoading: boolean;
  searchGuilds: (query: string) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

const GUILD_ID_KEY = 'swgoh_guild_id';
const GUILD_NAME_KEY = 'swgoh_guild_name';
const ALLY_CODE_KEY = 'swgoh_ally_code';

export function AppProvider({ children }: { children: ReactNode }) {
  const [guildId, setGuildIdState] = useState(() => localStorage.getItem(GUILD_ID_KEY) ?? '');
  const [guildName, setGuildNameState] = useState(() => localStorage.getItem(GUILD_NAME_KEY) ?? '');
  const [guild, setGuildData] = useState<ComlinkGuildResponse['guild'] | null>(null);
  const [player] = useState<ComlinkPlayerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ComlinkGuildSearchItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const setGuild = useCallback((id: string, name: string) => {
    localStorage.setItem(GUILD_ID_KEY, id);
    localStorage.setItem(GUILD_NAME_KEY, name);
    setGuildIdState(id);
    setGuildNameState(name);
    setSearchResults([]);
  }, []);

  const setPlayerAllyCode = useCallback((code: string) => {
    localStorage.setItem(ALLY_CODE_KEY, code);
  }, []);

  const searchGuilds = useCallback(async (query: string) => {
    if (!query || query.length < 2) return;
    setSearchLoading(true);
    setError(null);
    try {
      const result = await comlinkApi.searchGuilds(query);
      setSearchResults(result.guild ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const fetchGuild = useCallback(async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const guildData = await comlinkApi.getGuild(id);
      setGuildData(guildData.guild);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (guildId) {
      fetchGuild(guildId);
    }
  }, [guildId, fetchGuild]);

  return (
    <AppContext.Provider value={{
      guildId,
      guildName,
      guild,
      player,
      loading,
      error,
      setGuild,
      setPlayerAllyCode,
      searchResults,
      searchLoading,
      searchGuilds,
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
