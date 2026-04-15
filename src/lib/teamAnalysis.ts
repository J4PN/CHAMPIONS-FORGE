// Measurable analysis of a 6-Pokémon team.

import { ALL_TYPES, Pokemon, PokemonType } from "./types";
import { effectiveness } from "./coverage";
import { MOVES } from "./moves";

type Severity = "info" | "warn" | "critical";

export type Suggestion =
  | { severity: Severity; kind: "incomplete"; size: number; missing: number }
  | { severity: Severity; kind: "coverageHoles"; count: number; types: PokemonType[] }
  | { severity: Severity; kind: "weaknessCritical"; count: number; size: number; type: PokemonType }
  | { severity: Severity; kind: "weaknessShared"; count: number; type: PokemonType }
  | { severity: Severity; kind: "slow"; avg: number }
  | { severity: Severity; kind: "fast"; avg: number }
  | { severity: Severity; kind: "imbalanced"; phys: number; spe: number };

export interface TypeCount {
  type: PokemonType;
  count: number;
  mons: number[]; // ids of mons contributing
}

export interface AnalysisResult {
  teamSize: number;
  /** Types the team can hit ≥2× with STAB + movepool (if provided). */
  offensiveCoverage: PokemonType[];
  /** Types the team CANNOT hit ≥2× — holes in coverage. */
  coverageHoles: PokemonType[];
  /** Types that hit ≥2 members of the team ≥2× — shared weaknesses. */
  sharedWeaknesses: TypeCount[];
  /** Average speed stat across the team. */
  averageSpeed: number;
  /** Split of physical vs special attackers (based on higher of atk/spa). */
  physicalAttackers: number;
  specialAttackers: number;
  /** Average bulk (HP + (def+spd)/2). */
  averageBulk: number;
  /** Actionable suggestions derived from the metrics. Rendered by the
   *  TeamAnalyzer component using i18n keys for full multilang support. */
  suggestions: Suggestion[];
  /** Overall 0-100 score combining coverage, safety and balance. */
  overallScore: number;
}

/** Compute the set of attacking types a Pokémon actually has access to. */
function attackingTypesFor(
  mon: Pokemon,
  movepool?: string[],
): PokemonType[] {
  const set = new Set<PokemonType>(mon.types);
  if (movepool) {
    for (const mname of movepool) {
      const m = MOVES[mname];
      if (m && m.power && m.power >= 60 && m.category !== "status") {
        set.add(m.type);
      }
    }
  }
  return [...set];
}

export function analyzeTeam(
  team: Pokemon[],
  movepools?: Record<number, string[]>,
): AnalysisResult {
  const teamSize = team.length;
  const suggestions: Suggestion[] = [];

  // 1. Offensive coverage: for each defender type, can anyone hit it ≥2×?
  const offensiveCoverage: PokemonType[] = [];
  const coverageHoles: PokemonType[] = [];
  for (const defType of ALL_TYPES) {
    let hitBySomeone = false;
    for (const mon of team) {
      const atkTypes = attackingTypesFor(mon, movepools?.[mon.id]);
      for (const atk of atkTypes) {
        if (effectiveness(atk, [defType]) >= 2) {
          hitBySomeone = true;
          break;
        }
      }
      if (hitBySomeone) break;
    }
    if (hitBySomeone) offensiveCoverage.push(defType);
    else coverageHoles.push(defType);
  }

  // 2. Shared weaknesses: for each attacker type, count how many mons it hits ≥2×
  const weaknessMap: TypeCount[] = [];
  for (const atkType of ALL_TYPES) {
    const monsHit: number[] = [];
    for (const mon of team) {
      if (effectiveness(atkType, mon.types) >= 2) {
        monsHit.push(mon.id);
      }
    }
    if (monsHit.length >= 2) {
      weaknessMap.push({ type: atkType, count: monsHit.length, mons: monsHit });
    }
  }
  weaknessMap.sort((a, b) => b.count - a.count);

  // 3. Speed + role distribution
  let totalSpeed = 0;
  let physicalAttackers = 0;
  let specialAttackers = 0;
  let totalBulk = 0;
  for (const mon of team) {
    const s = mon.stats;
    if (!s) continue;
    totalSpeed += s.spe;
    totalBulk += s.hp + (s.def + s.spd) / 2;
    if (s.atk >= s.spa) physicalAttackers++;
    else specialAttackers++;
  }
  const averageSpeed = teamSize > 0 ? Math.round(totalSpeed / teamSize) : 0;
  const averageBulk = teamSize > 0 ? Math.round(totalBulk / teamSize) : 0;

  // 4. Generate suggestions (structured — rendered with i18n in the component)
  if (teamSize < 6) {
    suggestions.push({
      severity: "info",
      kind: "incomplete",
      size: teamSize,
      missing: 6 - teamSize,
    });
  }

  if (coverageHoles.length > 0) {
    suggestions.push({
      severity: coverageHoles.length >= 5 ? "critical" : coverageHoles.length >= 3 ? "warn" : "info",
      kind: "coverageHoles",
      count: coverageHoles.length,
      types: coverageHoles,
    });
  }

  for (const w of weaknessMap) {
    if (w.count >= 4) {
      suggestions.push({
        severity: "critical",
        kind: "weaknessCritical",
        count: w.count,
        size: teamSize,
        type: w.type,
      });
    } else if (w.count >= 3) {
      suggestions.push({
        severity: "warn",
        kind: "weaknessShared",
        count: w.count,
        type: w.type,
      });
    }
  }

  if (teamSize >= 4) {
    if (averageSpeed < 70) {
      suggestions.push({ severity: "warn", kind: "slow", avg: averageSpeed });
    } else if (averageSpeed > 110) {
      suggestions.push({ severity: "info", kind: "fast", avg: averageSpeed });
    }
    if (Math.abs(physicalAttackers - specialAttackers) >= 5) {
      suggestions.push({
        severity: "warn",
        kind: "imbalanced",
        phys: physicalAttackers,
        spe: specialAttackers,
      });
    }
  }

  // 5. Overall score 0-100
  // Weights: coverage 40 %, defensive safety 35 %, balance 25 %
  const coverageScore = (offensiveCoverage.length / ALL_TYPES.length) * 40;
  const shareWeakPenalty = weaknessMap.reduce(
    (acc, w) => acc + (w.count >= 4 ? 10 : w.count >= 3 ? 5 : 2),
    0,
  );
  const defensiveScore = Math.max(0, 35 - shareWeakPenalty);
  const balanceScore =
    teamSize >= 4
      ? 25 - Math.min(15, Math.abs(physicalAttackers - specialAttackers) * 3)
      : (teamSize / 6) * 25;
  const overallScore = Math.round(
    coverageScore + defensiveScore + balanceScore,
  );

  return {
    teamSize,
    offensiveCoverage,
    coverageHoles,
    sharedWeaknesses: weaknessMap,
    averageSpeed,
    physicalAttackers,
    specialAttackers,
    averageBulk,
    suggestions,
    overallScore: Math.max(0, Math.min(100, overallScore)),
  };
}
