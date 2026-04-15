import { useEffect, useState } from "react";
import { Pokemon } from "@/lib/types";
import { analyzeTeam, AnalysisResult } from "@/lib/teamAnalysis";
import { formatSuggestion } from "@/lib/formatSuggestion";
import { loadMovepools } from "@/lib/pokemonMoves";
import { useLang, pokemonName } from "@/lib/i18n";
import { POKEMON } from "@/lib/pokemon";
import { Button } from "@/components/ui/button";
import { TypeBadge } from "./TypeBadge";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  AlertTriangle,
  CircleCheck,
  Info,
  Sparkles,
  Zap,
  Shield,
  Swords,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  team: Pokemon[];
}

export function TeamAnalyzer({ team }: Props) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [movepools, setMovepools] = useState<Record<number, string[]> | null>(null);

  // Lazy-load movepools on first expand
  useEffect(() => {
    if (!open || movepools) return;
    loadMovepools().then(setMovepools);
  }, [open, movepools]);

  useEffect(() => {
    if (!open) return;
    setResult(analyzeTeam(team, movepools ?? undefined));
  }, [open, team, movepools]);

  const monById = new Map(POKEMON.map((p) => [p.id, p]));

  return (
    <div className="pt-2 border-t-2 border-border/40">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-full"
        disabled={team.length === 0}
      >
        <BarChart3 className="h-3 w-3" />
        {t("analyzeTeam")}
        {open ? (
          <ChevronUp className="h-3 w-3 ml-auto" />
        ) : (
          <ChevronDown className="h-3 w-3 ml-auto" />
        )}
      </Button>

      {open && result && (
        <div className="mt-3 space-y-3">
          {/* Overall score */}
          <div className="rounded-sm border-2 border-primary/60 bg-primary/10 p-3 text-center">
            <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground">
              {t("overallScore")}
            </div>
            <div
              className={cn(
                "font-pixel text-3xl text-shadow-pixel mt-1",
                result.overallScore >= 75
                  ? "text-emerald-600"
                  : result.overallScore >= 50
                    ? "text-yellow-600"
                    : "text-red-600",
              )}
            >
              {result.overallScore}
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <ScoreBar value={result.overallScore} />
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-2">
            <Metric
              icon={<Zap className="h-3 w-3" />}
              label={t("avgSpeed")}
              value={result.averageSpeed}
              color="text-sky-600"
            />
            <Metric
              icon={<Shield className="h-3 w-3" />}
              label={t("avgBulk")}
              value={result.averageBulk}
              color="text-emerald-600"
            />
            <Metric
              icon={<Swords className="h-3 w-3" />}
              label={t("physicalAttackers")}
              value={result.physicalAttackers}
              color="text-orange-600"
            />
            <Metric
              icon={<Sparkles className="h-3 w-3" />}
              label={t("specialAttackers")}
              value={result.specialAttackers}
              color="text-purple-600"
            />
          </div>

          {/* Coverage */}
          <Section
            title={t("offensiveCov")}
            icon={<Swords className="h-3 w-3" />}
            color="primary"
          >
            <div className="mb-2">
              <div className="text-[9px] font-pixel uppercase text-emerald-600 mb-1">
                {t("covered")} ({result.offensiveCoverage.length}/18)
              </div>
              <div className="flex flex-wrap gap-1">
                {result.offensiveCoverage.map((tp) => (
                  <TypeBadge key={tp} type={tp} size="xs" />
                ))}
              </div>
            </div>
            {result.coverageHoles.length > 0 && (
              <div>
                <div className="text-[9px] font-pixel uppercase text-red-600 mb-1">
                  {t("notCovered")} ({result.coverageHoles.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.coverageHoles.map((tp) => (
                    <TypeBadge key={tp} type={tp} size="xs" />
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Shared weaknesses */}
          {result.sharedWeaknesses.length > 0 && (
            <Section
              title={t("sharedWeak")}
              icon={<AlertTriangle className="h-3 w-3" />}
              color="destructive"
            >
              <div className="space-y-1.5">
                {result.sharedWeaknesses.map((w) => (
                  <div
                    key={w.type}
                    className={cn(
                      "flex items-center gap-2 rounded-sm border-2 px-2 py-1",
                      w.count >= 4
                        ? "border-red-500/60 bg-red-500/10"
                        : w.count >= 3
                          ? "border-orange-500/60 bg-orange-500/10"
                          : "border-yellow-500/50 bg-yellow-500/5",
                    )}
                  >
                    <TypeBadge type={w.type} size="xs" />
                    <span className="font-pixel text-[9px] uppercase text-muted-foreground">
                      {w.count}/{team.length}
                    </span>
                    <div className="flex gap-0.5 ml-auto">
                      {w.mons.map((id) => {
                        const m = monById.get(id);
                        return m ? (
                          <span
                            key={id}
                            title={pokemonName(m, lang)}
                            className="font-mono text-[8px] text-muted-foreground truncate max-w-[60px]"
                          >
                            {pokemonName(m, lang)}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Section
              title={t("suggestions")}
              icon={<Info className="h-3 w-3" />}
              color="accent"
            >
              <div className="space-y-1.5">
                {result.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-2 rounded-sm border-2 px-2 py-1.5",
                      s.severity === "critical"
                        ? "border-red-500/60 bg-red-500/10"
                        : s.severity === "warn"
                          ? "border-orange-500/50 bg-orange-500/5"
                          : "border-border bg-muted/30",
                    )}
                  >
                    {s.severity === "critical" ? (
                      <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5 text-red-600" />
                    ) : s.severity === "warn" ? (
                      <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5 text-orange-600" />
                    ) : (
                      <CircleCheck className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
                    )}
                    <span className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                      {formatSuggestion(s, t, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-sm border-2 border-border bg-card/60 p-2">
      <div className={cn("flex items-center gap-1 text-[9px] font-pixel uppercase tracking-wider", color)}>
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="font-pixel text-lg text-foreground text-shadow-pixel mt-0.5 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  const color =
    value >= 75
      ? "bg-emerald-500"
      : value >= 50
        ? "bg-yellow-500"
        : "bg-red-500";
  return (
    <div className="mt-2 h-1.5 w-full bg-muted/60 rounded-sm overflow-hidden">
      <div className={cn("h-full", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

function Section({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: "primary" | "accent" | "destructive";
  children: React.ReactNode;
}) {
  const titleColor =
    color === "primary"
      ? "text-primary"
      : color === "accent"
        ? "text-accent"
        : "text-destructive";
  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 text-[9px] font-pixel uppercase tracking-wider mb-2",
          titleColor,
        )}
      >
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
