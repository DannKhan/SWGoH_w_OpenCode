import type { Player } from './player';
import type { GuildRoster } from './roster';

export interface Guild {
  id: string;
  name: string;
  logo: string;
  galaxyPower: number;
  characterPower: number;
  shipPower: number;
  memberCount: number;
  maxMembers: number;
  status: 'open' | 'closed' | 'invite_only';
  description: string;
  requirements: GuildRequirements;
  members: GuildMember[];
  roster?: GuildRoster;
  statistics: GuildStatistics;
  createdDate: string;
}

export interface GuildMember {
  player: Player;
  memberLevel: 'member' | 'officer' | 'leader';
  joinDate: string;
  raidTicketsToday: number;
  raidTicketsWeekly: number;
  lastActivity: string;
}

export interface GuildRequirements {
  minGalaxyPower?: number;
  minLevel?: number;
  minDarkSidePower?: number;
  minLightSidePower?: number;
}

export interface GuildStatistics {
  galacticPower: GuildGpStats;
  raidStats: RaidStats[];
  tbStats: TerritoryBattleStats[];
  twStats: TerritoryWarStats[];
}

export interface GuildGpStats {
  average: number;
  median: number;
  min: number;
  max: number;
  total: number;
}

export interface RaidStats {
  raidId: string;
  raidName: string;
  date: string;
  tier: string;
  rank: number;
  totalDamage: number;
  participationCount: number;
}

export interface TerritoryBattleStats {
  tbId: string;
  tbName: string;
  date: string;
  stars: number;
  maxStars: number;
  combatMissionsCompleted: number;
  specialMissionsCompleted: number;
  platoonsCompleted: number;
  deployments: number;
}

export interface TerritoryWarStats {
  twId: string;
  twName: string;
  date: string;
  result: 'win' | 'loss' | 'draw';
  enemyGuild: string;
  bannersEarned: number;
  bannersMax: number;
  clears: number;
  defensesPlaced: number;
}
