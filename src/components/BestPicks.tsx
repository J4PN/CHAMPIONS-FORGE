import { useMemo, useState } from "react";
import { Pokemon } from "@/lib/types";
import { POKEMON, spriteUrl } from "@/lib/pokemon";
import {
  bestStabMultiplier,
  optimalSubset,
  pickScore,
  getMegaForms,
} from "@/lib/coverage";
import { getTier } from "@/lib/tiers";
import { pokemonName, useLang } from "@/lib/i18n";
import { TypeBadge } from "./TypeBadge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Swords,
  AlertTriangle,
  CircleCheck,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export type BattleFormat = "1v1" | "2v2";

export const BRING_COUNT: Record<BattleFormat, number> = {
  "1v1": 3,
  "2v2": 4,
};

interface Props {
  opponents: Pokemon[];
  myTeam: Pokemon[];
  format: BattleFormat;
}

export function BestPicks({ opponents, myTeam, format }: Props) {
  const { t, lang } = useLang();
  const bringN = BRING_COUNT[format];
  const [megaMode, setMegaMode] = useState(true);

  const best = useMemo(
    () => optimalSubset(myTeam, opponents, bringN, megaMode),
    [myTeam, opponents, bringN, megaMode],
  );

  const ranked = useMemo(() => {
    const chosenIds = new Set(best.subset.map((p) => p.id));
    return [...myTeam]
      .map((p) => ({
        pokemon: p,
        score: pickScore(p, opponents, megaMode),
        chosen: chosenIds.has(p.id),
      }))
      .sort((a, b) => {
        if (a.chosen !== b.chosen) return a.chosen ? -1 : 1;
        return b.score - a.score;
      });
  }, [myTeam, opponents, best]);

  if (opponents.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border bg-muted/40 p-8 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
        <p className="font-pixel text-[10px] uppercase text-muted-foreground leading-relaxed">
          {t("selectOpponent")}
        </p>
      </div>
    );
  }

  // No personal team — fall back to suggesting top counters from the whole
  // Champions roster so the user still gets actionable picks.
  if (myTeam.length === 0) {
    return <RosterSuggestions opponents={opponents} />;
  }

  const maxScore = Math.max(1, ...ranked.map((r) => r.score));
  const notEnough = myTeam.length < bringN;
  const allCovered = best.uncovered.length === 0;

  // Check if any Pokemon in either team has mega forms
  const anyMegaAvailable = [...myTeam, ...opponents].some(
    (p) => !p.mega && getMegaForms(p).length > 0,
  );

  return (
    <div className="space-y-3">
      {/* Mega toggle — only show if relevant */}
      {anyMegaAvailable && (
        <button
          type="button"
          onClick={() => setMegaMode(!megaMode)}
          className={cn(
            "w-full flex items-center justify-center gap-2 h-8 rounded-lg border font-pixel text-[9px] uppercase tracking-wider transition-all",
            megaMode
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:bg-muted",
          )}
        >
          <span className="font-pixel text-primary text-[10px]">M</span>
          {megaMode ? "Mega ON" : "Mega OFF"}
        </button>
      )}

      {/* Summary */}
      <div
        className={cn(
          "rounded-xl border p-3 flex items-center gap-3 shadow-soft",
          allCovered
            ? "border-accent/50 bg-accent/20"
            : "border-primary/30 bg-primary/10",
        )}
      >
        {allCovered ? (
          <CircleCheck className="h-5 w-5 shrink-0 text-accent-foreground" />
        ) : (
          <AlertTriangle className="h-5 w-5 shrink-0 text-primary" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-pixel text-[9px] uppercase tracking-wider">
            {t("covers")} {best.covered}/{opponents.length}{" "}
            {t("opponentsCovered")}
          </div>
          {!allCovered && (
            <div className="text-[9px] text-muted-foreground font-mono mt-1 break-words">
              {t("uncovered")} :{" "}
              {best.uncovered.map((p) => pokemonName(p, lang)).join(", ")}
            </div>
          )}
        </div>
      </div>

      {notEnough && (
        <div className="rounded-lg border border-secondary/60 bg-secondary/30 p-2 text-[9px] font-pixel uppercase tracking-wider text-secondary-foreground">
          {t("notEnough", { n: myTeam.length, k: bringN })}
        </div>
      )}

      {/* Section: To bring */}
      <div className="flex items-center gap-2 text-[9px] font-pixel uppercase tracking-wider text-primary">
        <Swords className="h-3 w-3" />
        {t("toBring")} · {format}
      </div>
      <div className="space-y-2">
        {ranked
          .filter((r) => r.chosen)
          .map((r) => (
            <PickRow
              key={r.pokemon.id}
              pokemon={r.pokemon}
              score={r.score}
              maxScore={maxScore}
              chosen
              opponents={opponents}
            />
          ))}
      </div>

      {/* Section: Bench */}
      {ranked.some((r) => !r.chosen) && (
        <>
          <div className="flex items-center gap-2 text-[9px] font-pixel uppercase tracking-wider text-muted-foreground pt-2">
            {t("bench")}
          </div>
          <div className="space-y-2">
            {ranked
              .filter((r) => !r.chosen)
              .map((r) => (
                <PickRow
                  key={r.pokemon.id}
                  pokemon={r.pokemon}
                  score={r.score}
                  maxScore={maxScore}
                  chosen={false}
                  opponents={opponents}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function PickRow({
  pokemon,
  score,
  maxScore,
  chosen,
  opponents,
}: {
  pokemon: Pokemon;
  score: number;
  maxScore: number;
  chosen: boolean;
  opponents: Pokemon[];
}) {
  const { t, lang } = useLang();
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;

  // Offensive matchups (I hit them SE) — flag when a mega form is involved
  const strongVs: { mon: Pokemon; megaOnly?: boolean; hasMega?: boolean }[] = [];
  const weakVs: { mon: Pokemon; megaOnly?: boolean; hasMega?: boolean }[] = [];

  for (const def of opponents) {
    const megas = getMegaForms(def);
    const hasMega = megas.length > 0;
    const offBase = bestStabMultiplier(pokemon, def, false);
    const offMega = bestStabMultiplier(pokemon, def, true);
    if (offBase >= 2) {
      strongVs.push({ mon: def, hasMega });
    } else if (offMega >= 2) {
      strongVs.push({ mon: def, megaOnly: true, hasMega });
    }

    const incBase = bestStabMultiplier(def, pokemon, false);
    const incMega = bestStabMultiplier(def, pokemon, true);
    if (incBase >= 2) {
      weakVs.push({ mon: def, hasMega });
    } else if (incMega >= 2) {
      weakVs.push({ mon: def, megaOnly: true, hasMega });
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border p-3 transition-all",
        chosen
          ? "border-primary/40 bg-card shadow-soft-lg"
          : "border-border bg-muted/40 opacity-80 hover:opacity-100",
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          src={spriteUrl(pokemon)}
          alt={pokemon.names.en ?? ""}
          className={cn(
            "pixelated h-12 w-12 sm:h-14 sm:w-14 shrink-0 drop-shadow-[0_3px_5px_rgba(60,40,20,0.2)]",
            !chosen && "grayscale-[40%]",
          )}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-pixel text-[10px] uppercase truncate text-shadow-pixel">
              {pokemonName(pokemon, lang)}
            </span>
            {pokemon.mega && (
              <span className="text-[8px] font-pixel uppercase text-primary">
                {t("mega")}
              </span>
            )}
            {chosen && (
              <Badge variant="default" className="text-[7px] px-1">
                {t("pick")}
              </Badge>
            )}
          </div>
          <div className="flex gap-1 mt-1">
            {pokemon.types.map((ty) => (
              <TypeBadge key={ty} type={ty} size="xs" />
            ))}
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-[width]",
                chosen ? "bg-primary" : "bg-muted-foreground/40",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div
            className={cn(
              "font-pixel text-sm text-shadow-pixel tabular-nums",
              chosen ? "text-primary" : "text-muted-foreground",
            )}
          >
            {Number.isInteger(score) ? score : score.toFixed(1)}
          </div>
          <div className="text-[8px] text-muted-foreground font-pixel uppercase">
            {t("score")}
          </div>
        </div>
      </div>

      {/* Matchup explanation — always shown */}
      {(strongVs.length > 0 || weakVs.length > 0) && (
        <div className="mt-2 pt-2 border-t-2 border-border/40 space-y-1.5">
          {strongVs.length > 0 && (
            <MatchupRow
              icon={<ShieldCheck className="h-3 w-3" />}
              label={t("strongVs")}
              entries={strongVs}
              tone="good"
            />
          )}
          {weakVs.length > 0 && (
            <MatchupRow
              icon={<ShieldAlert className="h-3 w-3" />}
              label={t("weakVs")}
              entries={weakVs}
              tone="bad"
            />
          )}
        </div>
      )}
    </div>
  );
}

/** Shown when the user has no personal team — surfaces the top N counters
 *  from the whole Champions roster against the current opposing mons. */
function RosterSuggestions({ opponents }: { opponents: Pokemon[] }) {
  const { t, lang } = useLang();
  const top = useMemo(() => {
    const scored = POKEMON.map((p) => ({
      pokemon: p,
      score: pickScore(p, opponents),
      tier: getTier(p.id),
    }));
    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        // Prefer higher-tier mons on ties
        const tierRank = (t?: string) =>
          ({ S: 5, A: 4, B: 3, C: 2, D: 1 }[t ?? ""] ?? 0);
        return tierRank(b.tier) - tierRank(a.tier);
      })
      .slice(0, 8);
  }, [opponents]);

  const maxScore = Math.max(1, ...top.map((r) => r.score));

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-accent/50 bg-accent/10 p-3 flex items-start gap-3">
        <Sparkles className="h-5 w-5 shrink-0 text-accent-foreground mt-0.5" />
        <div className="text-[10px] font-mono text-accent-foreground leading-relaxed">
          <strong className="font-pixel text-[9px] uppercase tracking-wider">
            {t("noTeamSuggestions")}
          </strong>
          <br />
          {t("noTeamSuggestionsBody")}
        </div>
      </div>

      <div className="space-y-2">
        {top.map((r, i) => {
          const pct = (r.score / maxScore) * 100;
          return (
            <div
              key={r.pokemon.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-2 shadow-soft"
            >
              <div className="font-pixel text-[9px] text-muted-foreground tabular-nums w-4">
                {i + 1}
              </div>
              <img
                src={spriteUrl(r.pokemon)}
                alt={r.pokemon.names.en ?? ""}
                className="pixelated h-12 w-12 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-pixel text-[10px] uppercase truncate">
                    {pokemonName(r.pokemon, lang)}
                  </span>
                  {r.tier && (
                    <span className="text-[8px] font-pixel uppercase text-muted-foreground">
                      {r.tier}
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mt-1">
                  {r.pokemon.types.map((ty) => (
                    <TypeBadge key={ty} type={ty} size="xs" />
                  ))}
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="font-pixel text-sm text-primary tabular-nums">
                {Number.isInteger(r.score) ? r.score : r.score.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatchupRow({
  icon,
  label,
  entries,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  entries: { mon: Pokemon; megaOnly?: boolean; hasMega?: boolean }[];
  tone: "good" | "bad";
}) {
  const { lang } = useLang();
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
      <div
        className={cn(
          "flex items-center gap-1 shrink-0 font-pixel text-[8px] uppercase tracking-wider sm:w-20",
          tone === "good" ? "text-emerald-600" : "text-red-600",
        )}
      >
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-1 flex-1 min-w-0">
        {entries.map((e) => {
          const megas = getMegaForms(e.mon);
          const megaSprite = megas.length > 0 ? megas[0] : null;
          return (
            <div
              key={e.mon.id}
              className={cn(
                "group/chip inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5",
                e.megaOnly
                  ? "border-purple-500/40 bg-purple-500/10"
                  : tone === "good"
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-primary/40 bg-primary/10",
              )}
              title={
                e.megaOnly
                  ? `${pokemonName(e.mon, lang)} (Mega)`
                  : e.hasMega
                    ? `${pokemonName(e.mon, lang)} + Mega`
                    : pokemonName(e.mon, lang)
              }
            >
              <img
                src={spriteUrl(e.mon)}
                alt={e.mon.names.en ?? ""}
                className="pixelated h-5 w-5 shrink-0"
                loading="lazy"
                onError={(ev) => {
                  (ev.currentTarget as HTMLImageElement).style.visibility = "hidden";
                }}
              />
              <span className="text-[9px] truncate max-w-[52px] sm:max-w-[90px]">
                {pokemonName(e.mon, lang)}
              </span>
              {e.hasMega && megaSprite && (
                <img
                  src={spriteUrl(megaSprite)}
                  alt=""
                  className="pixelated h-4 w-4 shrink-0 opacity-60"
                  loading="lazy"
                  title={pokemonName(megaSprite, lang)}
                />
              )}
              {(e.megaOnly || e.hasMega) && (
                <span className={cn("font-pixel text-[5px] uppercase", e.megaOnly ? "text-purple-600" : "text-primary/50")}>
                  MEGA
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
