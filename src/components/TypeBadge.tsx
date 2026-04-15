import { PokemonType, TYPE_COLORS } from "@/lib/types";
import { typeLabel, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function TypeBadge({
  type,
  size = "sm",
}: {
  type: PokemonType;
  size?: "xs" | "sm";
}) {
  const { lang } = useLang();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm font-pixel uppercase tracking-wider border border-black/30 shadow-[1px_1px_0_0_rgba(0,0,0,0.6)]",
        TYPE_COLORS[type],
        size === "xs" ? "text-[8px] px-1 py-0.5" : "text-[9px] px-1.5 py-0.5",
      )}
      title={type}
    >
      {typeLabel(type, lang)}
    </span>
  );
}
