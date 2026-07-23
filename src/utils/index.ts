export function formatGalaxyPower(gp: number): string {
  if (gp >= 1_000_000) return `${(gp / 1_000_000).toFixed(2)}M`;
  if (gp >= 1_000) return `${(gp / 1_000).toFixed(1)}K`;
  return gp.toString();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function daysSince(dateStr: string): number {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}

export function isActive(lastActivity: string, maxDays: number = 1): boolean {
  return daysSince(lastActivity) <= maxDays;
}

export function calculateGearEfficiency(shopPrice: number, dropRate: number, energyCost: number): number {
  const expectedEnergyPerDrop = energyCost / dropRate;
  return shopPrice / expectedEnergyPerDrop;
}

export function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const map: Record<string, T[]> = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!map[key]) map[key] = [];
    map[key].push(item);
  }
  return map;
}

export function sumBy<T>(items: T[], fn: (item: T) => number): number {
  return items.reduce((acc, item) => acc + fn(item), 0);
}

export function averageBy<T>(items: T[], fn: (item: T) => number): number {
  if (items.length === 0) return 0;
  return sumBy(items, fn) / items.length;
}
