import { useEffect, useMemo, useState } from "react";
import { BuildSlot, Pokemon, PokemonStats, PokemonType } from "@/lib/types";
import { POKEMON, spriteUrl, artworkUrl } from "@/lib/pokemon";
import { MOVES } from "@/lib/moves";
import { loadMovepools } from "@/lib/pokemonMoves";
import { NATURES } from "@/lib/natures";
import { applySet, getCommonSets } from "@/lib/sets";
import { exportShowdown, importShowdown } from "@/lib/showdown";
import { calcAllMoves, CalcResult } from "@/lib/damageCalc";
import {
  defaultSp,
  SP_MAX_PER_STAT,
  SP_TOTAL_BUDGET,
  spUsed,
} from "@/lib/buildStore";
import { pokemonName, useLang } from "@/lib/i18n";
import { TypeBadge } from "./TypeBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ALL_TYPES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X, Search, ChevronDown, Plus, Minus, Download, Upload, Sparkles } from "lucide-react";

interface Props {
  slots: BuildSlot[];
  onChange: (slots: BuildSlot[]) => void;
  maxSlots?: number;
  accent?: "me" | "opponent";
  /** External targets (e.g. opponent team) the damage calc can shoot at. */
  externalTargets?: number[];
}

export function AdvancedTeamBuilder({
  slots,
  onChange,
  maxSlots = 6,
  accent = "me",
  externalTargets = [],
}: Props) {
  const { t, lang } = useLang();
  const [pickerOpen, setPickerOpen] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [movepools, setMovepools] = useState<Record<number, string[]> | null>(null);
  const [exported, setExported] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  useEffect(() => {
    loadMovepools().then(setMovepools);
  }, []);

  const monById = useMemo(
    () => new Map(POKEMON.map((p) => [p.id, p])),
    [],
  );

  function setSlot(idx: number, slot: BuildSlot | null) {
    const next = [...slots];
    if (slot) next[idx] = slot;
    else next.splice(idx, 1);
    onChange(next);
  }

  function pickPokemon(idx: number, p: Pokemon) {
    const pool = movepools?.[p.id] ?? [];
    const slot: BuildSlot = {
      pokemonId: p.id,
      ability: p.abilities?.[0]?.names.en,
      moves: pool.slice(0, 4),
      sp: defaultSp(),
      nature: "Hardy",
    };
    if (idx >= slots.length) {
      onChange([...slots, slot]);
    } else {
      const next = [...slots];
      next[idx] = slot;
      onChange(next);
    }
    setPickerOpen(null);
    setEditingIdx(idx >= slots.length ? slots.length : idx);
  }

  function handleExport() {
    const text = exportShowdown(slots, monById);
    navigator.clipboard.writeText(text).catch(() => {});
    setExported(true);
    setTimeout(() => setExported(false), 1500);
  }

  function handleImportSubmit() {
    const parsed = importShowdown(importText);
    if (parsed.length > 0) {
      onChange(parsed);
      setImportText("");
      setImportOpen(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Export / Import row */}
      <div className="grid grid-cols-2 gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleExport}
          disabled={slots.length === 0}
          className="min-w-0 px-2"
          title={t("exportShowdown")}
        >
          <Download className="h-3 w-3 shrink-0" />
          <span className="truncate hidden sm:inline">
            {exported ? t("copied") : t("exportShowdown")}
          </span>
          <span className="sm:hidden font-pixel text-[9px]">
            {exported ? t("copied") : "Export"}
          </span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setImportOpen(true)}
          className="min-w-0 px-2"
          title={t("importShowdown")}
        >
          <Upload className="h-3 w-3 shrink-0" />
          <span className="truncate hidden sm:inline">
            {t("importShowdown")}
          </span>
          <span className="sm:hidden font-pixel text-[9px]">Import</span>
        </Button>
      </div>

      {importOpen && (
        <div className="rounded-sm border-2 border-primary/60 bg-card/90 p-2 space-y-2">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={t("pasteShowdown")}
            rows={6}
            className="w-full rounded-sm border-2 border-border bg-input/40 px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-primary resize-y"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => setImportOpen(false)}>
              {t("close")}
            </Button>
            <Button size="sm" onClick={handleImportSubmit} disabled={!importText.trim()}>
              {t("importShowdown")}
            </Button>
          </div>
        </div>
      )}

      {/* Slot grid */}
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: maxSlots }).map((_, i) => {
          const slot = slots[i];
          const mon = slot ? monById.get(slot.pokemonId) : undefined;
          const isEditing = editingIdx === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (mon) setEditingIdx(isEditing ? null : i);
                else setPickerOpen(i);
              }}
              className={cn(
                "aspect-[4/5] flex flex-col items-center justify-between p-2 rounded-sm border-2 transition-all relative",
                mon
                  ? accent === "me"
                    ? "border-border bg-card/80 hover:border-primary/70"
                    : "border-border bg-card/80 hover:border-destructive/70"
                  : "border-dashed border-border/60 bg-muted/20 text-muted-foreground hover:border-border",
                isEditing && "ring-2 ring-primary border-primary/70",
              )}
            >
              {mon ? (
                <>
                  <div className="w-full flex items-start justify-between text-[8px] text-muted-foreground font-mono">
                    <span>#{mon.id}</span>
                    {mon.mega && (
                      <span className="font-pixel text-primary">{t("mega")}</span>
                    )}
                  </div>
                  <img
                    src={artworkUrl(mon)}
                    alt={mon.names.en ?? ""}
                    className="h-14 w-14 sm:h-20 sm:w-20 drop-shadow-[0_3px_6px_rgba(60,40,20,0.22)]"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                  <div className="w-full">
                    <div className="font-pixel text-[8px] uppercase text-center truncate text-shadow-pixel">
                      {pokemonName(mon, lang)}
                    </div>
                    <div className="flex justify-center gap-1 mt-1">
                      {mon.types.map((tp) => (
                        <TypeBadge key={tp} type={tp} size="xs" />
                      ))}
                    </div>
                  </div>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlot(i, null);
                      if (editingIdx === i) setEditingIdx(null);
                    }}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full border border-destructive/30 bg-destructive text-destructive-foreground flex items-center justify-center shadow-soft cursor-pointer"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 mt-auto mb-auto opacity-60" />
                  <div className="font-pixel text-[8px] uppercase tracking-wider">
                    {t("empty")}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Inline editor for active slot */}
      {editingIdx !== null && slots[editingIdx] && (
        <SlotEditor
          slot={slots[editingIdx]}
          pokemon={monById.get(slots[editingIdx].pokemonId)!}
          movepool={movepools?.[slots[editingIdx].pokemonId] ?? []}
          targets={[
            ...slots.filter((_, i) => i !== editingIdx),
            ...externalTargets.map<BuildSlot>((id) => ({
              pokemonId: id,
              moves: [],
              sp: defaultSp(),
              nature: "Hardy",
            })),
          ]}
          onChange={(updated) => {
            const next = [...slots];
            next[editingIdx] = updated;
            onChange(next);
          }}
          onClose={() => setEditingIdx(null)}
        />
      )}

      {/* Picker modal */}
      {pickerOpen !== null && (
        <PokemonPickerModal
          excludeIds={slots.map((s) => s.pokemonId)}
          onPick={(p) => pickPokemon(pickerOpen, p)}
          onClose={() => setPickerOpen(null)}
        />
      )}
    </div>
  );
}

