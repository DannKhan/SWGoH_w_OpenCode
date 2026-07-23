export interface Bundle {
  id: string;
  name: string;
  description: string;
  cost: BundleCost[];
  contents: BundleContent[];
  availability: 'permanent' | 'limited_time' | 'one_time';
  category: 'gear' | 'character' | 'ship' | 'relic' | 'mod' | 'currency' | 'mixed';
  startDate?: string;
  endDate?: string;
  valueAnalysis?: BundleValueAnalysis;
  imageUrl?: string;
}

export interface BundleCost {
  currencyType: string;
  currencyName: string;
  amount: number;
}

export interface BundleContent {
  itemId: string;
  itemName: string;
  itemType: 'gear' | 'character_shard' | 'ship_shard' | 'material' | 'relic_salvage' | 'signal_data' | 'mod' | 'currency' | 'energy' | 'xp';
  quantity: number;
  dropRate?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export interface BundleValueAnalysis {
  totalCrystalValue: number;
  costInCrystals: number;
  efficiency: number;
  breakdown: BundleValueItem[];
}

export interface BundleValueItem {
  itemName: string;
  quantity: number;
  crystalValue: number;
  bestAlternative: string;
  alternativeCost: number;
}
