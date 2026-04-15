// Movepool lookup — lazy-loaded so it stays out of the initial bundle.
// Only the AdvancedTeamBuilder + the Pokédex detail modal need this.

let cache: Record<number, string[]> | null = null;
let inflight: Promise<Record<number, string[]>> | null = null;

export async function loadMovepools(): Promise<Record<number, string[]>> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = import("@/data/pokemon-moves.json").then((m) => {
    cache = m.default as unknown as Record<number, string[]>;
    return cache;
  });
  return inflight;
}

export function getMovepool(id: number): string[] | undefined {
  return cache?.[id];
}
