import React from "react";
import AfiseConfigurator from "@/components/AfiseConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

export const metadata = {
  title: "Afișe — Print digital | Prynt",
  description: "Alege formatul A3..A0 sau S5/S7, materiale Blueback / Whiteback / Satin / Foto sau hârtie 150/300 g (lucioasă/mată). Preț instant și adaugă în coș.",
  alternates: { canonical: "/afise" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Cum încarc grafica pentru afișe?", answer: "Poți încărca fișiere PDF/AI/PSD/JPG/PNG direct în configurator sau ne poți lăsa un link de descărcare (Drive/WeTransfer). Verificăm gratuit fișierele înainte de print." },
  { question: "Care este termenul de livrare?", answer: "Termen total (producție + livrare): 24–48 ore. Pentru urgențe, contactează-ne pentru prioritizare." },
    { question: "Primesc o probă (BAT) înainte de tipar?", answer: "La cerere, trimitem BAT digital pentru confirmare. Corecțiile simple sunt gratuite; DTP avansat se oferă la cerere." },
    { question: "Cum aleg dimensiunea corectă?", answer: "Selectează din configurator formatul dorit (A3–A0, S5/S7 etc.). Prețul se actualizează instant. Pentru recomandări, scrie-ne." },
    { question: "Ce metode de plată acceptați?", answer: "Poți plăti ramburs la curier sau online cu cardul (plată securizată). Factura o primești electronic." },
    { question: "Se pot returna afișele personalizate?", answer: "Produsele personalizate nu se returnează, dar remediem rapid orice neconformitate conform legislației în vigoare." },
  ];
  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Afișe", url: `${base}/afise` }]} />
      <ServiceJsonLd name="Afișe tipărite" url={`${base}/afise`} />
      <HowToJsonLd
        name="Cum comanzi afișe"
        steps={[
          { name: "Alege formatul și materialul", text: "Formate A3–A0/S5/S7; materiale Blueback/Whiteback/Satin/Foto sau hârtie 150/300 g." },
          { name: "Setează cantitatea", text: "Alege tirajul în funcție de distribuție." },
          { name: "Încarcă fișierele", text: "PDF/AI/PSD/JPG/PNG; recomandat 150–300 dpi pentru formate mari." },
          { name: "Preț instant & comandă", text: "Vezi prețul în timp real și finalizează." },
          { name: "Livrare 24–48h", text: "Expediem rapid în toată țara." },
        ]}
      />
      <section>
        <AfiseConfigurator />
      </section>
      <section className="mt-6 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <FaqAccordion qa={qa} fullWidth />
          <FaqJsonLd qa={qa} />
        </div>
        <aside className="mt-4 md:mt-0 space-y-4">
          <RevealBlock buttonLabel="Cum comand?">
            <HowToSection
              title="Cum comanzi afișe"
              steps={[
                "Alege formatul și materialul potrivit",
                "Setează tirajul",
                "Încarcă fișierele (PDF/AI/PSD/JPG/PNG)",
                "Preț instant și adaugă în coș",
                "Finalizează – livrare 24–48h",
              ]}
            />
          </RevealBlock>
          <RevealBlock buttonLabel="Citește mai mult">
            <CategorySeoContent kind="afise" />
          </RevealBlock>
        </aside>
      </section>
    </main>
  );
}