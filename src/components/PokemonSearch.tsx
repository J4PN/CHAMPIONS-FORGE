import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Pokemon } from "@/lib/types";
import { searchPokemon, spriteUrl } from "@/lib/pokemon";
import { pokemonName, useLang } from "@/lib/i18n";
import { TypeBadge } from "./TypeBadge";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface Props {
  placeholder?: string;
  onSelect: (p: Pokemon) => void;
  excludeIds?: number[];
  disabled?: boolean;
}

export function PokemonSearch({
  placeholder,
  onSelect,
  excludeIds = [],
  disabled,
}: Props) {
  const { lang, t } = useLang();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchPokemon(query, 10).filter((p) => !excludeIds.includes(p.id));
  }, [query, excludeIds]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSelect(p: Pokemon) {
    onSelect(p);
    setQuery("");
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(results.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(results[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? t("search")}
          disabled={disabled}
          className="pl-9"
        />
      </div>
      {open && results.length > 0 && (
        <div
          className="absolute z-50 mt-2 w-full max-h-80 overflow-auto rounded-xl border border-border shadow-soft-lg"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {results.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onMouseEnter={() => setHighlight(i)}
              onClick={() => handleSelect(p)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                i === highlight && "bg-accent/30",
              )}
            >
              <img
                src={spriteUrl(p)}
                alt={p.names.en ?? ""}
                width={36}
                height={36}
                className="pixelated shrink-0"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-pixel text-[10px] uppercase truncate">
                    {pokemonName(p, lang)}
                  </span>
                  {p.mega && (
                    <span className="text-[8px] font-pixel uppercase text-primary">
                      {t("mega")}
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mt-1">
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} size="xs" />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">
                #{p.id}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
