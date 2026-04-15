import { useMemo, useState } from "react";
import { POKEMON, artworkUrl } from "@/lib/pokemon";
import { Pokemon, ALL_TYPES, PokemonType } from "@/lib/types";
import { pokemonName, useLang } from "@/lib/i18n";
import { getTier, TIER_COLORS, TIER_ORDER, Tier } from "@/lib/tiers";
import { TypeBadge } from "./TypeBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, X, Sparkles } from "lucide-react";
import { PokemonDetailModal } from "./PokemonDetailModal";

type MegaFilter = "all" | "mega" | "base";

export function PokedexPage() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null);
  const [megaFilter, setMegaFilter] = useState<MegaFilter>("all");
  const [tierFilter, setTierFilter] = useState<Tier | null>(null);
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [shiny, setShiny] = useState(false);

  const filtered = useMemo(() => {
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return POKEMON.filter((p) => {
      if (megaFilter === "mega" && !p.mega) return false;
      if (megaFilter === "base" && p.mega) return false;
      if (typeFilter && !p.types.includes(typeFilter)) return false;
      if (tierFilter && getTier(p.id) !== tierFilter) return false;
      if (q) {
        const names = Object.values(p.names)
          .map((n) =>
            (n ?? "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, ""),
          )
          .join("|");
        if (!names.includes(q)) return false;
      }
      return true;
    });
  }, [query, typeFilter, megaFilter, tierFilter]);

  return (
    <main className="container py-6 sm:py-10">
      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            {t("pokedexTitle")}
          </h1>
        </div>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-3">
          <span className="text-primary">{filtered.length}</span> / {t("pokedexCount", { n: filtered.length }).replace(/^\d+\s*/, "")}
        </p>
      </header>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="pl-9"
          />
        </div>

        <div className="flex gap-1 flex-wrap">
          <FilterPill
            active={megaFilter === "all"}
            onClick={() => setMegaFilter("all")}
          >
            {t("filterAll")}
          </FilterPill>
          <FilterPill
            active={megaFilter === "base"}
            onClick={() => setMegaFilter("base")}
          >
            {t("filterBase")}
          </FilterPill>
          <FilterPill
            active={megaFilter === "mega"}
            onClick={() => setMegaFilter("mega")}
          >
            {t("filterMega")}
          </FilterPill>
          <button
            type="button"
            onClick={() => setShiny(!shiny)}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-lg border font-pixel text-[9px] uppercase tracking-wider transition-all",
              shiny
                ? "border-yellow-500/50 bg-yellow-500/20 text-yellow-700"
                : "border-border bg-card text-muted-foreground hover:bg-muted",
            )}
          >
            <Sparkles className="h-3 w-3" />
            Shiny
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {ALL_TYPES.map((tp) => {
            const active = typeFilter === tp;
            return (
              <button
                key={tp}
                type="button"
                onClick={() => setTypeFilter(active ? null : tp)}
                className={cn(
                  "transition-opacity",
                  active ? "opacity-100 ring-2 ring-primary" : "opacity-60 hover:opacity-100",
                )}
              >
                <TypeBadge type={tp} />
              </button>
            );
          })}
          {typeFilter && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTypeFilter(null)}
              className="h-6 px-2 text-[8px]"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {TIER_ORDER.map((tt) => {
            const active = tierFilter === tt;
            return (
              <button
                key={tt}
                type="button"
                onClick={() => setTierFilter(active ? null : tt)}
                className={cn(
                  "px-2 py-1 rounded-sm border-2 font-pixel text-[9px] uppercase tracking-wider transition-all",
                  active ? `${TIER_COLORS[tt]} ring-2 ring-primary` : TIER_COLORS[tt] + " opacity-60 hover:opacity-100",
                )}
              >
                {tt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p)}
            className="group rounded-xl border border-border bg-card p-2 shadow-soft transition-all hover:border-primary/50 hover:shadow-soft-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between text-[8px] text-muted-foreground font-mono">
              <span>#{p.id}</span>
              {(() => {
                const tier = getTier(p.id);
                return tier ? (
                  <span className={cn("font-pixel px-1 rounded-sm border", TIER_COLORS[tier])}>{tier}</span>
                ) : p.mega ? (
                  <span className="font-pixel text-primary">{t("mega")}</span>
                ) : null;
              })()}
            </div>
            <img
              src={artworkUrl(p, shiny)}
              alt={p.names.en ?? ""}
              className="h-16 w-16 sm:h-20 sm:w-20 mx-auto drop-shadow-[0_3px_6px_rgba(60,40,20,0.2)]"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
              }}
            />
            <div className="mt-1 font-pixel text-[8px] uppercase text-center truncate text-shadow-pixel">
              {pokemonName(p, lang)}
            </div>
            <div className="flex justify-center gap-0.5 mt-1 flex-wrap">
              {p.types.map((ty) => (
                <TypeBadge key={ty} type={ty} size="xs" />
              ))}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-sm border-2 border-dashed border-border/50 bg-muted/10 p-8 text-center mt-6">
          <p className="font-pixel text-[10px] uppercase text-muted-foreground">
            —
          </p>
        </div>
      )}

      {selected && (
        <PokemonDetailModal
          pokemon={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-sm border-2 font-pixel text-[9px] uppercase tracking-wider transition-colors",
        active
          ? "border-primary bg-primary/20 text-primary"
          : "border-border bg-muted/30 text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

