import { useMemo } from "react";
import { getCurrentSeason, seasonStatus } from "@/lib/seasons";
import { useLang } from "@/lib/i18n";
import { Trophy, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function SeasonBanner() {
  const { t } = useLang();
  const season = useMemo(() => getCurrentSeason(), []);
  const status = useMemo(
    () => (season ? seasonStatus(season) : null),
    [season],
  );

  if (!season || !status) return null;

  const stateLabel =
    status.state === "active"
      ? t("seasonActive")
      : status.state === "upcoming"
        ? t("seasonUpcoming")
        : t("seasonEnded");

  const stateColor =
    status.state === "active"
      ? "border-primary/30 bg-primary/10 text-primary"
      : status.state === "upcoming"
        ? "border-accent/50 bg-accent/20 text-accent-foreground"
        : "border-border bg-muted text-muted-foreground";

  const progress =
    status.state === "active" && status.daysIn != null && status.daysLeft != null
      ? Math.min(100, (status.daysIn / (status.daysIn + status.daysLeft)) * 100)
      : null;

  return (
    <details className="rounded-lg border border-border bg-card/60 shadow-soft group">
      <summary className="px-3 py-2 flex items-center gap-3 flex-wrap text-[9px] cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-3 w-3 text-primary shrink-0" />
          <span className="font-pixel uppercase tracking-wider text-muted-foreground">
            {t("currentSeason")}
          </span>
          <span className="font-pixel uppercase tracking-wider text-foreground">
            {season.name}
          </span>
        </div>

        <span
          className={cn(
            "font-pixel uppercase tracking-wider px-1.5 py-0.5 rounded-full border",
            stateColor,
          )}
        >
          {stateLabel}
        </span>

        <span className="font-pixel uppercase tracking-wider text-muted-foreground">
          {season.format.toUpperCase()}
        </span>

        <div className="flex items-center gap-1 text-muted-foreground ml-auto">
          <Clock className="h-3 w-3" />
          <span className="font-pixel uppercase tracking-wider">
            {status.state === "active" && t("daysLeft", { n: status.daysLeft ?? 0 })}
            {status.state === "upcoming" && t("startsIn", { n: status.daysIn ?? 0 })}
            {status.state === "ended" && t("seasonEnded")}
          </span>
          <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
        </div>

        {/* Animated progress bar */}
        {progress !== null && (
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mt-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-accent transition-[width] duration-700 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        )}
      </summary>

      {/* Expanded rules */}
      <div className="px-3 pb-3 pt-1 border-t border-border/50">
        {progress !== null && (
          <div className="flex justify-between text-[8px] text-muted-foreground mb-2">
            <span>{season.startDate}</span>
            <span>{season.endDate}</span>
          </div>
        )}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
          {season.rules.map((r) => (
            <li
              key={r}
              className="text-[10px] text-muted-foreground flex items-start gap-1.5"
            >
              <span className="text-primary mt-0.5">+</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
