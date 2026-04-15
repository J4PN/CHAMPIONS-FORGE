import { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type FlagProps = {
  lang: Lang;
  className?: string;
};

const SVG_PROPS = {
  viewBox: "0 0 15 10",
  shapeRendering: "crispEdges" as const,
};

export function Flag({ lang, className }: FlagProps) {
  const cls = cn(
    "h-3 w-[18px] shrink-0 rounded-[1px] border border-black/60 shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]",
    className,
  );
  switch (lang) {
    case "en":
      return (
        <svg {...SVG_PROPS} className={cls}>
          {/* Simplified Union Jack */}
          <rect width="15" height="10" fill="#012169" />
          {/* White diagonals */}
          <path d="M0 0 L15 10 M15 0 L0 10" stroke="#fff" strokeWidth="2" />
          {/* Red diagonals */}
          <path d="M0 0 L15 10 M15 0 L0 10" stroke="#C8102E" strokeWidth="1" />
          {/* White cross */}
          <rect x="6" width="3" height="10" fill="#fff" />
          <rect y="3.5" width="15" height="3" fill="#fff" />
          {/* Red cross */}
          <rect x="6.5" width="2" height="10" fill="#C8102E" />
          <rect y="4" width="15" height="2" fill="#C8102E" />
        </svg>
      );
    case "fr":
      return (
        <svg {...SVG_PROPS} className={cls}>
          <rect width="5" height="10" fill="#0055A4" />
          <rect x="5" width="5" height="10" fill="#fff" />
          <rect x="10" width="5" height="10" fill="#EF4135" />
        </svg>
      );
    case "es":
      return (
        <svg {...SVG_PROPS} className={cls}>
          <rect width="15" height="2.5" fill="#AA151B" />
          <rect y="2.5" width="15" height="5" fill="#F1BF00" />
          <rect y="7.5" width="15" height="2.5" fill="#AA151B" />
          {/* Tiny crest */}
          <rect x="3" y="4" width="1.5" height="2" fill="#AA151B" />
        </svg>
      );
    case "de":
      return (
        <svg {...SVG_PROPS} className={cls}>
          <rect width="15" height="3.34" fill="#000" />
          <rect y="3.33" width="15" height="3.34" fill="#DD0000" />
          <rect y="6.66" width="15" height="3.34" fill="#FFCE00" />
        </svg>
      );
    case "it":
      return (
        <svg {...SVG_PROPS} className={cls}>
          <rect width="5" height="10" fill="#009246" />
          <rect x="5" width="5" height="10" fill="#fff" />
          <rect x="10" width="5" height="10" fill="#CE2B37" />
        </svg>
      );
    case "ja":
      return (
        <svg {...SVG_PROPS} className={cls}>
          <rect width="15" height="10" fill="#fff" />
          <circle cx="7.5" cy="5" r="3" fill="#BC002D" />
        </svg>
      );
    case "ko":
      return (
        <svg {...SVG_PROPS} className={cls}>
          <rect width="15" height="10" fill="#fff" />
          {/* Taegeuk (simplified) */}
          <circle cx="7.5" cy="5" r="2.5" fill="#CD2E3A" />
          <path
            d="M5 5 A2.5 2.5 0 0 1 10 5 A1.25 1.25 0 0 0 7.5 5 A1.25 1.25 0 0 1 5 5 Z"
            fill="#0047A0"
          />
          {/* 4 trigram dots */}
          <rect x="1" y="1.5" width="1.2" height="0.5" fill="#000" />
          <rect x="12.8" y="1.5" width="1.2" height="0.5" fill="#000" />
          <rect x="1" y="8" width="1.2" height="0.5" fill="#000" />
          <rect x="12.8" y="8" width="1.2" height="0.5" fill="#000" />
        </svg>
      );
    case "zh-Hans":
      return (
        <svg {...SVG_PROPS} className={cls}>
          <rect width="15" height="10" fill="#DE2910" />
          {/* Big star */}
          <polygon
            points="2.5,1 3.1,2.5 4.7,2.5 3.4,3.5 3.9,5 2.5,4 1.1,5 1.6,3.5 0.3,2.5 1.9,2.5"
            fill="#FFDE00"
          />
          {/* Small stars */}
          <rect x="5" y="1" width="0.8" height="0.8" fill="#FFDE00" />
          <rect x="5.5" y="2" width="0.8" height="0.8" fill="#FFDE00" />
          <rect x="5.5" y="3.2" width="0.8" height="0.8" fill="#FFDE00" />
          <rect x="5" y="4.2" width="0.8" height="0.8" fill="#FFDE00" />
        </svg>
      );
    case "zh-Hant":
      return (
        <svg {...SVG_PROPS} className={cls}>
          <rect width="15" height="10" fill="#FE0000" />
          <rect width="7.5" height="5" fill="#000095" />
          {/* White sun */}
          <circle cx="3.75" cy="2.5" r="1.5" fill="#fff" />
          <circle cx="3.75" cy="2.5" r="0.7" fill="#000095" />
        </svg>
      );
  }
}
