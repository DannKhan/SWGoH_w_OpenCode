export interface Player {
  allyCode: string;
  playerName: string;
  level: number;
  galaxyPower: number;
  guildId?: string;
  guildName?: string;
  guildMemberLevel?: 'member' | 'officer' | 'leader';
  arenaRank?: number;
  fleetRank?: number;
  lastActivity: string;
  joinedGuildDate: string;
  dailyRaidsCompleted: number;
  pvpBattlesWon: number;
  journeyProgress: Record<string, JourneyStatus>;
}

export interface JourneyStatus {
  completed: boolean;
  stars: number;
  maxStars: number;
  ultimatesUnlocked: string[];
}

export interface PlayerProfile {
  allyCode: string;
  playerName: string;
  level: number;
  galaxyPower: number;
  characterPower: number;
  shipPower: number;
  guildRefId?: string;
  arenaRank?: number;
  fleetRank?: number;
  lastActivity: string;
}
