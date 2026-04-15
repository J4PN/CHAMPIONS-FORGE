// Simplified Gen 9 damage calculator. Covers the essentials for VGC counter
// planning: STAB, type effectiveness, physical/special split, attacker/defender
// stats with nature + SP, simple item modifiers (Choice Band/Specs, Life Orb,
// Expert Belt). Does NOT cover: weather, terrain, abilities, status, multi-hit,
// crit, screens. The result is presented as a "min – max" damage range %.

import { POKEMON } from "./pokemon";
import { effectiveness } from "./coverage";
import { Move } from "./types";
import { MOVES } from "./moves";
import { NATURES } from "./natures";
import { BuildSlot, Pokemon, PokemonStats, PokemonType } from "./types";

const NATURE_BY_NAME = new Map(NATURES.map((n) => [n.name, n]));

export interface CalcContext {
  attacker: BuildSlot;
  defender: BuildSlot;
  level?: number; // default 50
}

export interface CalcResult {
  move: string;
  category: "physical" | "special";
  type: PokemonType;
  power: number;
  effectiveness: number;
  stab: boolean;
  minDamage: number;
  maxDamage: number;
  minPct: number;
  maxPct: number;
  ko: "OHKO" | "2HKO" | "3HKO" | "4HKO+" | "—";
}

const monById = new Map(POKEMON.map((p) => [p.id, p]));

function statTotal(
  base: number,
  sp: number,
  natureMod: number,
  level: number,
  isHp: boolean,
): number {
  // Champions formula approximation:
  // HP : ((2 * base + 31 + sp) * level / 100) + level + 10
  // Other: ((2 * base + 31 + sp) * level / 100) + 5, * nature
  const inner = Math.floor(((2 * base + 31 + sp) * level) / 100);
  if (isHp) return inner + level + 10;
  return Math.floor((inner + 5) * natureMod);
}

function natureModFor(nature: string | undefined, statKey: keyof PokemonStats): number {
  if (!nature) return 1;
  const n = NATURE_BY_NAME.get(nature);
  if (!n || !n.plus || !n.minus || statKey === "hp") return 1;
  if (n.plus === statKey) return 1.1;
  if (n.minus === statKey) return 0.9;
  return 1;
}

function effectiveStat(
  mon: Pokemon,
  slot: BuildSlot,
  key: keyof PokemonStats,
  level: number,
): number {
  const base = mon.stats?.[key] ?? 0;
  const sp = slot.sp?.[key] ?? 0;
  const natureMod = natureModFor(slot.nature, key);
  return statTotal(base, sp, natureMod, level, key === "hp");
}

function itemPowerMod(item: string | undefined, category: "physical" | "special"): number {
  if (!item) return 1;
  if (item === "Life Orb") return 1.3;
  if (item === "Expert Belt") return 1.2;
  if (item === "Choice Band" && category === "physical") return 1.5;
  if (item === "Choice Specs" && category === "special") return 1.5;
  if (item === "Choice Scarf") return 1;
  return 1;
}

export function calcMove(
  ctx: CalcContext,
  moveName: string,
): CalcResult | null {
  const move: Move | undefined = MOVES[moveName];
  if (!move || move.category === "status" || !move.power) return null;
  const attacker = monById.get(ctx.attacker.pokemonId);
  const defender = monById.get(ctx.defender.pokemonId);
  if (!attacker || !defender) return null;
  const level = ctx.level ?? 50;

  const isPhysical = move.category === "physical";
  const atkKey = isPhysical ? "atk" : "spa";
  const defKey = isPhysical ? "def" : "spd";

  const A = effectiveStat(attacker, ctx.attacker, atkKey, level);
  const D = effectiveStat(defender, ctx.defender, defKey, level);
  const HP = effectiveStat(defender, ctx.defender, "hp", level);

  // Base damage formula: floor(((2*L/5+2)*Power*A/D)/50 + 2)
  let damage = Math.floor(
    (((2 * level) / 5 + 2) * move.power * A) / D / 50 + 2,
  );

  // STAB
  const stab = attacker.types.includes(move.type);
  if (stab) damage = Math.floor(damage * 1.5);

  // Type effectiveness
  const eff = effectiveness(move.type, defender.types);
  damage = Math.floor(damage * eff);

  // Item modifier on attack power
  const itemMod = itemPowerMod(ctx.attacker.item, move.category);
  damage = Math.floor(damage * itemMod);

  // Random damage roll: 0.85 → 1.00 (16 distinct values)
  const minDamage = Math.floor(damage * 0.85);
  const maxDamage = damage;

  const minPct = Math.round((minDamage / HP) * 1000) / 10;
  const maxPct = Math.round((maxDamage / HP) * 1000) / 10;

  let ko: CalcResult["ko"] = "—";
  if (eff === 0) ko = "—";
  else if (minDamage >= HP) ko = "OHKO";
  else if (minDamage * 2 >= HP) ko = "2HKO";
  else if (minDamage * 3 >= HP) ko = "3HKO";
  else ko = "4HKO+";

  return {
    move: move.name,
    category: move.category as "physical" | "special",
    type: move.type,
    power: move.power,
    effectiveness: eff,
    stab,
    minDamage,
    maxDamage,
    minPct,
    maxPct,
    ko,
  };
}

export function calcAllMoves(ctx: CalcContext): CalcResult[] {
  const moves = ctx.attacker.moves ?? [];
  const out: CalcResult[] = [];
  for (const mName of moves) {
    const r = calcMove(ctx, mName);
    if (r) out.push(r);
  }
  return out.sort((a, b) => b.maxDamage - a.maxDamage);
}
