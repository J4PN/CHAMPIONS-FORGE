import { useState, Fragment } from "react";
import { useLang } from "@/lib/i18n";
import { LEARN_SECTIONS, type IconKey } from "@/lib/learnContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Cloud,
  Sparkles,
  Zap,
  Shield,
  Swords,
  Clock,
  Layers,
  Sun,
  CloudRain,
  Wind,
  Snowflake,
  Leaf,
  CloudFog,
  Flame,
  Moon,
  Droplet,
  Skull,
  Target,
  FlaskConical,
  TrendingDown,
  Trophy,
  RefreshCw,
  Bomb,
  Star,
  CloudSun,
} from "lucide-react";

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Clock,
  Cloud,
  Layers,
  Sparkles,
  Zap,
  Shield,
  Swords,
  Sun,
  CloudRain,
  Wind,
  Snowflake,
  Leaf,
  CloudFog,
  Flame,
  Moon,
  Droplet,
  Skull,
  Target,
  FlaskConical,
  TrendingDown,
  Trophy,
  RefreshCw,
  Bomb,
  Star,
  CloudSun,
};

/**
 * Render a markdown-lite string supporting:
 *   **bold**      → <strong>
 *   [icon:Name]   → <Inline Icon={ICONS.Name}/>
 */
function renderInline(text: string): React.ReactNode[] {
  // Tokenize into alternating text / bold / icon parts
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[icon:[A-Za-z]+\])/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIdx) {
      out.push(
        <Fragment key={key++}>{text.slice(lastIdx, match.index)}</Fragment>,
      );
    }
    const token = match[0];
    if (token.startsWith("**")) {
      out.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("[icon:")) {
      const iconName = token.slice(6, -1) as IconKey;
      const Icon = ICONS[iconName];
      if (Icon) {
        out.push(
          <Icon
            key={key++}
            className="inline h-3 w-3 mx-0.5 align-text-bottom"
          />,
        );
      }
    }
    lastIdx = match.index + token.length;
  }
  if (lastIdx < text.length) {
    out.push(<Fragment key={key++}>{text.slice(lastIdx)}</Fragment>);
  }
  return out;
}

export function LearnPage() {
  const { lang, t } = useLang();
  const [openId, setOpenId] = useState<string>(LEARN_SECTIONS[0].id);

  return (
    <main className="container py-4 sm:py-8 max-w-4xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            {t("learnTitle")}
          </h1>
        </div>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-3">
          {t("learnSubtitle")}
        </p>
      </header>

      <div className="space-y-2">
        {LEARN_SECTIONS.map((s) => {
          const open = openId === s.id;
          const Icon = ICONS[s.icon];
          const title = s.title[lang] ?? s.title.en;
          return (
            <Card
              key={s.id}
              className={cn("transition-all", open && "border-primary/60")}
            >
              <CardHeader
                onClick={() => setOpenId(open ? "" : s.id)}
                className="cursor-pointer select-none hover:bg-accent/5 transition-colors"
              >
                <CardTitle className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  {title}
                  <span className="ml-auto text-muted-foreground text-xs">
                    {open ? "−" : "+"}
                  </span>
                </CardTitle>
              </CardHeader>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground leading-relaxed font-mono break-words">
                      {s.content.kind === "bullets" && (
                        <ul className="space-y-2">
                          {(s.content.items[lang] ?? s.content.items.en).map(
                            (bullet, i) => (
                              <li key={i}>{renderInline(bullet)}</li>
                            ),
                          )}
                        </ul>
                      )}
                      {s.content.kind === "paragraph" && (
                        <p>
                          {renderInline(s.content.text[lang] ?? s.content.text.en)}
                        </p>
                      )}
                      {s.content.kind === "moveGroups" && (
                        <div className="space-y-3">
                          {(s.content.groups[lang] ?? s.content.groups.en).map(
                            (g, gi) => {
                              const GIcon = ICONS[g.icon];
                              return (
                                <div key={gi}>
                                  <div className="font-pixel text-[10px] uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                                    {GIcon && <GIcon className="h-3 w-3" />}
                                    {g.title}
                                  </div>
                                  <ul className="space-y-1.5">
                                    {g.moves.map((m) => (
                                      <li
                                        key={m.name}
                                        className="rounded-sm border-2 border-border/60 bg-muted/20 p-2"
                                      >
                                        <div className="font-pixel text-[9px] uppercase tracking-wider text-foreground text-shadow-pixel">
                                          {m.name}
                                        </div>
                                        <div className="text-[11px] text-muted-foreground font-mono mt-1 leading-relaxed">
                                          {m.body}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
