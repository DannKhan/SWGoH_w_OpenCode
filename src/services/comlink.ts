const COMLINK_BASE_URL = 'https://api.swgoh.help';

export interface ComlinkConfig {
  username: string;
  password: string;
  baseUrl?: string;
}

export class ComlinkService {
  private config: ComlinkConfig;
  private accessToken: string | null = null;

  constructor(config: ComlinkConfig) {
    this.config = config;
  }

  async authenticate(): Promise<string> {
    const url = `${this.config.baseUrl ?? COMLINK_BASE_URL}/auth/signin`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.config.username,
        password: this.config.password,
        grant_type: 'password',
        client_id: '1234567890',
        client_secret: 'abcdefghijklmnopqrstuvwxyz',
      }),
    });

    if (!response.ok) throw new Error('Comlink authentication failed');
    const data = await response.json() as { access_token: string };
    this.accessToken = data.access_token;
    return this.accessToken as string;
  }

  private async request<T>(endpoint: string, body: unknown): Promise<T> {
    if (!this.accessToken) await this.authenticate();

    const url = `${this.config.baseUrl ?? COMLINK_BASE_URL}/${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Comlink request failed: ${endpoint}`);
    return response.json();
  }

  async getGuild(allyCode: string): Promise<unknown> {
    return this.request('guild', { allycode: [allyCode] });
  }

  async getPlayer(allyCode: string): Promise<unknown> {
    return this.request('player', { allycode: [allyCode] });
  }

  async getRoster(allyCode: string): Promise<unknown> {
    return this.request('roster', { allycode: [allyCode] });
  }

  async getUnits(): Promise<unknown> {
    return this.request('data', { collection: 'unitsList' });
  }

  async getGameData(): Promise<unknown> {
    return this.request('data', { collection: 'gameData' });
  }

  async getGuildsByCriteria(criteria: Record<string, unknown>): Promise<unknown> {
    return this.request('guild', criteria);
  }
}

export const createComlinkService = (config: ComlinkConfig): ComlinkService => {
  return new ComlinkService(config);
};
