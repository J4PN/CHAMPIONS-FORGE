import { useMemo, useState } from "react";
import { ALL_TYPES, PokemonType, TYPE_CHART, TYPE_COLORS } from "@/lib/types";
import { effectiveness } from "@/lib/coverage";
import { typeLabel, useLang, pokemonName } from "@/lib/i18n";
import { spriteUrl } from "@/lib/pokemon";
import { PokemonSearch } from "./PokemonSearch";
import type { Pokemon } from "@/lib/types";
import { cn } from "@/lib/utils";

type Mode = "attacker" | "defender";

const MULT_STYLE = (m: number) => {
  if (m === 0) return { bg: "bg-zinc-800 border-zinc-900 text-zinc-100", label: "0" };
  if (m === 0.25) return { bg: "bg-red-200 border-red-400 text-red-800", label: "¼" };
  if (m === 0.5) return { bg: "bg-red-100 border-red-300 text-red-700", label: "½" };
  if (m === 1) return { bg: "bg-muted border-border text-muted-foreground", label: "1" };
  if (m === 2) return { bg: "bg-emerald-100 border-emerald-400 text-emerald-800", label: "2" };
  if (m === 4) return { bg: "bg-emerald-300 border-emerald-600 text-emerald-900", label: "4" };
  return { bg: "bg-muted border-border text-muted-foreground", label: String(m) };
};

