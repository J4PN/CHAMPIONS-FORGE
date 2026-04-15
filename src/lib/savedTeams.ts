export interface SavedTeam {
  id: string;
  name: string;
  pokemonIds: number[];
  createdAt: number;
  notes?: string;
}

const KEY = "pokecounter.teams.v1";

export function loadSavedTeams(): SavedTeam[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (t) =>
        t &&
        typeof t.id === "string" &&
        typeof t.name === "string" &&
        Array.isArray(t.pokemonIds),
    );
  } catch {
    return [];
  }
}

export function writeSavedTeams(teams: SavedTeam[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(teams));
  } catch {
    /* noop */
  }
}

export function newTeamId(): string {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
