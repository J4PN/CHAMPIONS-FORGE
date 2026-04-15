import { useEffect, useState } from "react";
import { Download, Loader2, X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { generateShareCard, type CardFormat } from "@/lib/shareCard";
import type { Pokemon } from "@/lib/types";

interface Props {
  team: Pokemon[];
  onClose: () => void;
}

export function ShareCardModal({ team, onClose }: Props) {
  const { t, lang } = useLang();
  const [format, setFormat] = useState<CardFormat>("og");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBlob(null);
    setUrl(null);
    setError(null);
    generateShareCard({
      team,
      title: t("shareCardTitle"),
      subtitle: t("shareCardSubtitle"),
      lang,
      format,
    })
      .then((b) => {
        if (cancelled) return;
        if (!b) {
          setError(t("shareCardError"));
          return;
        }
        setBlob(b);
        setUrl(URL.createObjectURL(b));
      })
      .catch(() => {
        if (!cancelled) setError(t("shareCardError"));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team, format, lang]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const download = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `pokecounter-team-${format}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const tryNativeShare = async () => {
    if (!blob) return;
    if (!(navigator as any).canShare) {
      download();
      return;
    }
    try {
      const file = new File([blob], `pokecounter-team-${format}.png`, {
        type: "image/png",
      });
      if ((navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({
          files: [file],
          title: t("shareCardTitle"),
          text: t("shareCardSubtitle"),
        });
        return;
      }
    } catch {
      /* user cancelled or not supported */
    }
    download();
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-background/90 backdrop-blur flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full rounded-xl border-2 border-border bg-card shadow-soft-lg p-4 sm:p-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-3 -right-3 h-8 w-8 rounded-full border border-border bg-card hover:bg-muted shadow-soft flex items-center justify-center"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="font-pixel text-sm sm:text-base uppercase tracking-wider text-primary text-shadow-pixel mb-1">
          {t("shareCardTitle")}
        </h2>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mb-4">
          {t("shareCardSubtitle")}
        </p>

        {/* Format toggle */}
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/60 p-1 mb-4">
          <FormatTab
            active={format === "og"}
            onClick={() => setFormat("og")}
            label={t("shareCardFormatOg")}
            sublabel="1200×630"
          />
          <FormatTab
            active={format === "square"}
            onClick={() => setFormat("square")}
            label={t("shareCardFormatSquare")}
            sublabel="1080×1080"
          />
        </div>

        <div
          className={
            "rounded-lg overflow-hidden border border-border bg-muted/30 mb-4 flex items-center justify-center " +
            (format === "og" ? "aspect-[1200/630]" : "aspect-square max-w-sm mx-auto")
          }
        >
          {error ? (
            <div className="text-xs text-destructive font-mono p-4">
              {error}
            </div>
          ) : url ? (
            <img src={url} alt="Share card preview" className="w-full h-auto" />
          ) : (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={download} disabled={!blob}>
            <Download className="h-3 w-3" />
            {t("shareCardDownload")}
          </Button>
          <Button size="sm" onClick={tryNativeShare} disabled={!blob}>
            <Share2 className="h-3 w-3" />
            {t("shareCardShare")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FormatTab({
  active,
  onClick,
  label,
  sublabel,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-lg px-2 py-2 transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-soft-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-card"
      }`}
    >
      <span className="font-pixel text-[9px] uppercase tracking-wider">
        {label}
      </span>
      <span className="font-mono text-[8px] opacity-70 mt-0.5">{sublabel}</span>
    </button>
  );
}
