import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { comlinkApi, type ComlinkPlayerResponse, type ComlinkGuildResponse, type ComlinkGuildSearchItem } from '../services/comlink';
import type { GLScanData } from '../data/galacticLegends';

const WORKER_URL = 'https://swgoh-dispatch.dannkhan81.workers.dev';

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
  searchByAllyCodeLoading: boolean;
  searchGuilds: (query: string) => Promise<void>;
  searchByAllyCode: (allyCode: string) => Promise<void>;
  snapshotStatus: 'idle' | 'requesting' | 'pending' | 'loading' | 'ready' | 'error';
  snapshotError: string | null;
  requestSnapshot: (allyCode: string) => Promise<void>;
  glScanData: GLScanData | null;
  glScanStatus: 'idle' | 'scanning' | 'ready' | 'error';
  glScanError: string | null;
  scanGuildGLs: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

const GUILD_ID_KEY = 'swgoh_guild_id';
const GUILD_NAME_KEY = 'swgoh_guild_name';
const ALLY_CODE_KEY = 'swgoh_ally_code';

const REPO_OWNER = 'DannKhan';
const REPO_NAME = 'SWGoH_w_OpenCode';

const SNAPSHOT_RAW = (allyCode: string) =>
  `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/snapshots/data/snapshots/${allyCode}.json`;

const GL_SCAN_RAW = (guildName: string) =>
  `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/snapshots/data/gl-scans/${encodeURIComponent(guildName)}.json`;

async function pollSnapshot(allyCode: string): Promise<ComlinkPlayerResponse> {
  const url = SNAPSHOT_RAW(allyCode);
  const start = Date.now();
  const timeout = 150_000;
  const interval = 5000;

  while (Date.now() - start < timeout) {
    await new Promise((r) => setTimeout(r, interval));
    const res = await fetch(url);
    if (res.ok) {
      return res.json() as Promise<ComlinkPlayerResponse>;
    }
  }
  throw new Error('Тайм-аут ожидания снепшота');
}

async function pollGLScan(guildName: string): Promise<GLScanData> {
  const url = GL_SCAN_RAW(guildName);
  const start = Date.now();
  const timeout = 600_000;
  const interval = 10000;

  while (Date.now() - start < timeout) {
    await new Promise((r) => setTimeout(r, interval));
    const res = await fetch(url);
    if (res.ok) {
      return res.json() as Promise<GLScanData>;
    }
  }
  throw new Error('Тайм-аут сканирования GL');
}

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
  const [searchByAllyCodeLoading, setSearchByAllyCodeLoading] = useState(false);
  const [snapshotStatus, setSnapshotStatus] = useState<'idle' | 'requesting' | 'pending' | 'loading' | 'ready' | 'error'>('idle');
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [glScanData, setGlScanData] = useState<GLScanData | null>(null);
  const [glScanStatus, setGlScanStatus] = useState<'idle' | 'scanning' | 'ready' | 'error'>('idle');
  const [glScanError, setGlScanError] = useState<string | null>(null);

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

  const dispatchSnapshot = useCallback(async (allyCode: string) => {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allyCode }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error ?? `Ошибка ${res.status}`);
    }
  }, []);

  const requestSnapshot = useCallback(async (allyCode: string) => {
    if (!allyCode) {
      setSnapshotError('Введите Ally Code');
      setSnapshotStatus('error');
      return;
    }

    setSnapshotStatus('requesting');
    setSnapshotError(null);

    try {
      await dispatchSnapshot(allyCode);
      setSnapshotStatus('pending');
      setPlayerAllyCode(allyCode);
      setSnapshotStatus('loading');
      const data = await pollSnapshot(allyCode);
      setPlayer(data);
      setSnapshotStatus('ready');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setSnapshotError(msg);
      setSnapshotStatus('error');
    }
  }, [dispatchSnapshot, setPlayerAllyCode]);

  const searchByAllyCode = useCallback(async (allyCode: string) => {
    setSearchByAllyCodeLoading(true);
    setSnapshotStatus('requesting');
    setSnapshotError(null);

    try {
      await dispatchSnapshot(allyCode);
      setSnapshotStatus('pending');
      setPlayerAllyCode(allyCode);
      setSnapshotStatus('loading');
      const data = await pollSnapshot(allyCode);
      setPlayer(data);
      setSnapshotStatus('ready');
      if (data.guildId) {
        setGuild(data.guildId, data.guildName);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setSnapshotError(msg);
      setSnapshotStatus('error');
    } finally {
      setSearchByAllyCodeLoading(false);
    }
  }, [dispatchSnapshot, setGuild, setPlayerAllyCode]);

  const scanGuildGLs = useCallback(async () => {
    if (!guildId || !guildName) return;

    setGlScanStatus('scanning');
    setGlScanError(null);

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'scan-gls', guildId, guildName }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Ошибка ${res.status}`);
      }
      const result = await pollGLScan(guildName);
      setGlScanData(result);
      setGlScanStatus('ready');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setGlScanError(msg);
      setGlScanStatus('error');
    }
  }, [guildId, guildName]);

  useEffect(() => {
    if (guildId) fetchGuild(guildId);
  }, [guildId, fetchGuild]);

  useEffect(() => {
    if (playerAllyCode && guildId) {
      fetch(SNAPSHOT_RAW(playerAllyCode))
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) { setPlayer(data); setSnapshotStatus('ready'); } })
        .catch(() => {});
    }
  }, [playerAllyCode, guildId]);

  useEffect(() => {
    if (guildName && glScanStatus === 'idle') {
      fetch(GL_SCAN_RAW(guildName))
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) { setGlScanData(data); setGlScanStatus('ready'); } })
        .catch(() => {});
    }
  }, [guildName, glScanStatus]);

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
      searchByAllyCodeLoading,
      searchGuilds,
      searchByAllyCode,
      snapshotStatus,
      snapshotError,
      requestSnapshot,
      glScanData,
      glScanStatus,
      glScanError,
      scanGuildGLs,
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
