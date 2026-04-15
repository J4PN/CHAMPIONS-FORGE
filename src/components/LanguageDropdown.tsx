import { useEffect, useRef, useState } from "react";
import { Lang, LANG_META, SUPPORTED_LANGS, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { Flag } from "./Flag";

export function LanguageDropdown() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANG_META[lang];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors font-pixel text-[10px] uppercase tracking-wider shadow-soft"
      >
        <Flag lang={lang} />
        <span>{current.flag}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 z-[200] mt-2 w-60 max-w-[calc(100vw-1rem)] max-h-[70vh] overflow-auto rounded-xl border border-border shadow-soft-lg"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {SUPPORTED_LANGS.map((l: Lang) => {
            const active = l === lang;
            const meta = LANG_META[l];
            return (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors border-b border-border/40 last:border-b-0",
                  active
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-accent/20",
                )}
              >
                <Flag lang={l} className="h-4 w-6" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono truncate">
                    {meta.native}
                  </div>
                  <div className="text-[9px] text-muted-foreground truncate">
                    {meta.label}
                  </div>
                </div>
                {active && <Check className="h-3 w-3 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
