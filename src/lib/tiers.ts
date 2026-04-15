import raw from "@/data/tiers.json";

export type Tier = "S" | "A" | "B" | "C" | "D";

const TIERS = raw as Record<Tier, number[]>;

const tierByMonId = new Map<number, Tier>();
for (const tier of ["S", "A", "B", "C", "D"] as Tier[]) {
  for (const id of TIERS[tier] ?? []) {
    if (!tierByMonId.has(id)) tierByMonId.set(id, tier);
  }
}

export function getTier(id: number): Tier | undefined {
  return tierByMonId.get(id);
}

export const TIER_COLORS: Record<Tier, string> = {
  S: "bg-rose-500/20 border-rose-500/70 text-rose-700",
  A: "bg-orange-500/20 border-orange-500/70 text-orange-700",
  B: "bg-yellow-500/20 border-yellow-500/70 text-yellow-700",
  C: "bg-emerald-500/20 border-emerald-500/70 text-emerald-700",
  D: "bg-sky-500/20 border-sky-500/70 text-sky-700",
};

export const TIER_ORDER: Tier[] = ["S", "A", "B", "C", "D"];
