import { useState } from "react";
import { Pokemon, BuildSlot, PokemonStats, PokemonType } from "@/lib/types";
import { StatRadar } from "./StatRadar";
import { spriteUrl, searchPokemon } from "@/lib/pokemon";
import { pokemonName, useLang } from "@/lib/i18n";
import { defensiveMatchups, bestStabMultiplier } from "@/lib/coverage";
import { calcAllMoves } from "@/lib/damageCalc";
import { defaultSp, SP_MAX_PER_STAT, SP_TOTAL_BUDGET, spUsed } from "@/lib/buildStore";
import { NATURES } from "@/lib/natures";
import { ALL_TYPES } from "@/lib/types";
import { TypeBadge } from "./TypeBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Search, X, Plus, Minus } from "lucide-react";
import { loadMovepools } from "@/lib/pokemonMoves";
import { useEffect } from "react";

const STATS: Array<{ key: keyof PokemonStats; label: "statHp" | "statAtk" | "statDef" | "statSpa" | "statSpd" | "statSpe" }> = [
  { key: "hp", label: "statHp" },
  { key: "atk", label: "statAtk" },
  { key: "def", label: "statDef" },
  { key: "spa", label: "statSpa" },
  { key: "spd", label: "statSpd" },
  { key: "spe", label: "statSpe" },
];

interface CompareSide {
  pokemon: Pokemon | null;
  slot: BuildSlot | null;
}

export function ComparePage() {
  const { t, lang } = useLang();
  const [a, setA] = useState<CompareSide>({ pokemon: null, slot: null });
  const [b, setB] = useState<CompareSide>({ pokemon: null, slot: null });
  const [movepools, setMovepools] = useState<Record<number, string[]> | null>(null);

  useEffect(() => {
    loadMovepools().then(setMovepools);
  }, []);

  function makeSide(p: Pokemon): CompareSide {
    const pool = movepools?.[p.id] ?? [];
    return {
      pokemon: p,
      slot: {
        pokemonId: p.id,
        ability: p.abilities?.[0]?.names.en,
        nature: "Hardy",
        sp: defaultSp(),
        moves: pool.slice(0, 4),
      },
    };
  }

  return (
    <main className="container py-4 sm:py-8 max-w-5xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            {t("compareTitle")}
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BuildColumn
          side={a}
          onPick={(p) => setA(makeSide(p))}
          onClear={() => setA({ pokemon: null, slot: null })}
          onSlotChange={(slot) => setA({ ...a, slot })}
          movepool={a.pokemon ? movepools?.[a.pokemon.id] ?? [] : []}
          placeholder={t("pickFirst")}
          accent="primary"
        />
        <BuildColumn
          side={b}
          onPick={(p) => setB(makeSide(p))}
          onClear={() => setB({ pokemon: null, slot: null })}
          onSlotChange={(slot) => setB({ ...b, slot })}
          movepool={b.pokemon ? movepools?.[b.pokemon.id] ?? [] : []}
          placeholder={t("pickSecond")}
          accent="accent"
        />
      </div>

      {a.pokemon && b.pokemon && a.slot && b.slot && (
        <ComparisonResults
          a={a.pokemon}
          b={b.pokemon}
          aSlot={a.slot}
          bSlot={b.slot}
          t={t}
          lang={lang}
        />
      )}
    </main>
  );
}

// ----------------- Build Column -----------------

