import { Pokemon, ALL_TYPES, PokemonType, TYPE_COLORS } from "@/lib/types";
import { bestStabMultiplier } from "@/lib/coverage";
import { typeLabel, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * For each of the 18 types, shows whether the current "my team" has a STAB
 * attacker that hits that type for >=2x.
 */
export function TypeCoverageGrid({ myTeam }: { myTeam: Pokemon[] }) {
  const { lang } = useLang();
  const covered = new Set<PokemonType>();
  for (const t of ALL_TYPES) {
    const dummy: Pokemon = {
      id: -1,
      types: [t],
      mega: false,
      names: {},
    };
    if (myTeam.some((m) => bestStabMultiplier(m, dummy) >= 2)) covered.add(t);
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
      {ALL_TYPES.map((t) => {
        const ok = covered.has(t);
        return (
          <div
            key={t}
            className={cn(
              "flex items-center justify-center rounded-sm border-2 border-black/30 py-1 text-[8px] font-pixel uppercase shadow-[1px_1px_0_0_rgba(0,0,0,0.6)]",
              ok ? TYPE_COLORS[t] : "bg-muted/40 text-muted-foreground/50 line-through",
            )}
            title={ok ? `${t} couvert` : `${t} non couvert`}
          >
            {typeLabel(t, lang)}
          </div>
        );
      })}
    </div>
  );
}
