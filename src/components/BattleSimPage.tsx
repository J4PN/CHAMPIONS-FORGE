import { useEffect, useMemo, useState } from "react";
import { Pokemon } from "@/lib/types";
import { POKEMON, spriteUrl } from "@/lib/pokemon";
import { pokemonName, useLang } from "@/lib/i18n";
import { formatSuggestion } from "@/lib/formatSuggestion";
import {
  runSimulation,
  type SimulationResult,
  type MatchupResult,
  type Archetype,
} from "@/lib/battleSim";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Swords,
  Sparkles,
  AlertTriangle,
  Trophy,
  X,
  Shuffle,
  HelpCircle,
  Sun,
  CloudRain,
  RefreshCw,
  Wind,
  Shield,
  Palette,
  Flame,
  BarChart3,
  Users,
} from "lucide-react";
import { PokemonSearch } from "./PokemonSearch";

const POKEMON_BY_ID = new Map(POKEMON.map((p) => [p.id, p]));

const STORAGE_KEY = "pokecounter.myteam.v1";

function loadMyTeamIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as number[];
  } catch {
    return [];
  }
}

function saveMyTeamIds(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* noop */
  }
}

const POOL_OPTIONS: {
  key: Archetype | "mixed";
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "mixed", label: "Mixed", Icon: Shuffle },
  { key: "random", label: "Random", Icon: HelpCircle },
  { key: "meta", label: "Meta", Icon: Trophy },
  { key: "sun", label: "Sun", Icon: Sun },
  { key: "rain", label: "Rain", Icon: CloudRain },
  { key: "trick-room", label: "Trick Room", Icon: RefreshCw },
  { key: "tailwind", label: "Tailwind", Icon: Wind },
  { key: "hyper-offense", label: "Hyper Offense", Icon: Flame },
  { key: "bulky", label: "Bulky", Icon: Shield },
  { key: "mono", label: "Mono-type", Icon: Palette },
];

const COUNT_OPTIONS = [500, 1000, 2500, 5000, 10000];

