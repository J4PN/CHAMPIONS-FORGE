import { BattleFormat, BRING_COUNT } from "./BestPicks";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Props {
  value: BattleFormat;
  onChange: (v: BattleFormat) => void;
}

export function FormatToggle({ value, onChange }: Props) {
  const { t } = useLang();
  const FORMATS: { key: BattleFormat; label: string; sub: string }[] = [
    { key: "1v1", label: "1v1", sub: t("simple") },
    { key: "2v2", label: "2v2", sub: t("double") },
  ];
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/60 p-1">
      {FORMATS.map((f) => {
        const active = f.key === value;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg px-2 py-2 transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-soft-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-card",
            )}
          >
            <span className="font-pixel text-xs tracking-wider">
              {f.label}
            </span>
            <span className="text-[8px] font-pixel uppercase tracking-wider opacity-80 mt-0.5">
              {f.sub} · {t("formatPick")} {BRING_COUNT[f.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