// ----------------- Slot Editor -----------------

function SlotEditor({
  slot,
  pokemon,
  movepool,
  targets,
  onChange,
  onClose,
}: {
  slot: BuildSlot;
  pokemon: Pokemon;
  movepool: string[];
  targets: BuildSlot[];
  onChange: (s: BuildSlot) => void;
  onClose: () => void;
}) {
  const { t, lang } = useLang();
  const sp = slot.sp ?? defaultSp();
  const used = spUsed(sp);
  const remaining = SP_TOTAL_BUDGET - used;

  function setSp(key: keyof PokemonStats, value: number) {
    const clamped = Math.max(0, Math.min(SP_MAX_PER_STAT, value));
    const newSp = { ...sp, [key]: clamped };
    if (spUsed(newSp) > SP_TOTAL_BUDGET) return;
    onChange({ ...slot, sp: newSp });
  }

  const STATS_KEYS: Array<{ key: keyof PokemonStats; label: keyof import("@/lib/i18n").Lang extends never ? never : "statHp" | "statAtk" | "statDef" | "statSpa" | "statSpd" | "statSpe" }> = [
    { key: "hp", label: "statHp" },
    { key: "atk", label: "statAtk" },
    { key: "def", label: "statDef" },
    { key: "spa", label: "statSpa" },
    { key: "spd", label: "statSpd" },
    { key: "spe", label: "statSpe" },
  ];

  const moves = slot.moves ?? [];

  return (
    <div className="rounded-xl border border-primary/40 bg-card p-3 space-y-3 shadow-soft-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={artworkUrl(pokemon)}
            alt={pokemon.names.en ?? ""}
            className="h-10 w-10 shrink-0"
          />
          <div className="min-w-0">
            <div className="font-pixel text-[10px] uppercase text-shadow-pixel truncate">
              {pokemonName(pokemon, lang)}
            </div>
            <div className="flex gap-1 mt-0.5">
              {pokemon.types.map((tp) => (
                <TypeBadge key={tp} type={tp} size="xs" />
              ))}
            </div>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-7 w-7 shrink-0"
          aria-label={t("close")}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Common sets quick-apply */}
      {(() => {
        const sets = getCommonSets(pokemon.id);
        if (sets.length === 0) return null;
        return (
          <Field label={t("applySet")}>
            <div className="flex flex-wrap gap-1">
              {sets.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => onChange(applySet(slot, s))}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-sm border-2 border-accent/50 bg-accent/10 hover:bg-accent/25 font-pixel text-[8px] uppercase tracking-wider text-accent transition-colors"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {s.name}
                </button>
              ))}
            </div>
          </Field>
        );
      })()}

      {/* Ability */}
      {pokemon.abilities && pokemon.abilities.length > 0 && (
        <Field label={t("abilities")}>
          <select
            value={slot.ability ?? ""}
            onChange={(e) => onChange({ ...slot, ability: e.target.value })}
            className="w-full h-9 rounded-sm border-2 border-border bg-input/60 px-2 text-xs font-mono focus:outline-none focus:border-primary"
          >
            {pokemon.abilities.map((a, i) => (
              <option key={i} value={a.names.en}>
                {a.names[lang] ?? a.names.en} {a.hidden ? `(${t("hiddenAbility")})` : ""}
              </option>
            ))}
          </select>
        </Field>
      )}

      {/* Moves */}
      <Field label={t("moves")}>
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((mi) => (
            <MoveSelect
              key={mi}
              available={movepool}
              value={moves[mi]}
              onChange={(name) => {
                const newMoves = [...moves];
                if (name) newMoves[mi] = name;
                else delete newMoves[mi];
                onChange({ ...slot, moves: newMoves.filter(Boolean) });
              }}
            />
          ))}
        </div>
      </Field>

      {/* Nature & Item */}
      <div className="grid grid-cols-2 gap-2">
        <Field label="Nature">
          <select
            value={slot.nature ?? "Hardy"}
            onChange={(e) => onChange({ ...slot, nature: e.target.value })}
            className="w-full h-9 rounded-sm border-2 border-border bg-input/60 px-2 text-xs font-mono focus:outline-none focus:border-primary"
          >
            {NATURES.map((n) => (
              <option key={n.name} value={n.name}>
                {n.name} {n.plus ? `+${n.plus} -${n.minus}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tera">
          <select
            value={slot.teraType ?? ""}
            onChange={(e) =>
              onChange({
                ...slot,
                teraType: (e.target.value || undefined) as PokemonType | undefined,
              })
            }
            className="w-full h-9 rounded-sm border-2 border-border bg-input/60 px-2 text-xs font-mono focus:outline-none focus:border-primary"
          >
            <option value="">—</option>
            {ALL_TYPES.map((tp) => (
              <option key={tp} value={tp}>
                {tp}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Item">
        <Input
          value={slot.item ?? ""}
          onChange={(e) => onChange({ ...slot, item: e.target.value })}
          placeholder="Choice Specs, Life Orb, ..."
          className="h-9 text-xs"
        />
      </Field>

      {/* Stat Points */}
      <Field label={`SP · ${used}/${SP_TOTAL_BUDGET}`}>
        <div className="space-y-1.5">
          {STATS_KEYS.map(({ key, label }) => {
            const v = sp[key];
            const base = pokemon.stats?.[key] ?? 0;
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="w-10 text-[9px] font-pixel uppercase text-muted-foreground shrink-0">
                  {t(label)}
                </div>
                <div className="w-8 font-mono text-[10px] text-muted-foreground shrink-0">
                  {base}
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 shrink-0"
                    onClick={() => setSp(key, v - 4)}
                    disabled={v <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="flex-1 h-2 bg-muted/60 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(v / SP_MAX_PER_STAT) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-[10px]">{v}</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 shrink-0"
                    onClick={() => setSp(key, v + 4)}
                    disabled={v >= SP_MAX_PER_STAT || remaining <= 0}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Field>

      {/* Damage calculator */}
      <DamagePanel slot={slot} targets={targets} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}

// ----------------- Move Selector -----------------

function MoveSelect({
  available,
  value,
  onChange,
}: {
  available: string[];
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const move = value ? MOVES[value] : undefined;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return available.filter((m) => m.toLowerCase().includes(q)).slice(0, 60);
  }, [available, query]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-9 rounded-sm border-2 border-border bg-input/60 px-2 text-xs font-mono flex items-center justify-between gap-1 hover:border-primary/60 transition-colors text-left"
      >
        <span className="truncate flex-1">{move?.name ?? "—"}</span>
        {move && <TypeBadge type={move.type} size="xs" />}
        <ChevronDown
          className={cn("h-3 w-3 transition-transform shrink-0", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-auto rounded-xl border border-border shadow-soft-lg"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div
            className="sticky top-0 p-1.5 border-b border-border"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-7 text-[10px]"
              autoFocus
            />
          </div>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="w-full px-2 py-1.5 text-left text-[10px] font-mono text-muted-foreground hover:bg-accent/20 border-b border-border/40"
            >
              — Clear
            </button>
          )}
          {filtered.map((mname) => {
            const m = MOVES[mname];
            return (
              <button
                key={mname}
                type="button"
                onClick={() => {
                  onChange(mname);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-accent/20 text-[10px] font-mono"
              >
                <span className="flex-1 truncate">{mname}</span>
                {m && (
                  <>
                    {m.power != null && (
                      <span className="text-muted-foreground">{m.power}</span>
                    )}
                    <TypeBadge type={m.type} size="xs" />
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ----------------- Pokémon Picker Modal -----------------

function PokemonPickerModal({
  excludeIds,
  onPick,
  onClose,
}: {
  excludeIds: number[];
  onPick: (p: Pokemon) => void;
  onClose: () => void;
}) {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<PokemonType | null>(null);

  const filtered = useMemo(() => {
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return POKEMON.filter((p) => {
      if (excludeIds.includes(p.id)) return false;
      if (typeFilter && !p.types.includes(typeFilter)) return false;
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
  }, [query, typeFilter, excludeIds]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-3xl max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-2xl border border-border shadow-soft-lg flex flex-col"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="p-3 border-b-2 border-border space-y-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              autoFocus
              className="flex-1 h-9"
            />
            <Button size="icon" variant="outline" onClick={onClose} className="h-9 w-9">
              <X className="h-4 w-4" />
            </Button>
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
                    active ? "opacity-100 ring-2 ring-primary rounded-sm" : "opacity-60 hover:opacity-100",
                  )}
                >
                  <TypeBadge type={tp} size="xs" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-3">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPick(p)}
                className="rounded-sm border-2 border-border bg-card/60 p-2 hover:border-primary/70 transition-all hover:-translate-y-0.5"
              >
                <img
                  src={spriteUrl(p)}
                  alt={p.names.en ?? ""}
                  className="pixelated h-14 w-14 mx-auto"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                  }}
                />
                <div className="font-pixel text-[8px] uppercase text-center truncate mt-1">
                  {pokemonName(p, lang)}
                </div>
                <div className="flex justify-center gap-0.5 mt-1">
                  {p.types.map((tp) => (
                    <TypeBadge key={tp} type={tp} size="xs" />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- Damage Calc Panel -----------------

function DamagePanel({
  slot,
  targets,
}: {
  slot: BuildSlot;
  targets: BuildSlot[];
}) {
  const { t, lang } = useLang();
  const monById = useMemo(() => new Map(POKEMON.map((p) => [p.id, p])), []);
  const [targetIdx, setTargetIdx] = useState(0);

  const validTargets = targets.filter((tg) => monById.has(tg.pokemonId));
  const target = validTargets[targetIdx];

  if (validTargets.length === 0) {
    return (
      <Field label={t("damageCalc")}>
        <div className="text-[10px] text-muted-foreground font-mono italic">
          {t("noDamageData")}
        </div>
      </Field>
    );
  }

  const results: CalcResult[] = target ? calcAllMoves({ attacker: slot, defender: target }) : [];
  const targetMon = target ? monById.get(target.pokemonId) : undefined;

  return (
    <Field label={t("damageCalc")}>
      <div className="space-y-2">
        <select
          value={targetIdx}
          onChange={(e) => setTargetIdx(parseInt(e.target.value, 10))}
          className="w-full h-9 rounded-sm border-2 border-border bg-input/60 px-2 text-xs font-mono focus:outline-none focus:border-primary"
        >
          {validTargets.map((tg, i) => {
            const m = monById.get(tg.pokemonId);
            return (
              <option key={`${tg.pokemonId}-${i}`} value={i}>
                vs {m ? pokemonName(m, lang) : `#${tg.pokemonId}`}
              </option>
            );
          })}
        </select>

        {targetMon && (
          <div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-muted/30 border border-border/40">
            <img
              src={spriteUrl(targetMon)}
              alt={targetMon.names.en ?? ""}
              className="pixelated h-8 w-8"
            />
            <div className="font-pixel text-[9px] uppercase truncate">
              {pokemonName(targetMon, lang)}
            </div>
            <div className="ml-auto flex gap-1">
              {targetMon.types.map((tp) => (
                <TypeBadge key={tp} type={tp} size="xs" />
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && (
          <div className="text-[10px] text-muted-foreground font-mono italic">
            {t("noDamageData")}
          </div>
        )}

        {results.map((r) => (
          <div
            key={r.move}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-sm border-2",
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
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              {r.minPct}–{r.maxPct}%
            </span>
            <span
              className={cn(
                "font-pixel text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border",
                r.ko === "OHKO"
                  ? "bg-rose-500/20 border-rose-500/60 text-rose-600"
                  : r.ko === "2HKO"
                    ? "bg-orange-500/20 border-orange-500/60 text-orange-600"
                    : r.ko === "3HKO"
                      ? "bg-yellow-500/20 border-yellow-500/60 text-yellow-600"
                      : "bg-muted/40 border-border text-muted-foreground",
              )}
            >
              {r.ko}
            </span>
          </div>
        ))}
      </div>
    </Field>
  );
}
