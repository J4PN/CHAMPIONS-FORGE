import { useMemo } from "react";
import type { PokemonStats } from "@/lib/types";
import { useLang } from "@/lib/i18n";

interface Props {
  stats: PokemonStats;
  stats2?: PokemonStats;
  color?: string;
  color2?: string;
  size?: number;
  labels?: boolean;
}

const STAT_KEYS: (keyof PokemonStats)[] = ["hp", "atk", "def", "spa", "spd", "spe"];
const STAT_I18N_KEY: Record<keyof PokemonStats, "statHp" | "statAtk" | "statDef" | "statSpa" | "statSpd" | "statSpe"> = {
  hp: "statHp",
  atk: "statAtk",
  def: "statDef",
  spa: "statSpa",
  spd: "statSpd",
  spe: "statSpe",
};

const MAX_STAT = 200; // typical max for display; stats above are clamped

export function StatRadar({
  stats,
  stats2,
  color = "hsl(var(--primary))",
  color2 = "#2980EF",
  size = 220,
  labels = true,
}: Props) {
  const { t } = useLang();
  const cx = size / 2;
  const cy = size / 2;
  // Leave more room on the sides for labels (~32% of radius)
  const radius = size * 0.33;

  // Hexagon angles — start from top, go clockwise
  const angles = useMemo(
    () => STAT_KEYS.map((_, i) => (Math.PI * 2 * i) / STAT_KEYS.length - Math.PI / 2),
    [],
  );

  const statPoint = (statValue: number, angle: number) => {
    const r = (Math.min(statValue, MAX_STAT) / MAX_STAT) * radius;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };

  const gridPoints = (ratio: number) =>
    angles
      .map((a) => {
        const x = cx + Math.cos(a) * radius * ratio;
        const y = cy + Math.sin(a) * radius * ratio;
        return `${x},${y}`;
      })
      .join(" ");

  const polyPoints = (s: PokemonStats) =>
    STAT_KEYS.map((k, i) => {
      const [x, y] = statPoint(s[k], angles[i]);
      return `${x},${y}`;
    }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background grid: 4 concentric hexagons */}
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <polygon
          key={r}
          points={gridPoints(r)}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray={r < 1 ? "2 2" : undefined}
        />
      ))}
      {/* Radial lines */}
      {angles.map((a, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(a) * radius}
          y2={cy + Math.sin(a) * radius}
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
      ))}

      {/* Stats 2 (underneath) */}
      {stats2 && (
        <polygon
          points={polyPoints(stats2)}
          fill={color2}
          fillOpacity="0.25"
          stroke={color2}
          strokeWidth="2"
        />
      )}

      {/* Stats 1 (on top) */}
      <polygon
        points={polyPoints(stats)}
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="2"
      />

      {/* Stat points (dots) for stats 1 */}
      {STAT_KEYS.map((k, i) => {
        const [x, y] = statPoint(stats[k], angles[i]);
        return <circle key={k} cx={x} cy={y} r="3" fill={color} />;
      })}

      {/* Stat points for stats 2 */}
      {stats2 &&
        STAT_KEYS.map((k, i) => {
          const [x, y] = statPoint(stats2[k], angles[i]);
          return <circle key={k + "2"} cx={x} cy={y} r="3" fill={color2} />;
        })}

      {/* Labels */}
      {labels &&
        angles.map((a, i) => {
          const key = STAT_KEYS[i];
          const labelR = radius + 26;
          const lx = cx + Math.cos(a) * labelR;
          const ly = cy + Math.sin(a) * labelR;
          const value1 = stats[key];
          const value2 = stats2?.[key];
          return (
            <g key={key}>
              <text
                x={lx}
                y={ly - 5}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-pixel fill-muted-foreground"
                fontSize="8"
              >
                {t(STAT_I18N_KEY[key])}
              </text>
              <text
                x={lx}
                y={ly + 7}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-pixel"
                fontSize="9"
                fill={color}
              >
                {value1}
                {value2 !== undefined && (
                  <tspan fill={color2}>
                    {" / "}
                    {value2}
                  </tspan>
                )}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
