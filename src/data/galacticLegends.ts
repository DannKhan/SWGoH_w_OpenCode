export interface GalacticLegend {
  id: string;
  name: string;
  icon: string;
}

export const GALACTIC_LEGENDS: GalacticLegend[] = [
  { id: 'REYJEDITRAINING', name: 'GL Rey', icon: 'rey' },
  { id: 'SUPREMELEADERKYLOREN', name: 'SLKR', icon: 'slkr' },
  { id: 'SITHEMPEROR', name: 'SEE', icon: 'see' },
  { id: 'JEDIMASTERLUKESKYWALKER', name: 'JMLS', icon: 'jmls' },
  { id: 'LORDVADER', name: 'Lord Vader', icon: 'lv' },
  { id: 'JABBATHEHUTT', name: 'Jabba', icon: 'jabba' },
  { id: 'GLLEIA', name: 'GL Leia', icon: 'leia' },
  { id: 'QUEENAMIDALA', name: 'GL Queen', icon: 'queen' },
  { id: 'GLAHSOKA', name: 'GL Ahsoka', icon: 'ahsoka' },
];

export function detectGLs(
  roster: { definitionId: string; currentRarity: number }[]
): GalacticLegend[] {
  return GALACTIC_LEGENDS.filter((gl) =>
    roster.some((u) => {
      const baseId = u.definitionId.split(':')[0];
      return baseId === gl.id;
    })
  );
}
