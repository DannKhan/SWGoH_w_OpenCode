const SWGOH_GG_BASE_URL = 'https://swgoh.gg/api';

export interface SwgohGgPlayer {
  ally_code: string;
  username: string;
  level: number;
  galaxy_power: number;
  character_galaxy_power: number;
  ship_galaxy_power: number;
  arena: { rank: number };
  fleet_arena: { rank: number };
  guild: { name: string; url: string };
}

export interface SwgohGgUnit {
  base_id: string;
  name: string;
  url: string;
  image: string;
  power: number;
  combat_type: number;
  alignment: string;
}

export interface SwgohGgGear {
  base_id: string;
  name: string;
  image: string;
  tier: number;
  mark: string;
}

export class SwgohGgService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? SWGOH_GG_BASE_URL;
  }

  private async fetchJson<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}/${path}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`swgoh.gg request failed: ${url}`);
    return response.json();
  }

  async getPlayer(allyCode: string): Promise<SwgohGgPlayer> {
    return this.fetchJson<SwgohGgPlayer>(`player/${allyCode}`);
  }

  async getGuild(guildSlug: string): Promise<unknown> {
    return this.fetchJson(`guild/${guildSlug}`);
  }

  async getUnits(): Promise<SwgohGgUnit[]> {
    return this.fetchJson<SwgohGgUnit[]>('characters');
  }

  async getCounters(unitId: string): Promise<unknown> {
    return this.fetchJson(`counters/${unitId}`);
  }

  getImageUrl(path: string): string {
    return `https://swgoh.gg/static/img/${path}`;
  }

  getUnitImageUrl(unitId: string): string {
    return `https://swgoh.gg/static/img/${unitId}.png`;
  }

  getGearImageUrl(gearId: string): string {
    return `/static/img/gear/${gearId}.png`;
  }
}

export const createSwgohGgService = (): SwgohGgService => {
  return new SwgohGgService();
};
