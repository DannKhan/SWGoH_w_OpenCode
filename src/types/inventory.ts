export interface InventoryItem {
  gearId: string;
  name: string;
  quantity: number;
  type: 'gear' | 'material' | 'relic_salvage' | 'signal_data' | 'currency';
  mark?: string;
}

export interface Currency {
  type: string;
  name: string;
  amount: number;
}

export interface PlayerInventory {
  allyCode: string;
  gear: InventoryItem[];
  materials: InventoryItem[];
  currency: Currency[];
  lastUpdated: string;
  source: 'manual' | 'json_import' | 'csv_import';
}
