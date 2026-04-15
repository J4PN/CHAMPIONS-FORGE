import { useEffect, useMemo, useState } from "react";
import { Trophy, TrendingUp, Loader2, Swords } from "lucide-react";
import { POKEMON, spriteUrl } from "@/lib/pokemon";
import { pokemonName, useLang } from "@/lib/i18n";
import { TypeBadge } from "./TypeBadge";
import { TrendingWidget } from "./TrendingWidget";
import type { Pokemon, PokemonType } from "@/lib/types";

type RankingEntry = {
  hash: string;
  species: number[];
  count: number;
  weekCount: number;
  lastSeen: string;
};

type RankingsResponse = {
  week: string;
  total: number;
  entries: RankingEntry[];
};

type Scope = "weekly" | "alltime";

const POKEMON_BY_ID = new Map<number, Pokemon>(POKEMON.map((p) => [p.id, p]));

function resolveTeam(species: number[]): Pokemon[] {
  return species
    .map((id) => POKEMON_BY_ID.get(id))
    .filter((p): p is Pokemon => !!p);
}

function apiBase(): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  return envBase ?? "";
}

interface RankingsPageProps {
  onUseTeam?: (ids: number[]) => void;
}

export function RankingsPage({ onUseTeam }: RankingsPageProps = {}) {
  const { lang, t } = useLang();
  const [scope, setScope] = useState<Scope>("weekly");
  const [data, setData] = useState<RankingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`${apiBase()}/api/rankings/weekly?limit=20&scope=${scope}`, {
      signal: ctrl.signal,
      cache: "no-store",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<RankingsResponse>;
      })
      .then((j) => setData(j))
      .catch((e) => {
        if ((e as Error).name !== "AbortError") {
          setError((e as Error).message);
        }
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [scope]);

  const entries = data?.entries ?? [];

  // Derived aggregates from the top-20 teams, weighted by each team's play
  // count. Reflects "what's popular in the teams that actually get played",
  // not raw submission counts — which is arguably more useful.
  const { topPokemon, topTypes, totalPlays } = useMemo(() => {
    const pokeCounts = new Map<number, number>();
    const typeCounts = new Map<PokemonType, number>();
    let total = 0;

    for (const entry of entries) {
      const plays = scope === "weekly" ? entry.weekCount : entry.count;
      total += plays;
      for (const id of entry.species) {
        const pokemon = POKEMON_BY_ID.get(id);
        if (!pokemon) continue;
        pokeCounts.set(id, (pokeCounts.get(id) ?? 0) + plays);
        for (const type of pokemon.types) {
          typeCounts.set(type, (typeCounts.get(type) ?? 0) + plays);
        }
      }
    }

    const topP = [...pokeCounts.entries()]
      .map(([id, count]) => ({ pokemon: POKEMON_BY_ID.get(id)!, count }))
      .filter((x) => x.pokemon)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topT = [...typeCounts.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { topPokemon: topP, topTypes: topT, totalPlays: total };
  }, [entries, scope]);

  return (
    <main className="container py-6 sm:py-10 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-primary" />
          <h1 className="font-pixel text-base sm:text-xl uppercase tracking-wider text-primary text-shadow-pixel">
            {t("rankingsTitle")}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t("rankingsSubtitle")}
        </p>
        <div className="h-[3px] bg-foreground" />
      </header>

      <div className="flex items-center gap-2">
        <ScopeTab
          active={scope === "weekly"}
          onClick={() => setScope("weekly")}
          label={t("rankingsThisWeek")}
        />
        <ScopeTab
          active={scope === "alltime"}
          onClick={() => setScope("alltime")}
          label={t("rankingsAllTime")}
        />
        {data && (
          <span className="ml-auto text-[9px] font-pixel uppercase tracking-wider text-muted-foreground">
            {data.week}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {t("rankingsError")}: {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="font-pixel text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("rankingsEmpty")}
          </p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="space-y-6">
          <section>
            <SectionHeader
              title={t("rankingsTopTeams")}
              subtitle={`${entries.length} · ${totalPlays.toLocaleString()} ${t("rankingsPlays")}`}
            />
            <ol className="grid gap-2 md:grid-cols-2">
              {entries.map((entry, i) => (
                <RankingRow
                  key={entry.hash}
                  rank={i + 1}
                  entry={entry}
                  scope={scope}
                  lang={lang}
                  onUse={onUseTeam}
                  useLabel={t("rankingsUseTeam")}
                />
              ))}
            </ol>
          </section>

          <TrendingWidget />

          <div className="grid gap-6 lg:gap-8 md:grid-cols-2">
            <section>
              <SectionHeader title={t("rankingsTopPokemon")} />
              <ul className="space-y-2.5">
                {topPokemon.map((item, i) => (
                  <PokemonBarRow
                    key={item.pokemon.id}
                    rank={i + 1}
                    pokemon={item.pokemon}
                    count={item.count}
                    max={topPokemon[0]?.count ?? 1}
                    lang={lang}
                  />
                ))}
              </ul>
            </section>

            <section>
              <SectionHeader title={t("rankingsTopTypes")} />
              <ul className="space-y-2.5">
                {topTypes.map((item, i) => (
                  <TypeBarRow
                    key={item.type}
                    rank={i + 1}
                    type={item.type}
                    count={item.count}
                    max={topTypes[0]?.count ?? 1}
                  />
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <h2 className="font-pixel text-xs sm:text-sm uppercase tracking-wider text-foreground">
        {title}
      </h2>
      {subtitle && (
        <span className="text-[9px] text-muted-foreground font-pixel uppercase tracking-wider">
          {subtitle}
        </span>
      )}
      <div className="flex-1 h-[2px] bg-foreground/20" />
    </div>
  );
}

function ScopeTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
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
      {label}
    </button>
  );
}

function RankingRow({
  rank,
  entry,
  scope,
  lang,
  onUse,
  useLabel,
}: {
  rank: number;
  entry: RankingEntry;
  scope: Scope;
  lang: string;
  onUse?: (ids: number[]) => void;
  useLabel: string;
}) {
  const team = useMemo(() => resolveTeam(entry.species), [entry.species]);
  const playCount = scope === "weekly" ? entry.weekCount : entry.count;

  return (
    <li className="group flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-soft hover:border-primary/40 transition-all">
      <span
        className={
          "font-pixel text-sm tabular-nums w-5 text-center shrink-0 " +
          (rank === 1
            ? "text-primary text-shadow-pixel"
            : rank <= 3
            ? "text-primary/80"
            : "text-muted-foreground")
        }
      >
        {rank}
      </span>

      <div className="flex-1 min-w-0 flex items-center gap-0.5">
        {team.map((p) => (
          <img
            key={p.id}
            src={spriteUrl(p)}
            alt={p.names.en ?? ""}
            title={pokemonName(p, lang as any)}
            className="pixelated h-8 w-8 sm:h-9 sm:w-9 object-contain shrink-0"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        ))}
      </div>

      <span className="font-pixel text-xs text-primary tabular-nums shrink-0 tabular-nums">
        {playCount.toLocaleString()}
      </span>

      {onUse && (
        <button
          type="button"
          onClick={() => onUse(entry.species)}
          title={useLabel}
          className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md border border-primary/30 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary transition-colors"
        >
          <Swords className="h-3 w-3" />
        </button>
      )}
    </li>
  );
}

function PokemonBarRow({
  rank,
  pokemon,
  count,
  max,
  lang,
}: {
  rank: number;
  pokemon: Pokemon;
  count: number;
  max: number;
  lang: string;
}) {
  const pct = Math.max(4, Math.round((count / max) * 100));
  return (
    <li className="relative flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 overflow-hidden shadow-soft min-h-[48px]">
      <div
        className="absolute inset-y-0 left-0 bg-primary/10"
        style={{ width: `${pct}%` }}
      />
      <span className="relative font-pixel text-[10px] tabular-nums w-6 text-center shrink-0 text-muted-foreground">
        {rank}
      </span>
      <img
        src={spriteUrl(pokemon)}
        alt=""
        className="relative pixelated h-9 w-9 object-contain shrink-0"
        loading="lazy"
      />
      <span className="relative flex-1 min-w-0 truncate font-pixel text-[10px] uppercase tracking-wider">
        {pokemonName(pokemon, lang as any)}
      </span>
      <span className="relative font-pixel text-[11px] text-primary tabular-nums shrink-0 pl-2">
        {count.toLocaleString()}
      </span>
    </li>
  );
}

function TypeBarRow({
  rank,
  type,
  count,
  max,
}: {
  rank: number;
  type: PokemonType;
  count: number;
  max: number;
}) {
  const pct = Math.max(4, Math.round((count / max) * 100));
  return (
    <li className="relative flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 overflow-hidden shadow-soft min-h-[48px]">
      <div
        className="absolute inset-y-0 left-0 bg-primary/10"
        style={{ width: `${pct}%` }}
      />
      <span className="relative font-pixel text-[10px] tabular-nums w-6 text-center shrink-0 text-muted-foreground">
        {rank}
      </span>
      <div className="relative shrink-0">
        <TypeBadge type={type} size="sm" />
      </div>
      <span className="relative flex-1" />
      <span className="relative font-pixel text-[11px] text-primary tabular-nums shrink-0 pl-2">
        {count.toLocaleString()}
      </span>
    </li>
  );
}
