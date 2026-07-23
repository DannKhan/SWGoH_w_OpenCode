import type { Mod } from './gameData';

export interface RosterUnit {
  unitId: string;
  unitName: string;
  combatType: 'character' | 'ship';
  stars: number;
  gearLevel: number;
  gearPieces: string[];
  relicLevel: number;
  power: number;
  level: number;
  abilities: RosterAbility[];
  mods: Mod[];
  equippedGear: string[];
}

export interface RosterAbility {
  abilityId: string;
  tier: number;
  isOmega: boolean;
  isZeta: boolean;
}

export interface PlayerRoster {
  allyCode: string;
  units: RosterUnit[];
  lastUpdated: string;
}

export interface GuildRoster {
  guildId: string;
  memberCount: number;
  units: Map<string, GuildUnitAggregation>;
  lastUpdated: string;
}

export interface GuildUnitAggregation {
  unitId: string;
  unitName: string;
  totalCount: number;
  relicCounts: Record<number, number>;
  gearCounts: Record<number, number>;
  starCounts: Record<number, number>;
  averagePower: number;
  memberAllyCodes: string[];
  relicsAboveLevel: Record<number, string[]>;
}

export interface RosterCoverage {
  unitId: string;
  unitName: string;
  guildTotal: number;
  atRelic5: number;
  atRelic7: number;
  atGear12: number;
  atGear13: number;
  membersAtRelic5: string[];
  membersAtRelic7: string[];
}
