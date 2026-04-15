import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SavedTeam } from "@/lib/savedTeams";
import { POKEMON, spriteUrl } from "@/lib/pokemon";
import { useLang } from "@/lib/i18n";
import { META_TEAMS } from "@/lib/metaTeams";
import { cn } from "@/lib/utils";
import { Save, Trash2, Upload, Bookmark, Sparkles } from "lucide-react";

interface Props {
  currentTeamIds: number[];
  savedTeams: SavedTeam[];
  onSave: (name: string) => void;
  onLoad: (team: SavedTeam) => void;
  onDelete: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onLoadTemplate: (ids: number[]) => void;
  activeTeamId?: string | null;
}

export function SavedTeamsPanel({
  currentTeamIds,
  savedTeams,
  onSave,
  onLoad,
  onDelete,
  onUpdateNotes,
  onLoadTemplate,
  activeTeamId,
}: Props) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);

  const canSave = name.trim().length > 0 && currentTeamIds.length > 0;

  const monById = new Map(POKEMON.map((p) => [p.id, p]));

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onSave(name.trim());
    setName("");
  }

  return (
    <div className="space-y-3 pt-2 border-t-2 border-border/40">
      <div className="flex items-center gap-2 text-[9px] font-pixel uppercase text-muted-foreground tracking-wider">
        <Bookmark className="h-3 w-3" />
        {t("savedTeams")}
        <span className="ml-auto text-muted-foreground/70">
          {savedTeams.length}
        </span>
      </div>

      <form onSubmit={handleSave} className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("teamNamePlaceholder")}
          className="h-9 text-xs"
          maxLength={40}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!canSave}
          className="shrink-0"
        >
          <Save className="h-3 w-3" />
          {t("saveTeam")}
        </Button>
      </form>

      {/* Templates toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowTemplates((v) => !v)}
          className="w-full flex items-center gap-2 text-[9px] font-pixel uppercase tracking-wider text-accent hover:text-foreground transition-colors"
        >
          <Sparkles className="h-3 w-3" />
          {t("templates")} ({META_TEAMS.length})
        </button>
        {showTemplates && (
          <div className="mt-2 space-y-1.5 max-h-[180px] overflow-auto pr-1">
            {META_TEAMS.map((tpl) => {
              const mons = tpl.pokemonIds
                .map((id) => monById.get(id))
                .filter((p): p is NonNullable<typeof p> => !!p);
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    onLoadTemplate(tpl.pokemonIds);
                    setShowTemplates(false);
                  }}
                  className="w-full text-left rounded-sm border-2 border-accent/40 bg-accent/5 hover:bg-accent/15 p-2 transition-colors"
                >
                  <div className="font-pixel text-[10px] uppercase tracking-wider text-accent">
                    {tpl.name}
                  </div>
                  <div className="text-[9px] text-muted-foreground font-mono mt-0.5 truncate">
                    {tpl.description}
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {mons.slice(0, 6).map((m) => (
                      <img
                        key={m.id}
                        src={spriteUrl(m)}
                        alt={m.names.en ?? ""}
                        className="pixelated h-6 w-6"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {savedTeams.length === 0 ? (
        <div className="text-[9px] font-pixel uppercase tracking-wider text-muted-foreground/60 text-center py-3">
          {t("noSavedTeams")}
        </div>
      ) : (
        <div className="space-y-2 max-h-[280px] overflow-auto pr-1">
          {savedTeams.map((team) => {
            const mons = team.pokemonIds
              .map((id) => monById.get(id))
              .filter((p): p is NonNullable<typeof p> => !!p);
            const isActive = team.id === activeTeamId;
            return (
              <div
                key={team.id}
                className={cn(
                  "group rounded-sm border-2 p-2 transition-colors",
                  isActive
                    ? "border-primary/70 bg-primary/10"
                    : "border-border/60 bg-card/40 hover:bg-card/70",
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "font-pixel text-[10px] uppercase tracking-wider truncate text-shadow-pixel",
                        isActive && "text-primary",
                      )}
                    >
                      {team.name}
                    </div>
                    <div className="flex items-center gap-0.5 mt-1 flex-wrap">
                      {mons.slice(0, 6).map((m) => (
                        <img
                          key={m.id}
                          src={spriteUrl(m)}
                          alt={m.names.en ?? ""}
                          className="pixelated h-6 w-6 sm:h-7 sm:w-7"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant={isActive ? "secondary" : "outline"}
                      onClick={() => onLoad(team)}
                      className="h-7 w-7 sm:w-auto px-0 sm:px-2 text-[8px]"
                      title={t("loadTeam")}
                    >
                      <Upload className="h-3 w-3" />
                      <span className="hidden sm:inline">{t("loadTeam")}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(t("confirmDeleteTeam"))) onDelete(team.id);
                      }}
                      className="h-7 w-7 px-0 text-[8px] hover:border-destructive hover:text-destructive"
                      title={t("deleteTeam")}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {/* Notes editor */}
                {(editingNotesId === team.id || team.notes) && (
                  <div className="mt-2">
                    <textarea
                      value={team.notes ?? ""}
                      onChange={(e) => onUpdateNotes(team.id, e.target.value)}
                      onFocus={() => setEditingNotesId(team.id)}
                      onBlur={() => setEditingNotesId(null)}
                      placeholder={t("notesPlaceholder")}
                      rows={2}
                      className="w-full rounded-sm border-2 border-border bg-input/40 px-2 py-1 text-[10px] font-mono focus:outline-none focus:border-primary resize-y"
                    />
                  </div>
                )}
                {!team.notes && editingNotesId !== team.id && (
                  <button
                    type="button"
                    onClick={() => setEditingNotesId(team.id)}
                    className="mt-1 text-[8px] font-pixel uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    + {t("notesPlaceholder")}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