export function TypeChartPage() {
  const { lang, t } = useLang();
  const [mode, setMode] = useState<Mode>("attacker");
  const [selected, setSelected] = useState<PokemonType | null>(null);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  // Types of the selected Pokemon (for highlighting multiple rows/cols)
  const pokemonTypes = pokemon?.types ?? [];

  // Compute the row for selected type. If attacker mode → effectiveness AGAINST each defender.
  // If defender mode → effectiveness FROM each attacker against selected.
  const rowFor = useMemo(() => {
    if (!selected) return null;
    if (mode === "attacker") {
      const row: Record<PokemonType, number> = {} as Record<PokemonType, number>;
      for (const def of ALL_TYPES) {
        row[def] = TYPE_CHART[selected][def];
      }
      return row;
    } else {
      const row: Record<PokemonType, number> = {} as Record<PokemonType, number>;
      for (const att of ALL_TYPES) {
        row[att] = TYPE_CHART[att][selected];
      }
      return row;
    }
  }, [selected, mode]);

  return (
    <main className="container py-4 sm:py-8">
      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            Type Chart
          </h1>
        </div>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-3">
          18 × 18 interactive matchup table
        </p>
      </header>

      {/* Pokemon search */}
      <div className="max-w-xs mx-auto mb-4">
        <PokemonSearch
          onSelect={(p) => {
            setPokemon(p);
            setSelected(null);
          }}
          excludeIds={pokemon ? [pokemon.id] : []}
          placeholder={t("search")}
        />
      </div>

      {/* Selected Pokemon display */}
      {pokemon && (
        <div className="mb-4 flex items-center justify-center gap-3 rounded-lg border border-primary/40 bg-card p-3 max-w-lg mx-auto">
          <img
            src={spriteUrl(pokemon)}
            alt=""
            className="pixelated h-12 w-12 object-contain"
          />
          <div>
            <div className="font-pixel text-sm uppercase tracking-wider text-foreground">
              {pokemonName(pokemon, lang)}
            </div>
            <div className="flex gap-1 mt-1">
              {pokemon.types.map((tp) => (
                <span
                  key={tp}
                  className={cn(
                    "inline-flex items-center rounded-sm font-pixel uppercase tracking-wider border border-black/30 px-1.5 py-0.5 text-[8px]",
                    TYPE_COLORS[tp],
                  )}
                >
                  {typeLabel(tp, lang)}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPokemon(null)}
            className="ml-auto font-pixel text-muted-foreground hover:text-foreground text-xs"
          >
            x
          </button>
        </div>
      )}

      {/* Defensive matchup panel for selected Pokemon */}
      {pokemon && (
        <div className="mb-6 rounded-lg border-2 border-primary/30 bg-card/80 p-3 max-w-3xl mx-auto">
          <div className="font-pixel text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            {pokemonName(pokemon, lang)} — {mode === "attacker" ? "STAB coverage" : "defensive matchups"}
          </div>
          {mode === "defender" ? (
            <PokemonDefenseRow types={pokemon.types} lang={lang} />
          ) : (
            <SelectedRow
              row={Object.fromEntries(
                ALL_TYPES.map((def) => [
                  def,
                  Math.max(...pokemon.types.map((att) => TYPE_CHART[att][def])),
                ]),
              ) as Record<PokemonType, number>}
              lang={lang}
            />
          )}
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-2 gap-1 rounded-sm border-2 border-border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setMode("attacker")}
            className={cn(
              "px-3 py-1.5 rounded-sm font-pixel text-[9px] uppercase tracking-wider transition-colors",
              mode === "attacker"
                ? "bg-primary text-primary-foreground shadow-soft-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Attacker view
          </button>
          <button
            type="button"
            onClick={() => setMode("defender")}
            className={cn(
              "px-3 py-1.5 rounded-sm font-pixel text-[9px] uppercase tracking-wider transition-colors",
              mode === "defender"
                ? "bg-primary text-primary-foreground shadow-soft-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Defender view
          </button>
        </div>
      </div>

      {/* Type selector */}
      <div className="flex flex-wrap gap-1 justify-center mb-6">
        {ALL_TYPES.map((tp) => {
          const active = selected === tp;
          return (
            <button
              key={tp}
              type="button"
              onClick={() => setSelected(active ? null : tp)}
              className={cn(
                "transition-all",
                active ? "ring-2 ring-primary scale-110" : "opacity-70 hover:opacity-100",
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center rounded-sm font-pixel uppercase tracking-wider border-2 border-black/30 px-2 py-1 text-[9px] shadow-[1px_1px_0_0_rgba(0,0,0,0.6)]",
                  TYPE_COLORS[tp],
                )}
              >
                {typeLabel(tp, lang)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected type detail */}
      {selected && rowFor && (
        <div className="mb-6 rounded-sm border-2 border-primary/50 bg-card/80 p-3 max-w-3xl mx-auto">
          <div className="font-pixel text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            {mode === "attacker"
              ? `When ${typeLabel(selected, lang)} attacks...`
              : `When attacking a ${typeLabel(selected, lang)} type...`}
          </div>
          <SelectedRow row={rowFor} lang={lang} />
        </div>
      )}

      {/* Full chart */}
      <div className="overflow-x-auto rounded-sm border-2 border-border bg-card/40">
        <table className="border-collapse min-w-full text-[8px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-card/95 p-1 text-right text-[8px] font-pixel uppercase text-muted-foreground border-r-2 border-border">
                ATK ↓ / DEF →
              </th>
              {ALL_TYPES.map((def) => (
                <th
                  key={def}
                  onClick={() => setSelected(def)}
                  className="p-1 cursor-pointer hover:bg-accent/20 transition-colors"
                  title={typeLabel(def, lang)}
                >
                  <span
                    className={cn(
                      "inline-block px-1 py-0.5 rounded-sm border border-black/30 font-pixel text-[7px] uppercase",
                      TYPE_COLORS[def],
                    )}
                  >
                    {typeLabel(def, lang).slice(0, 3)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_TYPES.map((att) => (
              <tr key={att}>
                <th
                  onClick={() => setSelected(att)}
                  className="sticky left-0 z-10 bg-card/95 p-1 text-right cursor-pointer hover:bg-accent/20 transition-colors border-r-2 border-border"
                  title={typeLabel(att, lang)}
                >
                  <span
                    className={cn(
                      "inline-block px-1 py-0.5 rounded-sm border border-black/30 font-pixel text-[7px] uppercase",
                      TYPE_COLORS[att],
                    )}
                  >
                    {typeLabel(att, lang).slice(0, 3)}
                  </span>
                </th>
                {ALL_TYPES.map((def) => {
                  const m = TYPE_CHART[att][def];
                  const style = MULT_STYLE(m);
                  const highlighted =
                    (selected &&
                      ((mode === "attacker" && att === selected) ||
                        (mode === "defender" && def === selected))) ||
                    (pokemon &&
                      ((mode === "attacker" && pokemonTypes.includes(att)) ||
                        (mode === "defender" && pokemonTypes.includes(def))));
                  return (
                    <td
                      key={def}
                      className={cn(
                        "p-0 text-center border border-border/30",
                        style.bg,
                        highlighted && "ring-2 ring-primary z-20 relative",
                      )}
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-pixel text-[9px]">
                        {style.label}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {[0, 0.5, 1, 2].map((m) => {
          const s = MULT_STYLE(m);
          return (
            <div
              key={m}
              className={cn(
                "inline-flex items-center gap-2 px-2 py-1 rounded-sm border-2 font-pixel text-[8px] uppercase",
                s.bg,
              )}
            >
              {s.label}
              <span className="opacity-70">
                {m === 0 ? "no effect" : m === 0.5 ? "resists" : m === 1 ? "neutral" : "super effective"}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function PokemonDefenseRow({
  types,
  lang,
}: {
  types: PokemonType[];
  lang: import("@/lib/i18n").Lang;
}) {
  const buckets: Record<string, PokemonType[]> = { "4x": [], "2x": [], "1x": [], "0.5x": [], "0.25x": [], "0x": [] };
  for (const att of ALL_TYPES) {
    const m = effectiveness(att, types);
    const key = m >= 4 ? "4x" : m >= 2 ? "2x" : m === 0 ? "0x" : m <= 0.25 ? "0.25x" : m <= 0.5 ? "0.5x" : "1x";
    buckets[key].push(att);
  }
  return (
    <div className="space-y-1.5">
      {Object.entries(buckets).map(([k, list]) => {
        if (list.length === 0) return null;
        const color = k === "4x" || k === "2x" ? "text-red-600" : k === "0x" || k === "0.25x" || k === "0.5x" ? "text-emerald-600" : "";
        return (
          <div key={k} className="flex items-start gap-2">
            <div className={cn("w-10 font-pixel text-[10px] text-shadow-pixel shrink-0", color)}>{k}</div>
            <div className="flex flex-wrap gap-1 flex-1">
              {list.map((tp) => (
                <span
                  key={tp}
                  className={cn(
                    "inline-flex items-center rounded-sm font-pixel uppercase tracking-wider border border-black/30 px-1.5 py-0.5 text-[8px]",
                    TYPE_COLORS[tp],
                  )}
                >
                  {typeLabel(tp, lang)}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SelectedRow({
  row,
  lang,
}: {
  row: Record<PokemonType, number>;
  lang: import("@/lib/i18n").Lang;
}) {
  const buckets: Record<string, PokemonType[]> = { "4×": [], "2×": [], "1×": [], "½×": [], "¼×": [], "0×": [] };
  for (const tp of ALL_TYPES) {
    const m = row[tp];
    const key = m === 4 ? "4×" : m === 2 ? "2×" : m === 0.5 ? "½×" : m === 0.25 ? "¼×" : m === 0 ? "0×" : "1×";
    buckets[key].push(tp);
  }
  return (
    <div className="space-y-1.5">
      {Object.entries(buckets).map(([k, list]) => {
        if (list.length === 0) return null;
        return (
          <div key={k} className="flex items-start gap-2">
            <div className="w-8 font-pixel text-[10px] text-shadow-pixel">{k}</div>
            <div className="flex flex-wrap gap-1 flex-1">
              {list.map((tp) => (
                <span
                  key={tp}
                  className={cn(
                    "inline-flex items-center rounded-sm font-pixel uppercase tracking-wider border border-black/30 px-1.5 py-0.5 text-[8px]",
                    TYPE_COLORS[tp],
                  )}
                >
                  {typeLabel(tp, lang)}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
