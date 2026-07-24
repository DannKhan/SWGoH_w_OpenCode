export interface GalacticLegend {
  id: string;
  name: string;
  ship: boolean;
}

const CHARACTER_GLS: GalacticLegend[] = [
  { id: 'GLREY', name: 'Рей', ship: false },
  { id: 'SUPREMELEADERKYLOREN', name: 'Верховный лидер Кайло Рен', ship: false },
  { id: 'GLLEIA', name: 'Лея Органа', ship: false },
  { id: 'GRANDMASTERLUKE', name: 'Мастер джедай Люк', ship: false },
  { id: 'LORDVADER', name: 'Лорд Вейдер', ship: false },
  { id: 'GLHONDO', name: 'Король пиратов Хондо Онака', ship: false },
  { id: 'SITHPALPATINE', name: 'Император вечных Ситхов', ship: false },
  { id: 'JEDIMASTERKENOBI', name: 'Мастер джедай Кеноби', ship: false },
  { id: 'GLAHSOKATANO', name: 'Асока Тано', ship: false },
  { id: 'JABBATHEHUTT', name: 'Джабб Хатт', ship: false },
];

const SHIP_GLS: GalacticLegend[] = [
  { id: 'CAPITALEXECUTOR', name: 'Палач', ship: true },
  { id: 'CAPITALLEVIATHAN', name: 'Левиафан', ship: true },
  { id: 'CAPITALPROFUNDITY', name: 'Пучина', ship: true },
];

export const GALACTIC_LEGENDS: GalacticLegend[] = [...CHARACTER_GLS, ...SHIP_GLS];

export interface GLMemberData {
  name: string;
  gls: string[];
}

export interface GLScanData {
  guildId: string;
  guildName: string;
  scannedAt: number;
  totalMembers: number;
  members: Record<string, GLMemberData>;
  counts: Record<string, number>;
}

export function detectGLs(roster: { definitionId: string }[]): string[] {
  const ids = new Set<string>();
  for (const unit of roster) {
    const baseId = unit.definitionId.split(':')[0];
    if (GALACTIC_LEGENDS.some((gl) => gl.id === baseId)) {
      ids.add(baseId);
    }
  }
  return [...ids];
}

export function getGLById(id: string): GalacticLegend | undefined {
  return GALACTIC_LEGENDS.find((gl) => gl.id === id);
}
