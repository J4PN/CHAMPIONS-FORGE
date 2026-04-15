import { useLang } from "@/lib/i18n";
import { Shield, Database, Link2, Stamp, AlertCircle, Mail } from "lucide-react";

export function LegalPage() {
  const { t } = useLang();

  const sections: {
    icon: React.ReactNode;
    title: string;
    body: string;
  }[] = [
    {
      icon: <Shield className="h-4 w-4" />,
      title: t("legalWhoTitle"),
      body: t("legalWhoBody"),
    },
    {
      icon: <Database className="h-4 w-4" />,
      title: t("legalDataTitle"),
      body: t("legalDataBody"),
    },
    {
      icon: <Link2 className="h-4 w-4" />,
      title: t("legalThirdPartyTitle"),
      body: t("legalThirdPartyBody"),
    },
    {
      icon: <Stamp className="h-4 w-4" />,
      title: t("legalTrademarksTitle"),
      body: t("legalTrademarksBody"),
    },
    {
      icon: <AlertCircle className="h-4 w-4" />,
      title: t("legalWarrantyTitle"),
      body: t("legalWarrantyBody"),
    },
    {
      icon: <Mail className="h-4 w-4" />,
      title: t("legalContactTitle"),
      body: t("legalContactBody"),
    },
  ];

  return (
    <main className="container py-6 sm:py-10 max-w-3xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 bg-primary rotate-45"
            aria-hidden
          />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            {t("legalTitle")}
          </h1>
        </div>
        <p className="text-[10px] font-pixel uppercase tracking-wider text-muted-foreground mt-3">
          {t("legalSubtitle")}
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-pixel text-xl text-primary tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground flex items-center gap-2">
                {s.icon}
                {s.title}
              </h2>
            </div>
            <div className="h-[2px] bg-foreground mb-3" />
            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
              {s.body}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
