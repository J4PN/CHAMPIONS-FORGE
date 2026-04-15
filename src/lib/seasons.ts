// Pokémon Champions ranked seasons. These are public game facts published by
// The Pokémon Company; we don't track them ourselves so this list needs to be
// updated manually when a new season starts.

export interface Season {
  id: number;
  name: string;
  shortName: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;   // ISO YYYY-MM-DD
  format: "1v1" | "2v2";
  rules: string[];
}

export const SEASONS: Season[] = [
  {
    id: 1,
    name: "Season M-1 — Regulation M-A",
    shortName: "M-1",
    startDate: "2026-04-08",
    endDate: "2026-05-13",
    format: "2v2",
    rules: [
      "Doubles format (2v2)",
      "Bring 6, pick 4",
      "Level 50 auto-level",
      "Stat Points (no IVs/EVs)",
      "Mega Evolution allowed",
      "No duplicate Pokémon",
      "No duplicate held items",
      "20-minute game timer",
    ],
  },
];

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getCurrentSeason(today: string = todayIso()): Season | null {
  const active = SEASONS.find(
    (s) => s.startDate <= today && today <= s.endDate,
  );
  if (active) return active;
  // Fallback: next upcoming, then most recent past.
  const upcoming = SEASONS.filter((s) => s.startDate > today).sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  )[0];
  if (upcoming) return upcoming;
  return SEASONS[SEASONS.length - 1] ?? null;
}

export function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function seasonStatus(season: Season, today: string = todayIso()): {
  state: "upcoming" | "active" | "ended";
  daysIn?: number;
  daysLeft?: number;
} {
  if (today < season.startDate) {
    return { state: "upcoming", daysIn: daysBetween(today, season.startDate) };
  }
  if (today > season.endDate) {
    return { state: "ended" };
  }
  return {
    state: "active",
    daysIn: daysBetween(season.startDate, today),
    daysLeft: daysBetween(today, season.endDate),
  };
}
