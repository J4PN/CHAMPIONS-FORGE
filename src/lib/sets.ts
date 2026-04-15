import raw from "@/data/common-sets.json";
import { BuildSlot, PokemonStats } from "./types";

export interface CommonSet {
  name: string;
  ability: string;
  item: string;
  nature: string;
  moves: string[];
  sp: PokemonStats;
}

const SETS = raw as Record<string, CommonSet[]>;

export function getCommonSets(monId: number): CommonSet[] {
  return SETS[String(monId)] ?? [];
}

export function applySet(slot: BuildSlot, set: CommonSet): BuildSlot {
  return {
    ...slot,
    ability: set.ability,
    item: set.item,
    nature: set.nature,
    moves: [...set.moves],
    sp: { ...set.sp },
  };
}
