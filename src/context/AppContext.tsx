import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { comlinkApi, type ComlinkPlayerResponse, type ComlinkGuildResponse, type ComlinkGuildSearchItem } from '../services/comlink';

interface AppState {
  guildId: string;
  guildName: string;
  guild: ComlinkGuildResponse['guild'] | null;
  player: ComlinkPlayerResponse | null;
  playerAllyCode: string;
  loading: boolean;
  error: string | null;
  setGuild: (id: string, name: string) => void;
  searchResults: ComlinkGuildSearchItem[];
  searchLoading: boolean;
  searchGuilds: (query: string) => Promise<void>;
  githubToken: string;
  setGithubToken: (token: string) => void;
  snapshotStatus: 'idle' | 'requesting' | 'pending' | 'loading' | 'ready' | 'error';
  snapshotError: string | null;
  requestSnapshot: (allyCode: string) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

const GUILD_ID_KEY = 'swgoh_guild_id';
const GUILD_NAME_KEY = 'swgoh_guild_name';
const TOKEN_KEY = 'swgoh_github_token';
const ALLY_CODE_KEY = 'swgoh_ally_code';

const REPO_OWNER = 'DannKhan';
const REPO_NAME = 'SWGoH_w_OpenCode';
const WORKFLOW_ID = 'fetch-snapshot.yml';

export function AppProvider({ children }: { children: ReactNode }) {
  const [guildId, setGuildIdState] = useState(() => localStorage.getItem(GUILD_ID_KEY) ?? '');
  const [guildName, setGuildNameState] = useState(() => localStorage.getItem(GUILD_NAME_KEY) ?? '');
  const [guild, setGuildData] = useState<ComlinkGuildResponse['guild'] | null>(null);
  const [player, setPlayer] = useState<ComlinkPlayerResponse | null>(null);
  const [playerAllyCode, setPlayerAllyCodeState] = useState(() => localStorage.getItem(ALLY_CODE_KEY) ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ComlinkGuildSearchItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [githubToken, setGithubTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '');

  const [snapshotStatus, setSnapshotStatus] = useState<'idle' | 'requesting' | 'pending' | 'loading' | 'ready' | 'error'>('idle');
  const [snapshotError, setSnapshotError] = useState<string | null>(null);

  const setGithubToken = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setGithubTokenState(token);
  }, []);

  const setGuild = useCallback((id: string, name: string) => {
    localStorage.setItem(GUILD_ID_KEY, id);
    localStorage.setItem(GUILD_NAME_KEY, name);
    setGuildIdState(id);
    setGuildNameState(name);
    setSearchResults([]);
  }, []);

  const setPlayerAllyCode = useCallback((code: string) => {
    localStorage.setItem(ALLY_CODE_KEY, code);
    setPlayerAllyCodeState(code);
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

  const requestSnapshot = useCallback(async (allyCode: string) => {
    if (!githubToken || !allyCode) {
      setSnapshotError('Требуется GitHub токен и Ally Code');
      setSnapshotStatus('error');
      return;
    }

    setSnapshotStatus('requesting');
    setSnapshotError(null);

    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_ID}/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ref: 'master',
            inputs: { allyCode },
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`GitHub API error ${res.status}`);
      }

      setSnapshotStatus('pending');
      setPlayerAllyCode(allyCode);

      const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master/data/snapshots/${allyCode}.json`;

      let attempts = 0;
      const maxAttempts = 30;
      const poll = async (): Promise<void> => {
        attempts++;
        try {
          const check = await fetch(rawUrl);
          if (check.ok) {
            const data = await check.json() as ComlinkPlayerResponse;
            setPlayer(data);
            setSnapshotStatus('ready');
            return;
          }
        } catch { }

        if (attempts >= maxAttempts) {
          setSnapshotStatus('error');
          setSnapshotError('Тайм-аут ожидания снепшота');
          return;
        }

        await new Promise((r) => setTimeout(r, 5000));
        return poll();
      };

      setSnapshotStatus('loading');
      poll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setSnapshotError(msg);
      setSnapshotStatus('error');
    }
  }, [githubToken, setPlayerAllyCode]);

  useEffect(() => {
    if (guildId) fetchGuild(guildId);
  }, [guildId, fetchGuild]);

  useEffect(() => {
    if (playerAllyCode && guildId) {
      const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master/data/snapshots/${playerAllyCode}.json`;
      fetch(rawUrl)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) setPlayer(data); })
        .catch(() => {});
    }
  }, [playerAllyCode, guildId]);

  return (
    <AppContext.Provider value={{
      guildId,
      guildName,
      guild,
      player,
      playerAllyCode,
      loading,
      error,
      setGuild,
      searchResults,
      searchLoading,
      searchGuilds,
      githubToken,
      setGithubToken,
      snapshotStatus,
      snapshotError,
      requestSnapshot,
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
