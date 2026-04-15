import { useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { POKEMON, monSlug, spriteUrl } from "@/lib/pokemon";
import { ALL_TYPES, PokemonType, TYPE_CHART } from "@/lib/types";
import { getTier } from "@/lib/tiers";
import { pokemonName, typeLabel, useLang } from "@/lib/i18n";
import { TypeBadge } from "./TypeBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function parseType(slug: string | undefined): PokemonType | null {
  if (!slug) return null;
  const normalized = slug.toLowerCase();
  return (
    ALL_TYPES.find((t) => t.toLowerCase() === normalized) ?? null
  );
}

export function TypeLandingPage() {
  const location = useLocation();
  const { t, lang } = useLang();
  const type = useMemo(() => {
    const match = location.pathname.match(/^\/type\/([^/]+)/);
    return parseType(match?.[1]);
  }, [location.pathname]);

  useEffect(() => {
    if (!type) return;
    document.title = `Best ${type} counters · PokeCounter`;
  }, [type]);

  if (!type) {
    return (
      <main className="container py-10">
        <p className="font-mono text-sm text-muted-foreground">
          Unknown type.{" "}
          <Link to="/types-chart" className="text-primary underline">
            Back to the type chart
          </Link>
          .
        </p>
      </main>
    );
  }

  // Types that are super-effective vs this one (these hit it SE)
  const hitsThisType = ALL_TYPES.filter(
    (t) => TYPE_CHART[t][type] >= 2,
  );
  // Types this one resists vs
  const thisResists = ALL_TYPES.filter(
    (t) => TYPE_CHART[t][type] !== undefined && TYPE_CHART[t][type] < 1,
  );
  const thisImmune = ALL_TYPES.filter((t) => TYPE_CHART[t][type] === 0);

  // Top Pokémon of this type (used offensively AND as counter entries)
  const ofType = POKEMON.filter((p) => p.types.includes(type));
  const topOfType = ofType
    .sort((a, b) => {
      const tierRank = (x?: string) =>
        ({ S: 5, A: 4, B: 3, C: 2, D: 1 }[x ?? ""] ?? 0);
      return tierRank(getTier(b.id)) - tierRank(getTier(a.id));
    })
    .slice(0, 12);

  // Top counters to this type — Pokémon that have one of the SE types in their types
  const topCounters = POKEMON.filter((p) =>
    p.types.some((pt) => hitsThisType.includes(pt)),
  )
    .sort((a, b) => {
      const tierRank = (x?: string) =>
        ({ S: 5, A: 4, B: 3, C: 2, D: 1 }[x ?? ""] ?? 0);
      return tierRank(getTier(b.id)) - tierRank(getTier(a.id));
    })
    .slice(0, 12);

  return (
    <main className="container py-6 sm:py-10 max-w-4xl">
      <nav className="mb-4 text-[10px] font-pixel uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/types-chart" className="hover:text-primary">{t("navTypes")}</Link>
        <span>/</span>
        <span className="text-foreground">{typeLabel(type, lang)}</span>
      </nav>

      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-4xl text-foreground">
            {type} type
          </h1>
        </div>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-3">
          Best counters, weaknesses and strong Pokémon of the {typeLabel(type, lang)} type
        </p>

        <p className="text-sm font-mono text-muted-foreground leading-relaxed mt-5">
          {type}-type Pokémon are{" "}
          {hitsThisType.length > 0
            ? `weak to ${hitsThisType.map((t) => typeLabel(t, lang)).join(", ")}`
            : "not weak to any type"}
          {". "}
          They resist{" "}
          {thisResists.length > 0
            ? thisResists.map((t) => typeLabel(t, lang)).join(", ")
            : "nothing"}
          {thisImmune.length > 0 &&
            ` and are immune to ${thisImmune.map((t) => typeLabel(t, lang)).join(", ")}`}
          .
        </p>

        <div className="mt-5">
          <Button variant="outline" asChild>
            <Link to="/types-chart">
              <ArrowLeft className="h-3 w-3" />
              Full type chart
            </Link>
          </Button>
        </div>
      </header>

      {/* Matchup summary */}
      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">01</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            Matchups
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[9px] font-pixel uppercase text-red-600 mb-2">
              Weak to
            </div>
            <div className="flex flex-wrap gap-1">
              {hitsThisType.map((tp) => (
                <Link key={tp} to={`/type/${tp.toLowerCase()}`}>
                  <TypeBadge type={tp} size="xs" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-pixel uppercase text-emerald-600 mb-2">
              Resists
            </div>
            <div className="flex flex-wrap gap-1">
              {thisResists.map((tp) => (
                <Link key={tp} to={`/type/${tp.toLowerCase()}`}>
                  <TypeBadge type={tp} size="xs" />
                </Link>
              ))}
            </div>
          </div>
          {thisImmune.length > 0 && (
            <div>
              <div className="text-[9px] font-pixel uppercase text-sky-600 mb-2">
                Immune to
              </div>
              <div className="flex flex-wrap gap-1">
                {thisImmune.map((tp) => (
                  <TypeBadge key={tp} type={tp} size="xs" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Best of this type */}
      {topOfType.length > 0 && (
        <section className="mb-10">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-pixel text-xl text-primary tabular-nums">02</span>
            <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
              Best {type}-type Pokémon
            </h2>
          </div>
          <div className="h-[2px] bg-foreground mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {topOfType.map((p) => (
              <Link
                key={p.id}
                to={`/pokemon/${monSlug(p)}`}
                className="rounded-xl border border-border bg-card p-2 shadow-soft transition-all hover:border-primary/50 hover:shadow-soft-lg hover:-translate-y-0.5"
              >
                <img
                  src={spriteUrl(p)}
                  alt={`${p.names.en} sprite`}
                  className="pixelated h-14 w-14 mx-auto"
                  loading="lazy"
                />
                <div className="mt-1 font-pixel text-[8px] uppercase text-center truncate">
                  {pokemonName(p, lang)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Best counters to this type */}
      <section>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">03</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            Best counters to {type}
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {topCounters.map((p) => (
            <Link
              key={p.id}
              to={`/pokemon/${monSlug(p)}`}
              className="rounded-xl border border-border bg-card p-2 shadow-soft transition-all hover:border-primary/50 hover:shadow-soft-lg hover:-translate-y-0.5"
            >
              <img
                src={spriteUrl(p)}
                alt={`${p.names.en} sprite`}
                className="pixelated h-14 w-14 mx-auto"
                loading="lazy"
              />
              <div className="mt-1 font-pixel text-[8px] uppercase text-center truncate">
                {pokemonName(p, lang)}
              </div>
              <div className="flex justify-center gap-0.5 mt-1">
                {p.types.map((tp) => (
                  <TypeBadge key={tp} type={tp} size="xs" />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
