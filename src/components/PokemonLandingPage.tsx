import { useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { POKEMON, findBySlug, monSlug, spriteUrl, artworkUrl } from "@/lib/pokemon";
import { pickScore, defensiveMatchups } from "@/lib/coverage";
import { getTier, TIER_COLORS } from "@/lib/tiers";
import { pokemonName, typeLabel, useLang } from "@/lib/i18n";
import { TypeBadge } from "./TypeBadge";
import { Button } from "@/components/ui/button";
import { PokemonStats } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STATS: Array<{ key: keyof PokemonStats; label: "statHp" | "statAtk" | "statDef" | "statSpa" | "statSpd" | "statSpe" }> = [
  { key: "hp", label: "statHp" },
  { key: "atk", label: "statAtk" },
  { key: "def", label: "statDef" },
  { key: "spa", label: "statSpa" },
  { key: "spd", label: "statSpd" },
  { key: "spe", label: "statSpe" },
];

export function PokemonLandingPage() {
  const location = useLocation();
  const { t, lang } = useLang();
  const mon = useMemo(() => {
    const match = location.pathname.match(/^\/pokemon\/([^/]+)/);
    return match ? findBySlug(match[1]) : undefined;
  }, [location.pathname]);

  // Update the <title> dynamically for this landing page
  useEffect(() => {
    if (!mon) return;
    const name = pokemonName(mon, lang);
    document.title = `${name} counters · PokeCounter`;
  }, [mon, lang]);

  if (!mon) {
    return (
      <main className="container py-10">
        <p className="font-mono text-sm text-muted-foreground">
          Pokémon not found.{" "}
          <Link to="/pokedex" className="text-primary underline">
            Back to the Pokédex
          </Link>
          .
        </p>
      </main>
    );
  }

  const matchups = defensiveMatchups(mon);
  const totalStats = mon.stats
    ? Object.values(mon.stats).reduce((a, b) => a + b, 0)
    : 0;
  const tier = getTier(mon.id);

  // Compute top 8 counters against this Pokémon from the whole roster
  const topCounters = useMemo(() => {
    return POKEMON.filter((p) => p.id !== mon.id)
      .map((p) => ({ pokemon: p, score: pickScore(p, [mon]), tier: getTier(p.id) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const tierRank = (x?: string) =>
          ({ S: 5, A: 4, B: 3, C: 2, D: 1 }[x ?? ""] ?? 0);
        return tierRank(b.tier) - tierRank(a.tier);
      })
      .slice(0, 12);
  }, [mon]);

  return (
    <main className="container py-6 sm:py-10 max-w-4xl">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-[10px] font-pixel uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/pokedex" className="hover:text-primary">{t("navPokedex")}</Link>
        <span>/</span>
        <span className="text-foreground">{pokemonName(mon, lang)}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start gap-4 sm:gap-6">
          <img
            src={artworkUrl(mon)}
            alt={`${mon.names.en} sprite`}
            className="h-24 w-24 sm:h-32 sm:w-32 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono text-muted-foreground">
              #{String(mon.id).padStart(4, "0")}
              {tier && (
                <span className={cn("ml-2 px-1.5 py-0.5 rounded-full border text-[9px] font-pixel uppercase", TIER_COLORS[tier])}>
                  {tier} tier
                </span>
              )}
            </div>
            <h1 className="font-pixel text-2xl sm:text-4xl text-foreground mt-1">
              {pokemonName(mon, lang)}
            </h1>
            <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-2">
              Counters, weaknesses & type coverage
            </p>
            <div className="flex gap-1 mt-3">
              {mon.types.map((tp) => (
                <Link key={tp} to={`/type/${tp.toLowerCase()}`}>
                  <TypeBadge type={tp} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm font-mono text-muted-foreground leading-relaxed mt-5">
          This page lists the best counters for <strong>{pokemonName(mon, lang)}</strong>,
          its defensive weaknesses, base stats and suggested attacking picks
          from the Pokémon Champions roster. Click any counter below to open
          its own page, or jump to the main counter picker for a multi-target
          analysis.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link to={`/?opp=${mon.id}`}>
              Pick counters in the app
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/pokedex">
              <ArrowLeft className="h-3 w-3" />
              Back to Pokédex
            </Link>
          </Button>
        </div>
      </header>

      {/* Base stats */}
      {mon.stats && (
        <section className="mb-10">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-pixel text-xl text-primary tabular-nums">01</span>
            <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
              Base stats
            </h2>
            <span className="ml-auto font-pixel text-sm text-primary tabular-nums">
              {totalStats}
            </span>
          </div>
          <div className="h-[2px] bg-foreground mb-3" />
          <div className="space-y-1.5">
            {STATS.map((s) => {
              const v = mon.stats![s.key];
              const pct = Math.min(100, (v / 200) * 100);
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div className="w-10 text-[9px] font-pixel uppercase text-muted-foreground shrink-0">
                    {t(s.label)}
                  </div>
                  <div className="w-8 text-right font-mono text-xs text-foreground shrink-0 tabular-nums">
                    {v}
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Defensive matchups */}
      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">02</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            Defensive matchups
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-3" />

        {matchups.weak.length > 0 && (
          <div className="mb-4">
            <div className="text-[9px] font-pixel uppercase text-red-600 mb-2">
              Weak to (takes ≥2× damage)
            </div>
            <div className="flex flex-wrap gap-1">
              {matchups.weak.map((w) => (
                <Link key={w.type} to={`/type/${w.type.toLowerCase()}`} className="flex items-center gap-1">
                  <TypeBadge type={w.type} size="xs" />
                  <span className="text-[8px] font-pixel text-red-600">×{w.mult}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {matchups.resist.length > 0 && (
          <div className="mb-4">
            <div className="text-[9px] font-pixel uppercase text-emerald-600 mb-2">
              Resists (takes ≤½× damage)
            </div>
            <div className="flex flex-wrap gap-1">
              {matchups.resist.map((r) => (
                <div key={r.type} className="flex items-center gap-1">
                  <TypeBadge type={r.type} size="xs" />
                  <span className="text-[8px] font-pixel text-emerald-600">×{r.mult}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {matchups.immune.length > 0 && (
          <div>
            <div className="text-[9px] font-pixel uppercase text-sky-600 mb-2">
              Immune to
            </div>
            <div className="flex flex-wrap gap-1">
              {matchups.immune.map((i) => (
                <TypeBadge key={i} type={i} size="xs" />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Top counters */}
      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">03</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            Top counters vs {pokemonName(mon, lang)}
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {topCounters.map((c, i) => (
            <Link
              key={c.pokemon.id}
              to={`/pokemon/${monSlug(c.pokemon)}`}
              className="rounded-xl border border-border bg-card p-2 shadow-soft transition-all hover:border-primary/50 hover:shadow-soft-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between text-[8px] text-muted-foreground font-mono">
                <span>#{i + 1}</span>
                <span className="text-primary font-pixel">{c.score}</span>
              </div>
              <img
                src={spriteUrl(c.pokemon)}
                alt={`${c.pokemon.names.en} sprite`}
                className="pixelated h-14 w-14 mx-auto"
                loading="lazy"
              />
              <div className="mt-1 font-pixel text-[8px] uppercase text-center truncate">
                {pokemonName(c.pokemon, lang)}
              </div>
              <div className="flex justify-center gap-0.5 mt-1">
                {c.pokemon.types.map((tp) => (
                  <TypeBadge key={tp} type={tp} size="xs" />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Abilities */}
      {mon.abilities && mon.abilities.length > 0 && (
        <section className="mb-10">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-pixel text-xl text-primary tabular-nums">04</span>
            <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
              {t("abilities")}
            </h2>
          </div>
          <div className="h-[2px] bg-foreground mb-3" />
          <div className="space-y-2">
            {mon.abilities.map((a, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-xs">{a.names[lang] ?? a.names.en}</span>
                  {a.hidden && (
                    <span className="text-[7px] font-pixel uppercase text-accent-foreground bg-accent/40 px-1.5 py-0.5 rounded-full">
                      {t("hiddenAbility")}
                    </span>
                  )}
                </div>
                {(() => {
                  const desc = a.description;
                  if (!desc) return null;
                  const text = typeof desc === "string" ? desc : (desc[lang] ?? desc.en);
                  return text ? (
                    <p className="text-[11px] font-mono text-muted-foreground mt-1 leading-relaxed">
                      {text}
                    </p>
                  ) : null;
                })()}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ for rich results */}
      <section>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">05</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            FAQ
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-3" />
        <div className="space-y-3 text-xs font-mono text-muted-foreground leading-relaxed">
          <details className="rounded-lg border border-border bg-card p-3">
            <summary className="font-pixel text-[10px] uppercase cursor-pointer text-foreground">
              What is the best counter for {pokemonName(mon, lang)}?
            </summary>
            <p className="mt-2">
              Based on STAB type coverage + defensive safety, the top counter in
              the Pokémon Champions roster is{" "}
              <strong>
                {topCounters[0] ? pokemonName(topCounters[0].pokemon, lang) : "—"}
              </strong>
              . See the full ranked list above.
            </p>
          </details>
          <details className="rounded-lg border border-border bg-card p-3">
            <summary className="font-pixel text-[10px] uppercase cursor-pointer text-foreground">
              What are {pokemonName(mon, lang)}'s weaknesses?
            </summary>
            <p className="mt-2">
              {matchups.weak.length > 0
                ? `${pokemonName(mon, lang)} is weak to ${matchups.weak.map((w) => typeLabel(w.type, lang)).join(", ")}.`
                : `${pokemonName(mon, lang)} has no type weaknesses.`}
            </p>
          </details>
          <details className="rounded-lg border border-border bg-card p-3">
            <summary className="font-pixel text-[10px] uppercase cursor-pointer text-foreground">
              What type is {pokemonName(mon, lang)}?
            </summary>
            <p className="mt-2">
              {pokemonName(mon, lang)} is a{" "}
              {mon.types.map((tp) => typeLabel(tp, lang)).join(" / ")}-type Pokémon.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
