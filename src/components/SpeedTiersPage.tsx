import { useMemo, useState } from "react";
import { POKEMON, spriteUrl } from "@/lib/pokemon";
import { pokemonName, useLang } from "@/lib/i18n";
import { getTier, TIER_COLORS } from "@/lib/tiers";
import { cn } from "@/lib/utils";
import type { PokemonType } from "@/lib/types";

// Champions stat formula (Level 50): floor((2*base + 31 + sp) * 50/100) + 5, * nature
function calcSpeed(base: number, sp: number, natureMod: number): number {
  return Math.floor((Math.floor(((2 * base + 31 + sp) * 50) / 100) + 5) * natureMod);
}

type SpeedTierBucket = {
  label: string;
  color: string;
  min: number;
  max: number;
};

const SPEED_TIERS: SpeedTierBucket[] = [
  { label: "Blazing",   color: "text-rose-500 bg-rose-500/10 border-rose-500/40",     min: 131, max: 999 },
  { label: "Very Fast", color: "text-orange-500 bg-orange-500/10 border-orange-500/40", min: 111, max: 130 },
  { label: "Fast",      color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/40", min: 91,  max: 110 },
  { label: "Average",   color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/40", min: 71, max: 90 },
  { label: "Below Avg", color: "text-sky-500 bg-sky-500/10 border-sky-500/40",         min: 51,  max: 70 },
  { label: "Slow",      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/40", min: 31,  max: 50 },
  { label: "TR Tier",   color: "text-purple-500 bg-purple-500/10 border-purple-500/40", min: 0,   max: 30 },
];

function getTierBucket(spe: number): SpeedTierBucket {
  return SPEED_TIERS.find((t) => spe >= t.min && spe <= t.max) ?? SPEED_TIERS[SPEED_TIERS.length - 1];
}

export function SpeedTiersPage() {
  const { lang, t } = useLang();
  const [sp, setSp] = useState(0);
  const [nature, setNature] = useState<"neutral" | "positive" | "negative">("neutral");
  const [typeFilter, _setTypeFilter] = useState<PokemonType | null>(null);
  const [search, setSearch] = useState("");

  const natureMod = nature === "positive" ? 1.1 : nature === "negative" ? 0.9 : 1.0;

  const sorted = useMemo(() => {
    let list = POKEMON.map((p) => ({
      pokemon: p,
      baseSpe: p.stats?.spe ?? 0,
      finalSpe: calcSpeed(p.stats?.spe ?? 0, sp, natureMod),
      tier: getTier(p.id),
    }));

    if (typeFilter) {
      list = list.filter((e) => e.pokemon.types.includes(typeFilter));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((e) =>
        pokemonName(e.pokemon, lang).toLowerCase().includes(q) ||
        e.pokemon.names.en?.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => b.finalSpe - a.finalSpe);
    return list;
  }, [sp, natureMod, typeFilter, search, lang]);

  const maxFinal = sorted.length > 0 ? sorted[0].finalSpe : 1;

  // Benchmark lines
  const benchmarks = useMemo(() => {
    const lines: { label: string; speed: number }[] = [];
    // Common benchmarks at current SP/nature
    const base100 = calcSpeed(100, sp, natureMod);
    const base80 = calcSpeed(80, sp, natureMod);
    lines.push({ label: `Base 100 (${base100})`, speed: base100 });
    lines.push({ label: `Base 80 (${base80})`, speed: base80 });
    // Tailwind doubles speed
    const twBase80 = calcSpeed(80, sp, natureMod) * 2;
    if (twBase80 <= maxFinal * 1.1) {
      lines.push({ label: `TW Base 80 (${twBase80})`, speed: twBase80 });
    }
    // Scarf 1.5x
    const scarfBase100 = Math.floor(calcSpeed(100, sp, natureMod) * 1.5);
    lines.push({ label: `Scarf Base 100 (${scarfBase100})`, speed: scarfBase100 });
    return lines;
  }, [sp, natureMod, maxFinal]);

  return (
    <main className="container py-6 sm:py-10 max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="font-pixel text-base sm:text-xl uppercase tracking-wider text-primary text-shadow-pixel">
          {t("speedTiersTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t("speedTiersSubtitle")}
        </p>
        <div className="h-[3px] bg-foreground" />
      </header>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* SP slider */}
        <div className="flex-1 min-w-[200px]">
          <label className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground block mb-1">
            {t("speedTiersSP")} : {sp}
          </label>
          <input
            type="range"
            min={0}
            max={32}
            value={sp}
            onChange={(e) => setSp(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[8px] text-muted-foreground font-mono">
            <span>0</span>
            <span>16</span>
            <span>32</span>
          </div>
        </div>

        {/* Nature */}
        <div>
          <label className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground block mb-1">
            Nature
          </label>
          <div className="flex gap-1">
            {(["negative", "neutral", "positive"] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNature(n)}
                className={cn(
                  "px-2 py-1.5 rounded-lg border font-pixel text-[9px] uppercase tracking-wider transition-all",
                  nature === n
                    ? "border-primary/30 bg-primary text-primary-foreground shadow-soft-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-muted shadow-soft",
                )}
              >
                {n === "positive" ? "+Spe" : n === "negative" ? "-Spe" : "="}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground block mb-1">
            {t("search")}
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="..."
            className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm font-mono"
          />
        </div>
      </div>

      {/* Benchmark legend */}
      <div className="flex flex-wrap gap-3 text-[9px] font-mono text-muted-foreground">
        {benchmarks.map((b) => (
          <span key={b.label} className="border-b border-dashed border-muted-foreground pb-0.5">
            {b.label}
          </span>
        ))}
      </div>

      {/* Speed list */}
      <div className="space-y-0.5">
        {sorted.map((entry) => {
          const bucket = getTierBucket(entry.baseSpe);
          const barPct = Math.max(2, Math.round((entry.finalSpe / maxFinal) * 100));
          return (
            <div
              key={entry.pokemon.id}
              className="group relative flex items-center gap-2 rounded-md border border-border/60 bg-card px-2 py-1.5 overflow-hidden hover:border-primary/30 transition-all"
            >
              {/* Speed bar background */}
              <div
                className={cn("absolute inset-y-0 left-0 opacity-20", bucket.color.split(" ")[1])}
                style={{ width: `${barPct}%` }}
              />

              {/* Rank/speed number */}
              <span className="relative w-10 text-right font-pixel text-[11px] tabular-nums text-foreground shrink-0">
                {entry.finalSpe}
              </span>

              {/* Sprite */}
              <img
                src={spriteUrl(entry.pokemon)}
                alt=""
                className="relative pixelated h-7 w-7 object-contain shrink-0"
                loading="lazy"
              />

              {/* Name */}
              <span className="relative flex-1 min-w-0 truncate font-pixel text-[9px] uppercase tracking-wider">
                {pokemonName(entry.pokemon, lang)}
              </span>

              {/* Base speed */}
              <span className="relative text-[9px] font-mono text-muted-foreground shrink-0 hidden sm:inline">
                base {entry.baseSpe}
              </span>

              {/* Tier badge */}
              {entry.tier && (
                <span className={cn("relative font-pixel text-[8px] px-1 rounded-sm border shrink-0", TIER_COLORS[entry.tier])}>
                  {entry.tier}
                </span>
              )}

              {/* Speed tier label */}
              <span className={cn("relative font-pixel text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 hidden md:inline", bucket.color)}>
                {bucket.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] font-mono text-muted-foreground text-center">
        {sorted.length} / {POKEMON.length} {t("speedTiersShown")}
      </p>
    </main>
  );
}
