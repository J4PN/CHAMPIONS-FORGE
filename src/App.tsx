import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pokemon } from "@/lib/types";
import { POKEMON } from "@/lib/pokemon";
import { PokemonSearch } from "@/components/PokemonSearch";
import { TeamSlot } from "@/components/TeamSlot";
import { BestPicks, BattleFormat, BRING_COUNT } from "@/components/BestPicks";
import { FormatToggle } from "@/components/FormatToggle";
import { TypeCoverageGrid } from "@/components/TypeCoverageGrid";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SavedTeamsPanel } from "@/components/SavedTeamsPanel";
import { SeasonBanner } from "@/components/SeasonBanner";
import { SeoFooter } from "@/components/SeoFooter";
import { ScrollToTop } from "@/components/ScrollToTop";
import { BuildSlot } from "@/lib/types";

// Lazy-loaded views — keep moves.json + heavy components out of the initial bundle
const AboutPage = lazy(() =>
  import("@/components/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const PokedexPage = lazy(() =>
  import("@/components/PokedexPage").then((m) => ({ default: m.PokedexPage })),
);
const ComparePage = lazy(() =>
  import("@/components/ComparePage").then((m) => ({ default: m.ComparePage })),
);
const TypeChartPage = lazy(() =>
  import("@/components/TypeChartPage").then((m) => ({ default: m.TypeChartPage })),
);
const LearnPage = lazy(() =>
  import("@/components/LearnPage").then((m) => ({ default: m.LearnPage })),
);
const BattleSimPage = lazy(() =>
  import("@/components/BattleSimPage").then((m) => ({ default: m.BattleSimPage })),
);
const LegalPage = lazy(() =>
  import("@/components/LegalPage").then((m) => ({ default: m.LegalPage })),
);
const PokemonLandingPage = lazy(() =>
  import("@/components/PokemonLandingPage").then((m) => ({ default: m.PokemonLandingPage })),
);
const TypeLandingPage = lazy(() =>
  import("@/components/TypeLandingPage").then((m) => ({ default: m.TypeLandingPage })),
);
const AdvancedTeamBuilder = lazy(() =>
  import("@/components/AdvancedTeamBuilder").then((m) => ({
    default: m.AdvancedTeamBuilder,
  })),
);
const TeamAnalyzer = lazy(() =>
  import("@/components/TeamAnalyzer").then((m) => ({ default: m.TeamAnalyzer })),
);
const RankingsPage = lazy(() =>
  import("@/components/RankingsPage").then((m) => ({ default: m.RankingsPage })),
);
const TierListPage = lazy(() =>
  import("@/components/TierListPage").then((m) => ({ default: m.TierListPage })),
);
const SpeedTiersPage = lazy(() =>
  import("@/components/SpeedTiersPage").then((m) => ({ default: m.SpeedTiersPage })),
);
const ShareCardModal = lazy(() =>
  import("@/components/ShareCardModal").then((m) => ({ default: m.ShareCardModal })),
);
import { Info, Home as HomeIcon, BookOpen, Settings, Zap, Scale, Grid3x3, GraduationCap, Trophy, ListOrdered, Gauge } from "lucide-react";
import {
  loadSavedTeams,
  writeSavedTeams,
  newTeamId,
  SavedTeam,
} from "@/lib/savedTeams";
import { Button } from "@/components/ui/button";
import { Share2, Check, RotateCcw, Swords, Image as ImageIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { useTeamTracking } from "@/lib/useTeamTracking";

const MAX_TEAM = 6;
const STORAGE_KEY = "pokecounter.myteam.v1";
const FORMAT_KEY = "pokecounter.format.v1";

function idsFromUrl(): number[] {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("opp");
  if (!raw) return [];
  return raw
    .split(",")
    .map((x) => parseInt(x, 10))
    .filter((n) => Number.isFinite(n));
}

function loadMyTeam(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((n) => typeof n === "number");
  } catch {
    return [];
  }
}

function toPokemon(ids: number[]): Pokemon[] {
  const map = new Map(POKEMON.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter((p): p is Pokemon => !!p);
}

export default function App() {
  const { t } = useLang();
  const [opponentIds, setOpponentIds] = useState<number[]>(() => idsFromUrl());
  const [myTeamIds, setMyTeamIds] = useState<number[]>(() => loadMyTeam());
  const [format, setFormat] = useState<BattleFormat>(() => {
    const raw = localStorage.getItem(FORMAT_KEY);
    return raw === "2v2" ? "2v2" : "1v1";
  });
  const [copied, setCopied] = useState(false);
  const [shareCardOpen, setShareCardOpen] = useState(false);
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>(() =>
    loadSavedTeams(),
  );
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [advancedMode, setAdvancedMode] = useState<boolean>(() => {
    return localStorage.getItem("pokecounter.advanced.v1") === "1";
  });
  const [advancedSlots, setAdvancedSlots] = useState<BuildSlot[]>(() => {
    try {
      const raw = localStorage.getItem("pokecounter.advanced.slots.v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pokecounter.advanced.v1", advancedMode ? "1" : "0");
  }, [advancedMode]);
  useEffect(() => {
    localStorage.setItem(
      "pokecounter.advanced.slots.v1",
      JSON.stringify(advancedSlots),
    );
  }, [advancedSlots]);

  // Bidirectional sync between the Simple (ids only) and Advanced (full
  // BuildSlots) representations of the team — whichever mode the user
  // is in, the other stays consistent and the full configs are preserved.
  useEffect(() => {
    if (advancedMode) {
      // Advanced → Simple: just project down to ids
      const ids = advancedSlots.map((s) => s.pokemonId);
      // Avoid needless re-renders when nothing actually changed
      setMyTeamIds((prev) =>
        prev.length === ids.length && prev.every((v, i) => v === ids[i])
          ? prev
          : ids,
      );
    } else {
      // Simple → Advanced: preserve existing slot configs for ids that stay,
      // and create a default BuildSlot for any new id added in simple mode
      const sameLength = advancedSlots.length === myTeamIds.length;
      const sameIds =
        sameLength && advancedSlots.every((s, i) => s.pokemonId === myTeamIds[i]);
      if (sameIds) return;
      const nextSlots = myTeamIds.map((id) => {
        const existing = advancedSlots.find((s) => s.pokemonId === id);
        if (existing) return existing;
        const mon = POKEMON.find((p) => p.id === id);
        return {
          pokemonId: id,
          ability: mon?.abilities?.[0]?.names.en,
          moves: [],
          sp: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
          nature: "Hardy",
        } satisfies BuildSlot;
      });
      setAdvancedSlots(nextSlots);
    }
  }, [advancedMode, advancedSlots, myTeamIds]);
  type View =
    | "home"
    | "about"
    | "pokedex"
    | "compare"
    | "types"
    | "learn"
    | "battle"
    | "rankings"
    | "tiers"
    | "speed"
    | "legal"
    | "pokemon"
    | "type";

  const location = useLocation();
  const navigate = useNavigate();

  const view: View = useMemo(() => {
    const p = location.pathname;
    if (p === "/" || p === "") return "home";
    if (p.startsWith("/pokedex")) return "pokedex";
    if (p.startsWith("/compare")) return "compare";
    if (p.startsWith("/types-chart")) return "types";
    if (p.startsWith("/learn")) return "learn";
    if (p.startsWith("/battle")) return "battle";
    if (p.startsWith("/rankings")) return "rankings";
    if (p.startsWith("/tiers")) return "tiers";
    if (p.startsWith("/speed")) return "speed";
    if (p.startsWith("/legal")) return "legal";
    if (p.startsWith("/about")) return "about";
    if (p.startsWith("/pokemon/")) return "pokemon";
    if (p.startsWith("/type/")) return "type";
    return "home";
  }, [location.pathname]);

  useDocumentTitle(view);

  const goAbout = useCallback(() => navigate("/about"), [navigate]);
  const goPokedex = useCallback(() => navigate("/pokedex"), [navigate]);
  const goCompare = useCallback(() => navigate("/compare"), [navigate]);
  const goTypes = useCallback(() => navigate("/types-chart"), [navigate]);
  const goLearn = useCallback(() => navigate("/learn"), [navigate]);
  const goBattle = useCallback(() => navigate("/battle"), [navigate]);
  const goRankings = useCallback(() => navigate("/rankings"), [navigate]);
  const goTiers = useCallback(() => navigate("/tiers"), [navigate]);
  const goSpeed = useCallback(() => navigate("/speed"), [navigate]);
  const goLegal = useCallback(() => navigate("/legal"), [navigate]);
  const goHome = useCallback(() => navigate("/"), [navigate]);

  useEffect(() => {
    localStorage.setItem(FORMAT_KEY, format);
  }, [format]);

  // Auto-save my team on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myTeamIds));
    } catch {
      /* noop */
    }
  }, [myTeamIds]);

  const opponents = useMemo(() => toPokemon(opponentIds), [opponentIds]);
  const myTeam = useMemo(() => toPokemon(myTeamIds), [myTeamIds]);

  useTeamTracking(myTeamIds, { withEngagement: true });
  useTeamTracking(opponentIds);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (opponentIds.length > 0) {
      url.searchParams.set("opp", opponentIds.join(","));
    } else {
      url.searchParams.delete("opp");
    }
    window.history.replaceState({}, "", url.toString());
  }, [opponentIds]);

  const addOpponent = useCallback((p: Pokemon) => {
    setOpponentIds((prev) =>
      prev.length >= MAX_TEAM || prev.includes(p.id) ? prev : [...prev, p.id],
    );
  }, []);

  const removeOpponent = useCallback((id: number) => {
    setOpponentIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const addMine = useCallback((p: Pokemon) => {
    setMyTeamIds((prev) =>
      prev.length >= MAX_TEAM || prev.includes(p.id) ? prev : [...prev, p.id],
    );
  }, []);

  const removeMine = useCallback((id: number) => {
    setMyTeamIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const resetMyTeam = useCallback(() => {
    setMyTeamIds([]);
    setActiveTeamId(null);
  }, []);

  const saveCurrentAs = useCallback(
    (name: string) => {
      const team: SavedTeam = {
        id: newTeamId(),
        name,
        pokemonIds: myTeamIds,
        createdAt: Date.now(),
      };
      const next = [team, ...savedTeams];
      setSavedTeams(next);
      writeSavedTeams(next);
      setActiveTeamId(team.id);
    },
    [myTeamIds, savedTeams],
  );

  const loadTeam = useCallback((team: SavedTeam) => {
    setMyTeamIds(team.pokemonIds);
    setActiveTeamId(team.id);
  }, []);

  const deleteTeam = useCallback(
    (id: string) => {
      const next = savedTeams.filter((t) => t.id !== id);
      setSavedTeams(next);
      writeSavedTeams(next);
      if (activeTeamId === id) setActiveTeamId(null);
    },
    [savedTeams, activeTeamId],
  );

  const updateTeamNotes = useCallback(
    (id: string, notes: string) => {
      const next = savedTeams.map((t) =>
        t.id === id ? { ...t, notes } : t,
      );
      setSavedTeams(next);
      writeSavedTeams(next);
    },
    [savedTeams],
  );

  const loadTemplate = useCallback((ids: number[]) => {
    setMyTeamIds(ids);
    setActiveTeamId(null);
  }, []);

  const resetOpponents = useCallback(() => {
    setOpponentIds([]);
  }, []);

  const shareUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      {/* Header */}
      <header className="sticky top-0 z-[100] border-b border-border bg-background/90 backdrop-blur">
        <div className="container py-3 sm:py-4 flex flex-col gap-3">
          {/* Top row: logo + title (left) + share/language (right) */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <button
              type="button"
              onClick={goHome}
              className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity"
            >
              <img
                src="/pokeball.svg"
                alt=""
                className="pixelated h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-md shadow-soft"
              />
              <div className="min-w-0 text-left">
                <h1 className="font-pixel text-sm sm:text-xl text-primary text-shadow-pixel truncate">
                  POKECOUNTER
                </h1>
                <p className="text-[7px] sm:text-[9px] text-muted-foreground font-pixel uppercase tracking-widest mt-0.5 truncate hidden sm:block">
                  for Pokemon Champions
                </p>
              </div>
            </button>
            <div className="flex items-center gap-1.5 shrink-0">
              {view === "home" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareUrl}
                  disabled={opponentIds.length === 0}
                  className="hidden sm:inline-flex"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" /> {t("copied")}
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3 w-3" /> {t("share")}
                    </>
                  )}
                </Button>
              )}
              <ThemeToggle />
              <LanguageDropdown />
            </div>
          </div>

          {/* Bottom row: nav, always below the logo */}
          <nav className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-start sm:justify-center">
            <NavButton active={view === "home"} onClick={goHome} icon={<HomeIcon className="h-3 w-3" />} label={t("navHome")} />
            <NavButton active={view === "pokedex"} onClick={goPokedex} icon={<BookOpen className="h-3 w-3" />} label={t("navPokedex")} />
            <NavButton active={view === "types"} onClick={goTypes} icon={<Grid3x3 className="h-3 w-3" />} label={t("navTypes")} />
            <NavButton active={view === "compare"} onClick={goCompare} icon={<Scale className="h-3 w-3" />} label={t("navCompare")} />
            <NavButton active={view === "battle"} onClick={goBattle} icon={<Swords className="h-3 w-3" />} label={t("navSimulator")} />
            <NavButton active={view === "rankings"} onClick={goRankings} icon={<Trophy className="h-3 w-3" />} label={t("navRankings")} />
            <NavButton active={view === "tiers"} onClick={goTiers} icon={<ListOrdered className="h-3 w-3" />} label={t("navTierList")} />
            <NavButton active={view === "speed"} onClick={goSpeed} icon={<Gauge className="h-3 w-3" />} label={t("navSpeed")} />
            <NavButton active={view === "learn"} onClick={goLearn} icon={<GraduationCap className="h-3 w-3" />} label={t("navLearn")} />
            <NavButton active={view === "about"} onClick={goAbout} icon={<Info className="h-3 w-3" />} label={t("navAbout")} />
          </nav>
        </div>
      </header>

      {view === "about" && (
        <Suspense fallback={<LazyFallback />}>
          <AboutPage onBack={goHome} />
        </Suspense>
      )}
      {view === "pokedex" && (
        <Suspense fallback={<LazyFallback />}>
          <PokedexPage />
        </Suspense>
      )}
      {view === "compare" && (
        <Suspense fallback={<LazyFallback />}>
          <ComparePage />
        </Suspense>
      )}
      {view === "types" && (
        <Suspense fallback={<LazyFallback />}>
          <TypeChartPage />
        </Suspense>
      )}
      {view === "learn" && (
        <Suspense fallback={<LazyFallback />}>
          <LearnPage />
        </Suspense>
      )}
      {view === "battle" && (
        <Suspense fallback={<LazyFallback />}>
          <BattleSimPage />
        </Suspense>
      )}
      {view === "rankings" && (
        <Suspense fallback={<LazyFallback />}>
          <RankingsPage
            onUseTeam={(ids) => {
              loadTemplate(ids);
              navigate("/");
            }}
          />
        </Suspense>
      )}
      {view === "tiers" && (
        <Suspense fallback={<LazyFallback />}>
          <TierListPage />
        </Suspense>
      )}
      {view === "speed" && (
        <Suspense fallback={<LazyFallback />}>
          <SpeedTiersPage />
        </Suspense>
      )}
      {view === "legal" && (
        <Suspense fallback={<LazyFallback />}>
          <LegalPage />
        </Suspense>
      )}
      {view === "pokemon" && (
        <Suspense fallback={<LazyFallback />}>
          <PokemonLandingPage />
        </Suspense>
      )}
      {view === "type" && (
        <Suspense fallback={<LazyFallback />}>
          <TypeLandingPage />
        </Suspense>
      )}
      {view === "home" && (
      <>
      <div className="container pt-4 sm:pt-8">
        <SeasonBanner />
      </div>
      <main className="container py-6 sm:py-10 grid gap-10 sm:gap-12 items-start lg:grid-cols-[1fr_1fr_1.1fr]">
        {/* 01 — Opponent team */}
        <section>
          <div className="flex items-center gap-3 mb-1 min-h-[36px]">
            <span className="font-pixel text-2xl text-primary tabular-nums">01</span>
            <h2 className="font-pixel text-base uppercase tracking-wider text-foreground">
              {t("opponentTeam")}
            </h2>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono tabular-nums">
              {opponents.length}/{MAX_TEAM}
            </span>
            {opponents.length > 0 && (
              <button
                type="button"
                onClick={resetOpponents}
                className="font-pixel text-[9px] uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                title={t("reset")}
              >
                ↺
              </button>
            )}
          </div>
          <div className="h-[3px] bg-foreground mb-4" />
          <div className="space-y-4">
            <PokemonSearch
              onSelect={addOpponent}
              excludeIds={opponentIds}
              disabled={opponentIds.length >= MAX_TEAM}
              placeholder={t("searchOpponent")}
            />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: MAX_TEAM }).map((_, i) => (
                <TeamSlot
                  key={i}
                  pokemon={opponents[i]}
                  onRemove={
                    opponents[i]
                      ? () => removeOpponent(opponents[i].id)
                      : undefined
                  }
                  accent="opponent"
                />
              ))}
            </div>
          </div>
        </section>

        {/* 02 — My team */}
        <section>
          <div className="flex items-center gap-3 mb-1 min-h-[36px]">
            <span className="font-pixel text-2xl text-primary tabular-nums">02</span>
            <h2 className="font-pixel text-base uppercase tracking-wider text-foreground">
              {t("myTeam")}
            </h2>
            <div className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-muted/60 p-0.5">
              <button
                type="button"
                onClick={() => setAdvancedMode(false)}
                className={`flex items-center gap-1 rounded-md px-1.5 py-1 transition-all ${!advancedMode ? "bg-primary text-primary-foreground shadow-soft-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Zap className="h-2.5 w-2.5" />
                <span className="font-pixel text-[7px] uppercase tracking-wider hidden sm:inline">Simple</span>
              </button>
              <button
                type="button"
                onClick={() => setAdvancedMode(true)}
                className={`flex items-center gap-1 rounded-md px-1.5 py-1 transition-all ${advancedMode ? "bg-primary text-primary-foreground shadow-soft-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Settings className="h-2.5 w-2.5" />
                <span className="font-pixel text-[7px] uppercase tracking-wider hidden sm:inline">Advanced</span>
              </button>
            </div>
          </div>
          <div className="h-[3px] bg-foreground mb-4" />
          <div className="space-y-4">

            {!advancedMode && (
              <>
                <PokemonSearch
                  onSelect={addMine}
                  excludeIds={myTeamIds}
                  disabled={myTeamIds.length >= MAX_TEAM}
                  placeholder={t("searchMine")}
                />
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: MAX_TEAM }).map((_, i) => (
                    <TeamSlot
                      key={i}
                      pokemon={myTeam[i]}
                      onRemove={
                        myTeam[i] ? () => removeMine(myTeam[i].id) : undefined
                      }
                      accent="me"
                    />
                  ))}
                </div>
              </>
            )}

            {advancedMode && (
              <Suspense fallback={<LazyFallback />}>
                <AdvancedTeamBuilder
                  slots={advancedSlots}
                  onChange={setAdvancedSlots}
                  maxSlots={MAX_TEAM}
                  externalTargets={opponentIds}
                />
              </Suspense>
            )}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1 text-[8px] font-pixel uppercase tracking-wider text-muted-foreground">
                <Check className="h-3 w-3 text-primary" />
                {t("autoSaved")}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShareCardOpen(true)}
                disabled={myTeamIds.length !== MAX_TEAM}
                title={t("shareCardButton")}
              >
                <ImageIcon className="h-3 w-3" /> {t("shareCardButton")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={resetMyTeam}
                disabled={myTeamIds.length === 0}
              >
                <RotateCcw className="h-3 w-3" /> {t("reset")}
              </Button>
            </div>
            {myTeam.length > 0 && (
              <div className="space-y-2 pt-2 border-t-2 border-border/40">
                <div className="text-[9px] font-pixel uppercase text-muted-foreground tracking-wider">
                  {t("offensiveCoverage")}
                </div>
                <TypeCoverageGrid myTeam={myTeam} />
              </div>
            )}
            <SavedTeamsPanel
              currentTeamIds={myTeamIds}
              savedTeams={savedTeams}
              onSave={saveCurrentAs}
              onLoad={loadTeam}
              onDelete={deleteTeam}
              onUpdateNotes={updateTeamNotes}
              onLoadTemplate={loadTemplate}
              activeTeamId={activeTeamId}
            />
            {myTeam.length > 0 && (
              <Suspense fallback={<LazyFallback />}>
                <TeamAnalyzer team={myTeam} />
              </Suspense>
            )}
          </div>
        </section>

        {/* 03 — Best picks */}
        <section>
          <div className="flex items-center gap-3 mb-1 min-h-[36px]">
            <span className="font-pixel text-2xl text-primary tabular-nums">03</span>
            <h2 className="font-pixel text-base uppercase tracking-wider text-foreground">
              {t("bestPicks")}
            </h2>
            <span className="ml-auto text-[10px] text-muted-foreground font-mono lowercase">
              {t("bring")} {BRING_COUNT[format]}/{MAX_TEAM}
            </span>
          </div>
          <div className="h-[3px] bg-foreground mb-4" />
          <div className="space-y-3">
            <FormatToggle value={format} onChange={setFormat} />
            <BestPicks
              opponents={opponents}
              myTeam={myTeam}
              format={format}
            />
          </div>
        </section>
      </main>
      </>
      )}

      <SeoFooter onGoLegal={goLegal} />

      {shareCardOpen && myTeam.length === MAX_TEAM && (
        <Suspense fallback={null}>
          <ShareCardModal team={myTeam} onClose={() => setShareCardOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}

function LazyFallback() {
  return (
    <div className="container py-12 text-center">
      <div className="inline-block h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "inline-flex items-center gap-1.5 h-9 px-2 sm:px-3 rounded-lg border border-primary/30 bg-primary text-primary-foreground font-pixel text-[10px] uppercase tracking-wider shadow-soft-primary"
          : "inline-flex items-center gap-1.5 h-9 px-2 sm:px-3 rounded-lg border border-border bg-card hover:bg-muted hover:scale-105 text-foreground font-pixel text-[10px] uppercase tracking-wider transition-all shadow-soft"
      }
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
