import { useEffect, useMemo, useState } from "react";
import { Trophy, Loader2, TrendingUp, Star } from "lucide-react";
import { POKEMON, spriteUrl } from "@/lib/pokemon";
import { getTier, TIER_COLORS, TIER_ORDER, type Tier } from "@/lib/tiers";
import { pokemonName, useLang } from "@/lib/i18n";
import type { Pokemon } from "@/lib/types";
import { cn } from "@/lib/utils";

type SpeciesStat = { speciesId: number; count: number };
type SpeciesStatsResponse = { total: number; entries: SpeciesStat[] };

type Mode = "static" | "live";

const POKEMON_BY_ID = new Map<number, Pokemon>(POKEMON.map((p) => [p.id, p]));

function apiBase(): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  return envBase ?? "";
}

// Percentile thresholds for live tiers (top %, cumulative).
// S = top 5%, A = next 15%, B = next 25%, C = next 25%, D = rest.
const LIVE_THRESHOLDS: { tier: Tier; pct: number }[] = [
  { tier: "S", pct: 0.05 },
  { tier: "A", pct: 0.2 },
  { tier: "B", pct: 0.45 },
  { tier: "C", pct: 0.7 },
  { tier: "D", pct: 1.0 },
];

/**
 * Compute a tier map from live usage data using percentile thresholds.
 * Only Pokémon with at least 1 usage are ranked; the rest are unranked.
 */
function computeLiveTiers(
  stats: SpeciesStat[],
): Map<number, Tier> {
  const ranked = stats.filter((s) => s.count > 0);
  const total = ranked.length;
  const tierMap = new Map<number, Tier>();
  if (total === 0) return tierMap;

  ranked.forEach((s, i) => {
    const pct = (i + 1) / total;
    for (const { tier, pct: thr } of LIVE_THRESHOLDS) {
      if (pct <= thr) {
        tierMap.set(s.speciesId, tier);
        break;
      }
    }
  });
  return tierMap;
}

export function TierListPage() {
  const { lang, t } = useLang();
  const [mode, setMode] = useState<Mode>("static");
  const [liveStats, setLiveStats] = useState<SpeciesStat[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "live" || liveStats !== null) return;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`${apiBase()}/api/stats/pokemon`, {
      signal: ctrl.signal,
      cache: "no-store",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<SpeciesStatsResponse>;
      })
      .then((j) => setLiveStats(j.entries))
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setError((e as Error).message);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [mode, liveStats]);

  // Build tier → [Pokémon] grouping based on the active mode.
  const grouped = useMemo(() => {
    const out: Record<Tier, Pokemon[]> = { S: [], A: [], B: [], C: [], D: [] };

    if (mode === "live" && liveStats) {
      const tierMap = computeLiveTiers(liveStats);
      // Iterate in usage-sorted order so each tier is internally sorted by rank
      for (const s of liveStats) {
        const tier = tierMap.get(s.speciesId);
        const p = POKEMON_BY_ID.get(s.speciesId);
        if (tier && p) out[tier].push(p);
      }
      return out;
    }

    // Static: use curated tiers
    for (const p of POKEMON) {
      const tier = getTier(p.id);
      if (tier) out[tier].push(p);
    }
    // Sort static tiers by id for stability
    for (const tier of TIER_ORDER) {
      out[tier].sort((a, b) => a.id - b.id);
    }
    return out;
  }, [mode, liveStats]);

  const hasLiveData = mode === "live" && liveStats && liveStats.length > 0;
  const totalRanked = useMemo(
    () =>
      TIER_ORDER.reduce((acc, t) => acc + grouped[t].length, 0),
    [grouped],
  );

  return (
    <main className="container py-6 sm:py-10 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-primary" />
          <h1 className="font-pixel text-base sm:text-xl uppercase tracking-wider text-primary text-shadow-pixel">
            {t("tierListTitle")}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t("tierListSubtitle")}
        </p>
        <div className="h-[3px] bg-foreground" />
      </header>

      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <ModeTab
          active={mode === "static"}
          onClick={() => setMode("static")}
          icon={<Star className="h-3 w-3" />}
          label={t("tierListStatic")}
        />
        <ModeTab
          active={mode === "live"}
          onClick={() => setMode("live")}
          icon={<TrendingUp className="h-3 w-3" />}
          label={t("tierListLive")}
        />
        {mode === "live" && hasLiveData && (
          <span className="ml-auto text-[9px] font-pixel uppercase tracking-wider text-muted-foreground">
            {totalRanked} {t("rankingsPlays")}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!loading && mode === "live" && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {t("rankingsError")}: {error}
        </div>
      )}

      {!loading && mode === "live" && !error && totalRanked === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("tierListLiveEmpty")}
          </p>
        </div>
      )}

      {!loading && totalRanked > 0 && (
        <div className="space-y-3">
          {TIER_ORDER.map((tier) => (
            <TierRow
              key={tier}
              tier={tier}
              pokemon={grouped[tier]}
              lang={lang}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-primary/30 bg-primary text-primary-foreground font-pixel text-[10px] uppercase tracking-wider shadow-soft-primary"
          : "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-pixel text-[10px] uppercase tracking-wider transition-colors shadow-soft"
      }
    >
      {icon}
      {label}
    </button>
  );
}

function TierRow({
  tier,
  pokemon,
  lang,
}: {
  tier: Tier;
  pokemon: Pokemon[];
  lang: string;
}) {
  if (pokemon.length === 0) return null;
  return (
    <div className="flex items-stretch gap-3 rounded-xl border-2 border-border bg-card overflow-hidden shadow-soft">
      <div
        className={cn(
          "flex items-center justify-center w-16 sm:w-20 shrink-0 font-pixel text-3xl sm:text-4xl border-r-2",
          TIER_COLORS[tier],
        )}
      >
        {tier}
      </div>
      <div className="flex-1 min-w-0 p-2 sm:p-3 flex flex-wrap gap-2">
        {pokemon.map((p) => (
          <div
            key={p.id}
            className="group relative flex flex-col items-center"
            title={pokemonName(p, lang as any)}
          >
            <img
              src={spriteUrl(p)}
              alt=""
              className="pixelated h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility =
                  "hidden";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
