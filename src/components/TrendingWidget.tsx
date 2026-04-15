import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { POKEMON, spriteUrl } from "@/lib/pokemon";
import { pokemonName, useLang } from "@/lib/i18n";
import type { Pokemon } from "@/lib/types";

type TrendingEntry = {
  speciesId: number;
  currWeek: number;
  prevWeek: number;
  delta: number;
};

type TrendingResponse = {
  currentWeek: string;
  previousWeek: string;
  rising: TrendingEntry[];
  falling: TrendingEntry[];
};

const POKEMON_BY_ID = new Map<number, Pokemon>(POKEMON.map((p) => [p.id, p]));

function apiBase(): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  return envBase ?? "";
}

export function TrendingWidget() {
  const { lang, t } = useLang();
  const [data, setData] = useState<TrendingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`${apiBase()}/api/stats/trending`, {
      signal: ctrl.signal,
      cache: "no-store",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TrendingResponse>;
      })
      .then(setData)
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setError((e as Error).message);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (error || !data) return null;

  const hasRising = data.rising.length > 0;
  const hasFalling = data.falling.length > 0;
  if (!hasRising && !hasFalling) return null;

  return (
    <section>
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="font-pixel text-xs sm:text-sm uppercase tracking-wider text-foreground">
          {t("trendingTitle")}
        </h2>
        <span className="text-[9px] text-muted-foreground font-pixel uppercase tracking-wider">
          {data.currentWeek} vs {data.previousWeek}
        </span>
        <div className="flex-1 h-[2px] bg-foreground/20" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {hasRising && (
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span className="font-pixel text-[9px] uppercase tracking-wider">
                {t("trendingRising")}
              </span>
            </div>
            <ul className="space-y-1.5">
              {data.rising.slice(0, 5).map((entry, i) => (
                <TrendRow
                  key={entry.speciesId}
                  rank={i + 1}
                  entry={entry}
                  lang={lang}
                  direction="up"
                />
              ))}
            </ul>
          </div>
        )}

        {hasFalling && (
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-rose-600">
              <TrendingDown className="h-3 w-3" />
              <span className="font-pixel text-[9px] uppercase tracking-wider">
                {t("trendingFalling")}
              </span>
            </div>
            <ul className="space-y-1.5">
              {data.falling.slice(0, 5).map((entry, i) => (
                <TrendRow
                  key={entry.speciesId}
                  rank={i + 1}
                  entry={entry}
                  lang={lang}
                  direction="down"
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function TrendRow({
  rank,
  entry,
  lang,
  direction,
}: {
  rank: number;
  entry: TrendingEntry;
  lang: string;
  direction: "up" | "down";
}) {
  const pokemon = POKEMON_BY_ID.get(entry.speciesId);
  if (!pokemon) return null;

  const deltaColor = direction === "up" ? "text-emerald-600" : "text-rose-600";
  const deltaSign = entry.delta > 0 ? "+" : "";

  return (
    <li className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-soft">
      <span className="font-pixel text-[10px] tabular-nums w-5 text-center shrink-0 text-muted-foreground">
        {rank}
      </span>
      <img
        src={spriteUrl(pokemon)}
        alt=""
        className="pixelated h-9 w-9 object-contain shrink-0"
        loading="lazy"
      />
      <span className="flex-1 min-w-0 truncate font-pixel text-[10px] uppercase tracking-wider">
        {pokemonName(pokemon, lang as any)}
      </span>
      <span className={`font-pixel text-[11px] tabular-nums shrink-0 ${deltaColor}`}>
        {deltaSign}
        {entry.delta}
      </span>
    </li>
  );
}
