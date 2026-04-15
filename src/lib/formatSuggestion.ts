import type { Suggestion } from "./teamAnalysis";
import { typeLabel } from "./i18n";
import type { Lang } from "./i18n";

// Matches the shape returned by useLang().t — we accept `string` for the
// key since the Dict-keyed translator is compatible at runtime.
type T = (key: any, vars?: Record<string, string | number>) => string;

export function formatSuggestion(s: Suggestion, t: T, lang: Lang): string {
  switch (s.kind) {
    case "incomplete":
      return t(s.missing === 1 ? "sugIncomplete1" : "sugIncomplete", {
        size: s.size,
        missing: s.missing,
      });
    case "coverageHoles": {
      const names = s.types.map((tp) => typeLabel(tp, lang)).join(", ");
      return t(s.count === 1 ? "sugCoverageHole1" : "sugCoverageHoles", {
        count: s.count,
        types: names,
      });
    }
    case "weaknessCritical":
      return t("sugWeaknessCritical", {
        count: s.count,
        size: s.size,
        type: typeLabel(s.type, lang),
      });
    case "weaknessShared":
      return t("sugWeaknessShared", {
        count: s.count,
        type: typeLabel(s.type, lang),
      });
    case "slow":
      return t("sugSlow", { avg: s.avg });
    case "fast":
      return t("sugFast", { avg: s.avg });
    case "imbalanced":
      return t(s.spe === 1 ? "sugImbalanced1" : "sugImbalanced", {
        phys: s.phys,
        spe: s.spe,
      });
  }
}