export function BattleSimPage() {
  const { t, lang } = useLang();
  const poolLabels: Record<Archetype | "mixed", string> = {
    mixed: t("simPoolMixed"),
    random: t("simPoolRandom"),
    meta: t("simPoolMeta"),
    sun: t("simPoolSun"),
    rain: t("simPoolRain"),
    "trick-room": t("simPoolTrickRoom"),
    tailwind: t("simPoolTailwind"),
    "hyper-offense": t("simPoolHyperOff"),
    bulky: t("simPoolBulky"),
    mono: t("simPoolMono"),
    balance: "Balance",
  };
  const monById = useMemo(() => new Map(POKEMON.map((p) => [p.id, p])), []);
  const [myTeamIds, setMyTeamIds] = useState<number[]>(() => loadMyTeamIds());
  const [pool, setPool] = useState<Archetype | "mixed">("mixed");
  const [count, setCount] = useState(500);
  const [bringN, setBringN] = useState<3 | 4>(4);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);

  const myTeam = useMemo(
    () => myTeamIds.map((id) => monById.get(id)).filter((p): p is Pokemon => !!p),
    [myTeamIds, monById],
  );

  // Persist every change
  useEffect(() => {
    saveMyTeamIds(myTeamIds);
  }, [myTeamIds]);

  function addToTeam(p: Pokemon) {
    setMyTeamIds((prev) =>
      prev.length >= 6 || prev.includes(p.id) ? prev : [...prev, p.id],
    );
  }
  function removeFromTeam(id: number) {
    setMyTeamIds((prev) => prev.filter((x) => x !== id));
  }
  function resetTeam() {
    setMyTeamIds([]);
  }

  function handleRun() {
    if (myTeam.length < 4) return;
    setRunning(true);
    // Defer so the "Running..." state renders before we block on compute
    setTimeout(() => {
      const r = runSimulation(myTeam, { count, pool, bringN });
      setResult(r);
      setRunning(false);
    }, 50);
  }

  return (
    <main className="container py-6 sm:py-10 max-w-4xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            {t("simTitle")}
          </h1>
        </div>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-3">
          {t("simSubtitle")}
        </p>
      </header>

      {/* Team editor — always live, no edit toggle */}
      <section className="mb-8">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-2xl text-primary tabular-nums">
            01
          </span>
          <h2 className="font-pixel text-base uppercase tracking-wider text-foreground">
            {t("simYourTeam")}
          </h2>
          <span className="ml-auto text-[10px] text-muted-foreground font-mono tabular-nums">
            {myTeam.length}/6
          </span>
          {myTeamIds.length > 0 && (
            <button
              type="button"
              onClick={resetTeam}
              className="font-pixel text-[9px] uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors"
              title="Reset team"
            >
              ↺
            </button>
          )}
        </div>
        <div className="h-[3px] bg-foreground mb-4" />

        <div className="mb-3">
          <PokemonSearch
            onSelect={addToTeam}
            excludeIds={myTeamIds}
            disabled={myTeamIds.length >= 6}
            placeholder={t("simAddPlaceholder")}
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const p = myTeam[i];
            if (!p) {
              return (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/40 flex items-center justify-center text-muted-foreground text-xl"
                >
                  +
                </div>
              );
            }
            return (
              <div
                key={p.id}
                className="relative flex flex-col items-center group"
              >
                <img
                  src={spriteUrl(p)}
                  alt={p.names.en ?? ""}
                  className="pixelated h-16 w-16"
                />
                <span className="font-pixel text-[8px] uppercase truncate max-w-full">
                  {pokemonName(p, lang)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromTeam(p.id)}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full border border-destructive/30 bg-destructive text-destructive-foreground flex items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Config */}
      <section className="mb-8">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-2xl text-primary tabular-nums">
            02
          </span>
          <h2 className="font-pixel text-base uppercase tracking-wider text-foreground">
            {t("simConfig")}
          </h2>
        </div>
        <div className="h-[3px] bg-foreground mb-4" />

        <div className="space-y-4">
          {/* Format */}
          <div>
            <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground mb-2">
              {t("simFormat")}
            </div>
            <div className="flex gap-2">
              {[3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBringN(n as 3 | 4)}
                  className={cn(
                    "px-4 py-2 rounded-lg border font-pixel text-[10px] uppercase tracking-wider transition-all",
                    bringN === n
                      ? "border-primary/30 bg-primary text-primary-foreground shadow-soft-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted shadow-soft",
                  )}
                >
                  {n === 3 ? "1v1 · Bring 3" : "2v2 · Bring 4"}
                </button>
              ))}
            </div>
          </div>

          {/* Pool */}
          <div>
            <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground mb-2">
              {t("simOpponentPool")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POOL_OPTIONS.map((p) => {
                const Icon = p.Icon;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPool(p.key)}
                    className={cn(
                      "px-3 py-1.5 rounded-full border font-pixel text-[9px] uppercase tracking-wider transition-all flex items-center gap-1.5",
                      pool === p.key
                        ? "border-primary/30 bg-primary text-primary-foreground shadow-soft-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-3 w-3 shrink-0" />
                    <span>{poolLabels[p.key]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Count */}
          <div>
            <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground mb-2">
              {t("simCount")}
            </div>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={cn(
                    "px-4 py-2 rounded-lg border font-pixel text-[10px] uppercase tracking-wider transition-all tabular-nums",
                    count === n
                      ? "border-primary/30 bg-primary text-primary-foreground shadow-soft-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted shadow-soft",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={handleRun}
            disabled={running || myTeam.length < 4}
            className="w-full"
          >
            <Swords className="h-4 w-4" />
            {running ? t("simRunning") : t("simRun")}
          </Button>
        </div>
      </section>

      {/* Results */}
      {result && (
        <section>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-pixel text-2xl text-primary tabular-nums">
              03
            </span>
            <h2 className="font-pixel text-base uppercase tracking-wider text-foreground">
              {t("simResults")}
            </h2>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono tabular-nums">
              {result.matchups.length} {t("simBattles")}
            </span>
          </div>
          <div className="h-[3px] bg-foreground mb-4" />

          {/* Big win rate + insight — top row */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
            <div className="text-center shrink-0">
              <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground">
                {t("simWinRate")}
              </div>
              <div
                className={cn(
                  "font-pixel text-5xl sm:text-6xl mt-1 tabular-nums",
                  result.overallWinRate >= 65
                    ? "text-emerald-600"
                    : result.overallWinRate >= 45
                      ? "text-yellow-600"
                      : "text-red-600",
                )}
              >
                {result.overallWinRate}
                <span className="text-xl text-muted-foreground">%</span>
              </div>
            </div>
            {result.analysisHint && (
              <div className="flex-1 rounded-lg border border-accent/50 bg-accent/10 p-3 flex items-start gap-2">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-accent-foreground" />
                <span className="text-[10px] leading-relaxed text-accent-foreground">
                  <strong className="font-pixel text-[9px] uppercase">{t("simInsight")}:</strong>{" "}
                  {formatSuggestion(result.analysisHint, t, lang)}
                </span>
              </div>
            )}
          </div>

          {/* Grid layout: blocks side by side */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Best matchups */}
            <div className="rounded-xl border border-border bg-card/50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-emerald-600" />
                <span className="font-pixel text-[10px] uppercase tracking-wider text-emerald-600">
                  {t("simBestMatchups")}
                </span>
              </div>
              <div className="space-y-1.5">
                {result.bestMatchups.map((m, i) => (
                  <MatchupRow key={i} m={m} lang={lang} />
                ))}
              </div>
            </div>

            {/* Worst matchups */}
            <div className="rounded-xl border border-border bg-card/50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-pixel text-[10px] uppercase tracking-wider text-red-600">
                  {t("simWorstMatchups")}
                </span>
              </div>
              <div className="space-y-1.5">
                {result.worstMatchups.map((m, i) => (
                  <MatchupRow key={i} m={m} lang={lang} />
                ))}
              </div>
            </div>

            {/* Archetype breakdown */}
            <div className="rounded-xl border border-border bg-card/50 p-3">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="font-pixel text-[10px] uppercase tracking-wider text-primary">
                  {t("simArchetypeBreakdown")}
                </span>
              </div>
              <div className="space-y-1">
                {result.archetypeBreakdown.map((ab) => {
                  const pct = Math.max(4, ab.avgWinRate);
                  const color =
                    ab.avgWinRate >= 65
                      ? "bg-emerald-500/20"
                      : ab.avgWinRate >= 45
                        ? "bg-yellow-500/20"
                        : ab.count === 0
                          ? "bg-muted"
                          : "bg-red-500/20";
                  const textColor =
                    ab.count === 0
                      ? "text-muted-foreground/40"
                      : ab.avgWinRate >= 65
                        ? "text-emerald-600"
                        : ab.avgWinRate >= 45
                          ? "text-yellow-600"
                          : "text-red-600";
                  return (
                    <div
                      key={ab.archetype}
                      className="relative flex items-center gap-2 rounded-md border border-border/60 bg-card px-2 py-1.5 overflow-hidden"
                    >
                      <div
                        className={cn("absolute inset-y-0 left-0", color)}
                        style={{ width: `${pct}%` }}
                      />
                      <span className="relative font-pixel text-[9px] uppercase tracking-wider w-24 shrink-0 truncate">
                        {poolLabels[ab.archetype] ?? ab.archetype}
                      </span>
                      <span className="relative flex-1 text-[9px] text-muted-foreground tabular-nums">
                        {ab.count}
                      </span>
                      <span className={cn("relative font-pixel text-[10px] tabular-nums shrink-0", textColor)}>
                        {ab.count > 0 ? `${ab.avgWinRate}%` : "-"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategy & Threats */}
            {(result.strategyTips.length > 0 || result.threats.length > 0) && (
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-pixel text-[10px] uppercase tracking-wider text-primary">
                    {t("simStrategyTips")}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {result.strategyTips.map((tip, i) => {
                    const text = formatTip(tip, lang);
                    if (!text) return null;
                    return (
                      <div
                        key={i}
                        className="rounded-md border border-border/60 bg-muted/30 px-2 py-1.5 text-[10px] text-muted-foreground leading-relaxed"
                      >
                        {text}
                      </div>
                    );
                  })}
                  {result.threats.length > 0 && result.threats[0].avgWrWhenFaced <= 40 && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/5 px-2 py-1.5">
                      <span className="font-pixel text-[8px] uppercase tracking-wider text-red-600 block mb-1">
                        {t("simThreats")}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {result.threats.filter(t => t.avgWrWhenFaced <= 40).slice(0, 3).map((threat) => {
                          const mon = POKEMON_BY_ID.get(threat.id);
                          if (!mon) return null;
                          return (
                            <div key={threat.id} className="flex items-center gap-1 text-[10px] text-red-600">
                              <img src={spriteUrl(mon)} alt="" className="pixelated h-5 w-5 object-contain" loading="lazy" />
                              <span>{pokemonName(mon, lang)}</span>
                              <span className="font-pixel tabular-nums text-[9px]">{threat.avgWrWhenFaced}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Per-Pokémon performance — full width below the grid */}
          {result.pokemonStats.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-pixel text-[10px] uppercase tracking-wider text-primary">
                  {t("simPerPokemon")}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {result.pokemonStats.map((ps) => {
                  const mon = POKEMON_BY_ID.get(ps.id);
                  if (!mon) return null;
                  return (
                    <div
                      key={ps.id}
                      className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-2 shadow-soft"
                    >
                      <img
                        src={spriteUrl(mon)}
                        alt=""
                        className="pixelated h-9 w-9 object-contain shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-pixel text-[9px] uppercase tracking-wider truncate">
                            {pokemonName(mon, lang)}
                          </span>
                          {ps.impact > 10 && (
                            <span className="font-pixel text-[7px] uppercase text-emerald-600 bg-emerald-500/10 px-1 rounded border border-emerald-500/30">
                              MVP
                            </span>
                          )}
                          {ps.impact < -10 && (
                            <span className="font-pixel text-[7px] uppercase text-red-600 bg-red-500/10 px-1 rounded border border-red-500/30">
                              {t("simLiability")}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-[9px] text-muted-foreground">
                          <span>{t("simPickRate")}: <strong className={ps.pickRate >= 70 ? "text-primary" : ""}>{ps.pickRate}%</strong></span>
                          <span>{t("simWrPicked")}: <strong className={ps.winRateWhenPicked >= 60 ? "text-emerald-600" : ps.winRateWhenPicked < 40 ? "text-red-600" : "text-yellow-600"}>{ps.winRateWhenPicked}%</strong></span>
                          <span className="hidden sm:inline">{t("simImpact")}: <strong className={ps.impact > 0 ? "text-emerald-600" : ps.impact < 0 ? "text-red-600" : ""}>{ps.impact > 0 ? "+" : ""}{ps.impact}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full list (collapsible) */}
          <details className="mt-4">
            <summary className="cursor-pointer font-pixel text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground select-none">
              {t("simAllBattles", { n: result.matchups.length })}
            </summary>
            <div className="mt-3 space-y-1">
              {result.matchups
                .slice()
                .sort((a, b) => b.winRate - a.winRate)
                .map((m, i) => (
                  <MatchupRow key={i} m={m} lang={lang} compact />
                ))}
            </div>
          </details>
        </section>
      )}
    </main>
  );
}

function formatTip(
  tip: import("@/lib/battleSim").StrategyTip,
  lang: string,
): string | null {
  const name = (id: string) => {
    const mon = POKEMON_BY_ID.get(Number(id));
    return mon ? pokemonName(mon, lang as any) : `#${id}`;
  };
  switch (tip.kind) {
    case "sharedWeakness":
      return `Shared weakness to ${tip.types.join(", ")} types`;
    case "hardCounter":
      return `Hard counter: ${tip.archetype} (${tip.wr}% win rate)`;
    case "strongestVs":
      return `Strongest vs ${tip.archetype} (${tip.wr}%)`;
    case "weakestVs":
      return `Weakest vs ${tip.archetype} (${tip.wr}%)`;
    case "severeThreat":
      return `${name(tip.name)} is a severe threat (${tip.wr}% WR when faced)`;
    case "bestLead":
      return `Best lead: ${name(tip.name1)} + ${name(tip.name2)} (${tip.wr}% WR)`;
    case "needSpeedControl":
      return "Your team may need speed control (Tailwind or Trick Room)";
    case "leadFakeOut":
      return "Lead with Fake Out + attacker for turn 1 pressure";
  }
}

function MatchupRow({
  m,
  lang,
  compact,
}: {
  m: MatchupResult;
  lang: ReturnType<typeof useLang>["lang"];
  compact?: boolean;
}) {
  const tone =
    m.winRate >= 65
      ? "border-emerald-500/40 bg-emerald-500/5"
      : m.winRate >= 45
        ? "border-yellow-500/40 bg-yellow-500/5"
        : "border-red-500/40 bg-red-500/5";
  const textColor =
    m.winRate >= 65
      ? "text-emerald-600"
      : m.winRate >= 45
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 rounded-lg border px-2 py-1.5",
        tone,
      )}
    >
      <div className={cn("font-pixel text-sm tabular-nums w-10", textColor)}>
        {m.winRate}%
      </div>
      <div className="font-pixel text-[8px] uppercase tracking-wider text-muted-foreground w-16 shrink-0 truncate">
        {m.archetype}
      </div>
      <div className="flex items-center gap-0.5 flex-1 min-w-0 overflow-hidden">
        {(compact ? m.opponent.slice(0, 6) : m.opponent).map((p) => (
          <img
            key={p.id}
            src={spriteUrl(p)}
            alt={pokemonName(p, lang)}
            title={pokemonName(p, lang)}
            className="pixelated h-8 w-8 sm:h-10 sm:w-10 shrink-0"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
