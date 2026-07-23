export type EventScope = 'global' | 'guild' | 'player';
export type EventCategory = 'tb' | 'tw' | 'raid' | 'journey' | 'conquest' | 'galactic_challenge' | 'assault_battle' | 'seasonal';
export type EventStatus = 'upcoming' | 'active' | 'completed';

export interface GuildEvent {
  id: string;
  name: string;
  scope: EventScope;
  category: EventCategory;
  status: EventStatus;
  startDate: string;
  endDate: string;
  description?: string;
  requirements?: EventRequirement[];
  phases?: EventPhase[];
  results?: EventResult;
}

export interface EventRequirement {
  unitId: string;
  unitName: string;
  minStars: number;
  minGearLevel: number;
  minRelicLevel: number;
  recommended: boolean;
}

export interface EventPhase {
  phaseNumber: number;
  name: string;
  requirements: EventRequirement[];
  operations?: PlatoonOperation[];
  rewards?: EventReward[];
}

export interface PlatoonOperation {
  operationId: string;
  platoons: PlatoonSlot[];
  assignedUnits?: AssignedUnit[];
}

export interface PlatoonSlot {
  slotId: string;
  unitId: string;
  minRelicLevel: number;
  minStars: number;
  assignedBy?: string;
}

export interface AssignedUnit {
  allyCode: string;
  unitId: string;
  unitName: string;
  relicLevel: number;
  stars: number;
}

export interface EventReward {
  type: string;
  name: string;
  quantity: number;
}

export interface EventResult {
  stars: number;
  maxStars: number;
  completionPercentage: number;
  topContributors: EventContributor[];
}

export interface EventContributor {
  allyCode: string;
  playerName: string;
  contribution: number;
  contributionType: 'deployment' | 'combat_missions' | 'special_missions' | 'platoons' | 'damage' | 'banners';
}