function BuildColumn({
  side,
  onPick,
  onClear,
  onSlotChange,
  movepool,
  placeholder,
  accent,
}: {
  side: CompareSide;
  onPick: (p: Pokemon) => void;
  onClear: () => void;
  onSlotChange: (slot: BuildSlot) => void;
  movepool: string[];
  placeholder: string;
  accent: "primary" | "accent";
}) {
  const { lang, t } = useLang();
  const [query, setQuery] = useState("");
  const results = query ? searchPokemon(query, 8) : [];

  if (!side.pokemon || !side.slot) {
    return (
      <Card className={cn(accent === "primary" ? "border-primary/40" : "border-accent/40")}>
        <CardContent className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="pl-9"
            />
          </div>
          {results.length > 0 && (
            <div className="max-h-72 overflow-auto space-y-1">
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onPick(p);
                    setQuery("");
                  }}
                  className="w-full flex items-center gap-2 p-1.5 rounded-sm hover:bg-accent/20 text-left"
                >
                  <img src={spriteUrl(p)} alt={p.names.en ?? ""} className="pixelated h-8 w-8" />
                  <span className="font-pixel text-[10px] uppercase truncate flex-1">
                    {pokemonName(p, lang)}
                  </span>
                  <div className="flex gap-0.5">
                    {p.types.map((tp) => (
                      <TypeBadge key={tp} type={tp} size="xs" />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const slot = side.slot;
  const sp = slot.sp ?? defaultSp();
  const used = spUsed(sp);
  const remaining = SP_TOTAL_BUDGET - used;

  function setSp(key: keyof PokemonStats, v: number) {
    const clamped = Math.max(0, Math.min(SP_MAX_PER_STAT, v));
    const newSp = { ...sp, [key]: clamped };
    if (spUsed(newSp) > SP_TOTAL_BUDGET) return;
    onSlotChange({ ...slot, sp: newSp });
  }

  return (
    <Card className={cn(accent === "primary" ? "border-primary/40" : "border-accent/40")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img
            src={spriteUrl(side.pokemon)}
            alt={side.pokemon.names.en ?? ""}
            className="pixelated h-10 w-10"
          />
          <div className="min-w-0 flex-1">
            <div className="font-pixel text-[11px] uppercase truncate">
              {pokemonName(side.pokemon, lang)}
            </div>
            <div className="flex gap-1 mt-1">
              {side.pokemon.types.map((tp) => (
                <TypeBadge key={tp} type={tp} size="xs" />
              ))}
            </div>
          </div>
          <Button size="icon" variant="outline" onClick={onClear} className="h-7 w-7">
            <X className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Ability */}
        {side.pokemon.abilities && side.pokemon.abilities.length > 0 && (
          <div>
            <div className="text-[9px] font-pixel uppercase text-muted-foreground mb-1">
              {t("abilities")}
            </div>
            <select
              value={slot.ability ?? ""}
              onChange={(e) => onSlotChange({ ...slot, ability: e.target.value })}
              className="w-full h-9 rounded-sm border-2 border-border bg-input/60 px-2 text-xs font-mono"
            >
              {side.pokemon.abilities.map((a, i) => (
                <option key={i} value={a.names.en}>
                  {a.names[lang] ?? a.names.en}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Nature & Tera */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[9px] font-pixel uppercase text-muted-foreground mb-1">Nature</div>
            <select
              value={slot.nature ?? "Hardy"}
              onChange={(e) => onSlotChange({ ...slot, nature: e.target.value })}
              className="w-full h-9 rounded-sm border-2 border-border bg-input/60 px-2 text-xs font-mono"
            >
              {NATURES.map((n) => (
                <option key={n.name} value={n.name}>
                  {n.name} {n.plus ? `+${n.plus}/-${n.minus}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-[9px] font-pixel uppercase text-muted-foreground mb-1">Tera</div>
            <select
              value={slot.teraType ?? ""}
              onChange={(e) =>
                onSlotChange({
                  ...slot,
                  teraType: (e.target.value || undefined) as PokemonType | undefined,
                })
              }
              className="w-full h-9 rounded-sm border-2 border-border bg-input/60 px-2 text-xs font-mono"
            >
              <option value="">—</option>
              {ALL_TYPES.map((tp) => (
                <option key={tp} value={tp}>
                  {tp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Item */}
        <div>
          <div className="text-[9px] font-pixel uppercase text-muted-foreground mb-1">Item</div>
          <Input
            value={slot.item ?? ""}
            onChange={(e) => onSlotChange({ ...slot, item: e.target.value })}
            placeholder="Choice Specs, Life Orb, ..."
            className="h-9 text-xs"
          />
        </div>

        {/* SP */}
        <div>
          <div className="text-[9px] font-pixel uppercase text-muted-foreground mb-1">
            SP · {used}/{SP_TOTAL_BUDGET}
          </div>
          <div className="space-y-1.5">
            {STATS.map(({ key, label }) => {
              const v = sp[key];
              const base = side.pokemon!.stats?.[key] ?? 0;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-10 text-[9px] font-pixel uppercase text-muted-foreground shrink-0">
                    {t(label)}
                  </div>
                  <div className="w-7 font-mono text-[10px] text-muted-foreground shrink-0">
                    {base}
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-5 w-5 shrink-0"
                    onClick={() => setSp(key, v - 4)}
                    disabled={v <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="flex-1 h-1.5 bg-muted/60 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(v / SP_MAX_PER_STAT) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 text-right font-mono text-[10px]">{v}</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-5 w-5 shrink-0"
                    onClick={() => setSp(key, v + 4)}
                    disabled={v >= SP_MAX_PER_STAT || remaining <= 0}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Moves */}
        {movepool.length > 0 && (
          <div>
            <div className="text-[9px] font-pixel uppercase text-muted-foreground mb-1">
              {t("moves")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <select
                  key={i}
                  value={slot.moves?.[i] ?? ""}
                  onChange={(e) => {
                    const moves = [...(slot.moves ?? [])];
                    if (e.target.value) moves[i] = e.target.value;
                    else delete moves[i];
                    onSlotChange({ ...slot, moves: moves.filter(Boolean) });
                  }}
                  className="h-8 min-w-0 rounded-sm border-2 border-border bg-input/60 px-2 text-[10px] font-mono"
                >
                  <option value="">—</option>
                  {movepool.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ----------------- Comparison Results -----------------

function ComparisonResults({
  a,
  b,
  aSlot,
  bSlot,
  t,
  lang,
}: {
  a: Pokemon;
  b: Pokemon;
  aSlot: BuildSlot;
  bSlot: BuildSlot;
  t: ReturnType<typeof useLang>["t"];
  lang: ReturnType<typeof useLang>["lang"];
}) {
  const aMatchups = defensiveMatchups(a);
  const bMatchups = defensiveMatchups(b);
  const aVsB = bestStabMultiplier(a, b);
  const bVsA = bestStabMultiplier(b, a);
  const aDmg = calcAllMoves({ attacker: aSlot, defender: bSlot });
  const bDmg = calcAllMoves({ attacker: bSlot, defender: aSlot });

  return (
    <div className="mt-6 space-y-4">
      {/* Stats compare */}
      <Card>
        <CardHeader>
          <CardTitle>{t("baseStats")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Radar chart overlay */}
          {a.stats && b.stats && (
            <div className="flex justify-center py-2">
              <StatRadar stats={a.stats} stats2={b.stats} size={260} />
            </div>
          )}
          {STATS.map(({ key, label }) => {
            const av = a.stats?.[key] ?? 0;
            const bv = b.stats?.[key] ?? 0;
            const max = Math.max(av, bv, 1);
            return (
              <div key={key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="flex items-center justify-end gap-2">
                  <span className={cn("font-mono text-xs tabular-nums", av > bv && "text-emerald-600 font-bold")}>{av}</span>
                  <div className="flex-1 max-w-[120px] h-2 bg-muted/60 rounded-sm overflow-hidden flex">
                    <div className="flex-1" />
                    <div
                      className={cn("h-full", av >= bv ? "bg-emerald-500" : "bg-muted-foreground/40")}
                      style={{ width: `${(av / max) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="font-pixel text-[9px] uppercase text-muted-foreground w-10 text-center">
                  {t(label)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 max-w-[120px] h-2 bg-muted/60 rounded-sm overflow-hidden">
                    <div
                      className={cn("h-full", bv >= av ? "bg-emerald-500" : "bg-muted-foreground/40")}
                      style={{ width: `${(bv / max) * 100}%` }}
                    />
                  </div>
                  <span className={cn("font-mono text-xs tabular-nums", bv > av && "text-emerald-600 font-bold")}>{bv}</span>
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 pt-2 border-t border-border/40">
            <div className="text-right font-mono text-xs">
              {Object.values(a.stats ?? {}).reduce((s, v) => s + v, 0)}
            </div>
            <div className="font-pixel text-[9px] uppercase text-muted-foreground text-center">
              {t("totalStats")}
            </div>
            <div className="text-left font-mono text-xs">
              {Object.values(b.stats ?? {}).reduce((s, v) => s + v, 0)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Damage results */}
      <Card>
        <CardHeader>
          <CardTitle>{t("damageCalc")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-pixel text-[9px] uppercase text-primary mb-2">
              {pokemonName(a, lang)} → {pokemonName(b, lang)}
            </div>
            <div className="space-y-1">
              {aDmg.length === 0 && (
                <div className="text-[10px] text-muted-foreground italic">
                  {t("noDamageData")}
                </div>
              )}
              {aDmg.map((r) => (
                <DamageRow key={r.move} r={r} />
              ))}
            </div>
          </div>
          <div>
            <div className="font-pixel text-[9px] uppercase text-accent mb-2">
              {pokemonName(b, lang)} → {pokemonName(a, lang)}
            </div>
            <div className="space-y-1">
              {bDmg.length === 0 && (
                <div className="text-[10px] text-muted-foreground italic">
                  {t("noDamageData")}
                </div>
              )}
              {bDmg.map((r) => (
                <DamageRow key={r.move} r={r} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type matchup */}
      <Card>
        <CardHeader>
          <CardTitle>Type matchup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="font-pixel text-[9px] uppercase text-muted-foreground mb-1">
                {pokemonName(a, lang)} →
              </div>
              <div className={cn("font-pixel text-2xl text-shadow-pixel", aVsB >= 2 ? "text-emerald-600" : aVsB <= 0.5 ? "text-red-600" : "text-foreground")}>
                ×{aVsB}
              </div>
            </div>
            <div className="text-center">
              <div className="font-pixel text-[9px] uppercase text-muted-foreground mb-1">
                ← {pokemonName(b, lang)}
              </div>
              <div className={cn("font-pixel text-2xl text-shadow-pixel", bVsA >= 2 ? "text-emerald-600" : bVsA <= 0.5 ? "text-red-600" : "text-foreground")}>
                ×{bVsA}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Defensive matchups */}
      <Card>
        <CardHeader>
          <CardTitle>{t("weaknesses")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-pixel text-[9px] uppercase text-muted-foreground mb-2">
              {pokemonName(a, lang)}
            </div>
            <div className="flex flex-wrap gap-1">
              {aMatchups.weak.map((w) => (
                <div key={w.type} className="flex items-center gap-1">
                  <TypeBadge type={w.type} size="xs" />
                  <span className="text-[8px] font-pixel text-red-600">×{w.mult}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-pixel text-[9px] uppercase text-muted-foreground mb-2">
              {pokemonName(b, lang)}
            </div>
            <div className="flex flex-wrap gap-1">
              {bMatchups.weak.map((w) => (
                <div key={w.type} className="flex items-center gap-1">
                  <TypeBadge type={w.type} size="xs" />
                  <span className="text-[8px] font-pixel text-red-600">×{w.mult}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DamageRow({ r }: { r: import("@/lib/damageCalc").CalcResult }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-sm border-2",
        r.effectiveness === 0
          ? "border-zinc-700 bg-zinc-900/30"
          : r.effectiveness >= 2
            ? "border-emerald-500/50 bg-emerald-500/10"
            : r.effectiveness < 1
              ? "border-red-500/40 bg-red-500/5"
              : "border-border bg-muted/20",
      )}
    >
      <TypeBadge type={r.type} size="xs" />
      <span className="font-mono text-[10px] flex-1 truncate">{r.move}</span>
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
        {r.minPct}–{r.maxPct}%
      </span>
      <span
        className={cn(
          "font-pixel text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border",
          r.ko === "OHKO"
            ? "bg-rose-500/20 border-rose-500/60 text-rose-600"
            : r.ko === "2HKO"
              ? "bg-orange-500/20 border-orange-500/60 text-orange-600"
              : "bg-muted/40 border-border text-muted-foreground",
        )}
      >
        {r.ko}
      </span>
    </div>
  );
}
