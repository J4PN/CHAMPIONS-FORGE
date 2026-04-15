import { BuildSlot } from "./types";

const KEY = "pokecounter.builds.v1";

/** A "build" is a 6-slot configured team. */
export interface SavedBuild {
  id: string;
  name: string;
  slots: BuildSlot[];
  createdAt: number;
}

export function loadBuilds(): SavedBuild[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}

export function writeBuilds(b: SavedBuild[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(b));
  } catch {
    /* noop */
  }
}

export function newBuildId(): string {
  return `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// Champions Stat Point system: 66 total, 32 max per stat.
export const SP_TOTAL_BUDGET = 66;
export const SP_MAX_PER_STAT = 32;

export function spUsed(sp?: BuildSlot["sp"]): number {
  if (!sp) return 0;
  return sp.hp + sp.atk + sp.def + sp.spa + sp.spd + sp.spe;
}

export function defaultSp(): NonNullable<BuildSlot["sp"]> {
  return { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
}
