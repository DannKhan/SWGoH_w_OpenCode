export interface Unit {
  id: string;
  name: string;
  alignment: 'light' | 'dark' | 'neutral';
  factions: string[];
  tags: string[];
  combatType: 'character' | 'ship';
  baseStats: Record<string, number>;
  abilities: Ability[];
  gearLevels: GearLevel[];
  relicTiers: RelicTier[];
  farmLocations: FarmLocation[];
  shardsRequired: number;
}

export interface Ability {
  id: string;
  name: string;
  type: 'basic' | 'special' | 'leader' | 'unique' | 'contract';
  cooldown: number;
  maxLevel: number;
  description: string;
}

export interface GearLevel {
  tier: number;
  requiredGear: GearPiece[];
  stats: Record<string, number>;
}

export interface RelicMaterialCost {
  materialId: string;
  name: string;
  quantity: number;
}

export interface RelicTier {
  level: number;
  materials: RelicMaterialCost[];
  statsBoost: Record<string, number>;
}

export interface GearPiece {
  id: string;
  name: string;
  tier: number;
  type: GearType;
  salvageRequired: number;
  recipes: CraftRecipe[];
  farmLocations: FarmLocation[];
  shopPrices: ShopPrice[];
  mark: 'mk1' | 'mk2' | 'mk3' | 'mk4' | 'mk5' | 'mk6' | 'mk7' | 'mk8' | 'mk9' | 'mk10' | 'mk11' | 'mk12' | 'mk13';
}

export type GearType =
  | 'salvage'
  | 'crafted'
  | 'forge'
  | 'relic_salvage'
  | 'signal_data'
  | 'electrium_conductor'
  | 'bronzium_wiring';

export interface CraftRecipe {
  inputs: CraftIngredient[];
  outputs: CraftIngredient[];
  creditsCost: number;
}

export interface CraftIngredient {
  gearId: string;
  name: string;
  quantity: number;
}

export interface FarmLocation {
  type: 'light_side' | 'dark_side' | 'fleet' | 'cantina' | 'guild_events' | 'shipments' | 'raid' | 'tb' | 'tw' | 'conquest' | 'assault_battle' | 'galactic_challenge';
  node?: string;
  energyType?: 'normal' | 'fleet' | 'cantina';
  energyCost?: number;
  attemptsPerDay?: number;
  dropRate?: number;
}

export interface ShopPrice {
  shop: string;
  currency: CurrencyType;
  cost: number;
  quantity: number;
}

export type CurrencyType =
  | 'credits'
  | 'crystals'
  | 'ally_points'
  | 'guild_currency'
  | 'guild_event_currency'
  | 'cantina_currency'
  | 'fleet_currency'
  | 'squad_arena_currency'
  | 'galactic_championship_currency'
  | 'conquest_currency'
  | 'gac_currency'
  | 'shard_shop_currency'
  | 'prestige_currency';

export interface Mod {
  id: string;
  slot: 'square' | 'arrow' | 'diamond' | 'triangle' | 'cross' | 'circle';
  set: ModSet;
  tier: number;
  level: number;
  primaryStat: ModStat;
  secondaryStats: ModStat[];
  equippedUnitId?: string;
}

export type ModSet =
  | 'health' | 'offense' | 'defense' | 'speed' | 'critical_chance'
  | 'critical_damage' | 'tenacity' | 'potency' | 'accuracy';

export interface ModStat {
  type: string;
  value: number;
  roll: number;
}

export interface Material {
  id: string;
  name: string;
  type: 'relic_salvage' | 'signal_data' | 'bronzium_wiring' | 'chromium_transistor' | 'electrium_conductor' | 'impulse_detector' | 'comlink' | 'capacitor' | 'computron';
  tier: number;
  farmLocations: FarmLocation[];
}

export interface GameData {
  version: string;
  units: Map<string, Unit>;
  gearPieces: Map<string, GearPiece>;
  materials: Map<string, Material>;
  mods: Mod[];
  abilities: Map<string, Ability>;
  lastUpdated: string;
}
