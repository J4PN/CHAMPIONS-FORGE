import { useMemo } from "react";
import { Pokemon } from "@/lib/types";
import { POKEMON, spriteUrl, artworkUrl } from "@/lib/pokemon";
import { getMegaForms } from "@/lib/coverage";
import { pokemonName, useLang } from "@/lib/i18n";
import { TypeBadge } from "./TypeBadge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  pokemon?: Pokemon;
  onRemove?: () => void;
  accent?: "opponent" | "me";
}

export function TeamSlot({ pokemon, onRemove, accent = "me" }: Props) {
  const { lang, t } = useLang();
  const accentRing =
    accent === "opponent"
      ? "hover:border-destructive/50 hover:shadow-soft-lg"
      : "hover:border-primary/50 hover:shadow-soft-lg";

  const ghostSprite = useMemo(() => {
    const pool = POKEMON.filter((p) => !p.mega);
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  if (!pokemon) {
    return (
      <div className="aspect-[4/5] flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 text-muted-foreground relative overflow-hidden">
        <img
          src={spriteUrl(ghostSprite)}
          alt=""
          className="pixelated h-12 w-12 sm:h-16 sm:w-16 object-contain opacity-[0.08] absolute"
          loading="lazy"
        />
        <div className="font-pixel text-[8px] uppercase tracking-wider relative">
          {t("empty")}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative aspect-[4/5] flex flex-col items-center justify-between p-2 rounded-xl border border-border bg-card shadow-soft transition-all hover:scale-[1.03]",
        accentRing,
      )}
    >
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full border border-destructive/30 bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-soft"
          aria-label="Retirer"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="w-full flex items-start justify-between text-[8px] text-muted-foreground">
        <span>#{pokemon.id}</span>
        {pokemon.mega && (
          <span className="font-pixel text-primary">MEGA</span>
        )}
        {!pokemon.mega && getMegaForms(pokemon).length > 0 && (
          <span className="font-pixel text-[6px] text-primary/60 border border-primary/30 rounded px-1">
            MEGA
          </span>
        )}
      </div>
      <img
        src={artworkUrl(pokemon)}
        alt={pokemon.names.en ?? ""}
        className="h-14 w-14 sm:h-20 sm:w-20 object-contain drop-shadow-[0_3px_6px_rgba(60,40,20,0.22)] transition-transform group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
        }}
      />
      <div className="w-full space-y-1">
        <div className="font-pixel text-[8px] uppercase text-center truncate text-shadow-pixel">
          {pokemonName(pokemon, lang)}
        </div>
        <div className="flex justify-center gap-1 flex-wrap">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size="xs" />
          ))}
        </div>
      </div>
    </div>
  );
}
