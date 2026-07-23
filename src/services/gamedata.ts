const GAMEDATA_BASE_URL = 'https://swgoh-utils.github.io/gamedata';

export type GamedataLocale = 'ENG_US' | 'CHS_CN' | 'CHT_CN' | 'FRE_FR' | 'GER_DE' | 'ITA_IT' | 'JPN_JP' | 'KOR_KR' | 'POR_BR' | 'RUS_RU' | 'SPA_XM' | 'THA_TH' | 'TUR_TR';

export class GamedataService {
  private baseUrl: string;
  private locale: GamedataLocale;

  constructor(locale: GamedataLocale = 'ENG_US', baseUrl?: string) {
    this.locale = locale;
    this.baseUrl = baseUrl ?? GAMEDATA_BASE_URL;
  }

  private async fetchJson<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}/${this.locale}/${path}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Gamedata fetch failed: ${url}`);
    return response.json();
  }

  async getUnits(): Promise<unknown> {
    return this.fetchJson('units.json');
  }

  async getGear(): Promise<unknown> {
    return this.fetchJson('gear.json');
  }

  async getAbilities(): Promise<unknown> {
    return this.fetchJson('abilities.json');
  }

  async getMods(): Promise<unknown> {
    return this.fetchJson('mods.json');
  }

  async getMaterials(): Promise<unknown> {
    return this.fetchJson('materials.json');
  }

  async getBattles(): Promise<unknown> {
    return this.fetchJson('battles.json');
  }

  async getRaids(): Promise<unknown> {
    return this.fetchJson('raids.json');
  }

  async getTerritoryBattles(): Promise<unknown> {
    return this.fetchJson('territory-battles.json');
  }

  async getLocalization(): Promise<unknown> {
    return this.fetchJson('localization.json');
  }

  async getStatMods(): Promise<unknown> {
    return this.fetchJson('stat-mods.json');
  }
}

export const createGamedataService = (locale?: GamedataLocale): GamedataService => {
  return new GamedataService(locale);
};
