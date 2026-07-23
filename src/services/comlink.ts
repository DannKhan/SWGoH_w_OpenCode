const API_BASE = 'https://free-comlink.onrender.com';
const CORS_PROXY = 'https://corsproxy.io/?url=';

export interface ComlinkPlayerResponse {
  allyCode: string;
  playerId: string;
  name: string;
  level: number;
  guildId: string;
  guildName: string;
  guildBannerColor: string;
  guildBannerLogo: string;
  lastActivityTime: string;
  localTimeZoneOffsetMinutes: number;
  playerRating: {
    playerSkillRating: { skillRating: number };
    playerRankStatus: { leagueId: string; divisionId: number };
  };
  rosterUnit: ComlinkRosterUnit[];
  stats: ComlinkPlayerStat[];
  lifetimeSeasonScore: string;
  selectedPlayerPortrait: { id: string };
  selectedPlayerTitle: { id: string };
  guildTypeId: string;
  nucleusId: string;
}

export interface ComlinkRosterUnit {
  id: string;
  definitionId: string;
  currentRarity: number;
  currentLevel: number;
  currentTier: number;
  relic: { currentTier: number };
  skill: ComlinkSkill[];
  equipment: string[];
  equippedStatMod: ComlinkMod[];
  purchasedAbilityId: string[];
}

export interface ComlinkSkill {
  id: string;
  tier: number;
}

export interface ComlinkMod {
  id: string;
  definitionId: string;
  level: number;
  tier: number;
  primaryStat: { stat: string };
  secondaryStat: string[];
  locked: boolean;
}

export interface ComlinkPlayerStat {
  stat: string;
}

export interface ComlinkGuildResponse {
  guild: {
    profile: {
      id: string;
      name: string;
      memberCount: number;
      memberMax: number;
      guildGalacticPower: string;
      bannerColorId: string;
      bannerLogoId: string;
      externalMessageKey: string;
      level: number;
      levelRequirement: number;
      enrollmentStatus: number;
      guildGalacticPowerForRequirement: string;
    };
    member: ComlinkGuildMember[];
    recentTerritoryWarResult: ComlinkTwResult[];
    recentRaidResult: ComlinkRaidResult[];
    territoryBattleStatus: ComlinkTbStatus[];
    territoryBattleResult: ComlinkTbResult[];
    raidStatus: ComlinkRaidStatus[];
  };
}

export interface ComlinkGuildMember {
  playerId: string;
  playerName: string;
  playerLevel: number;
  memberLevel: number;
  galacticPower: string;
  characterGalacticPower: string;
  shipGalacticPower: string;
  lastActivityTime: string;
  guildJoinTime: string;
  lifetimeSeasonScore: string;
  leagueId: string;
  squadPower: number;
  playerPortrait: string;
  playerTitle: string;
  nucleusId: string;
}

export interface ComlinkTwResult {
  territoryWarId: string;
  score: string;
  opponentScore: string;
  endTimeSeconds: string;
  power: number;
}

export interface ComlinkRaidResult {
  raidId: string;
  identifier: string;
  progress: number;
  endTime: string;
  outcome: number;
  duration: string;
  guildRewardScore: string;
}

export interface ComlinkTbStatus {
  definitionId: string;
  completedStars: number;
  endTime: string;
}

export interface ComlinkTbResult {
  tab: string;
  definitionId: string;
}

export interface ComlinkRaidStatus {
  raidId: string;
  status: number;
  endTime: string;
}

class ComlinkService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? API_BASE;
  }

  private async post<T>(path: string, payload: unknown): Promise<T> {
    const targetUrl = `${this.baseUrl}${path}`;
    const url = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
    const body = JSON.stringify({ payload });
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Comlink API error ${response.status}: ${text}`);
    }
    return response.json() as Promise<T>;
  }

  getPlayer(allyCode: string): Promise<ComlinkPlayerResponse> {
    return this.post<ComlinkPlayerResponse>('/player', { allyCode });
  }

  getGuild(guildId: string, includeRecentGuildActivityInfo = true): Promise<ComlinkGuildResponse> {
    return this.post<ComlinkGuildResponse>('/guild', {
      guildId,
      includeRecentGuildActivityInfo,
    });
  }

  getData(items: string, version?: string): Promise<unknown> {
    return this.post('/data', {
      devicePlatform: 'Android',
      includePveUnits: true,
      items,
      requestSegment: 0,
      version: version ?? '',
    });
  }

  getEnums(): Promise<unknown> {
    return this.post('/enums', {});
  }
}

export const comlinkApi = new ComlinkService();
export default ComlinkService;
