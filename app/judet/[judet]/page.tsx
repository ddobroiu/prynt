import React from "react";
import Link from "next/link";
import { getAllJudeteSlugs, getJudetBySlug } from "@/lib/judeteData";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export async function generateStaticParams() {
  return getAllJudeteSlugs().map((slug) => ({ judet: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ judet: string }> }) {
  const { judet } = await params;
  const data = getJudetBySlug(judet);
  if (!data) return {};
  const title = `Servicii de print în județul ${data.name} - Bannere, Autocolante, Prynt`;
  const description = `Comandă bannere, autocolante, pliante, afișe și materiale publicitare în județul ${data.name} și localitățile ${data.localities.join(", ")}. Prețuri instant, livrare rapidă.`;
  return {
    title,
    description,
    keywords: `print ${data.name}, bannere ${data.name}, autocolante ${data.name}, pliante ${data.name}, afișe ${data.name}, ${data.localities.join(", ")}`,
    alternates: { canonical: `/judet/${data.slug}` },
  };
}

export default async function JudetPage({ params }: { params: Promise<{ judet: string }> }) {
  const { judet } = await params;
  const data = getJudetBySlug(judet);
  if (!data) return <div>Județul nu a fost găsit.</div>;

  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");

  const services = [
    { name: "Bannere publicitare", slug: "banner", desc: "Bannere PVC, blockout, față-verso pentru exterior și interior." },
    { name: "Banner față-verso", slug: "banner-verso", desc: "Bannere cu print pe ambele fețe, ideale pentru spații deschise." },
    { name: "Autocolante decupate", slug: "autocolante", desc: "Autocolante personalizate, monomeric sau polimeric, laminate." },
    { name: "Pliante", slug: "pliante", desc: "Pliante bi/tri-pli pentru prezentări și promovare." },
    { name: "Flyere", slug: "flayere", desc: "Flyere A4-A6 pentru distribuție masivă." },
    { name: "Afișe rapide", slug: "afise", desc: "Afișe blueback, whiteback, foto pentru evenimente." },
    { name: "Print pe canvas", slug: "canvas", desc: "Tablouri pe pânză naturală sau poliester, rame flotante." },
    { name: "Carton printat", slug: "carton", desc: "Cutii, display-uri, standuri din carton duplex/triplex." },
    { name: "Alucobond", slug: "alucobond", desc: "Panouri compozit aluminiu pentru semnalistică și fațade." },
    { name: "PVC Forex și Polipropilena", slug: "materiale", desc: "Panouri rigide pentru display-uri și etichete." },
    { name: "Tapet printat", slug: "tapet", desc: "Tapet personalizat pentru decor interior." },
  ];

  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[
        { name: "Acasă", url: `${base}/` },
        { name: "Județe", url: `${base}/judet` },
        { name: `Județul ${data.name}`, url: `${base}/judet/${data.slug}` }
      ]} />

      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-ui">Servicii de print în județul {data.name}</h1>
        <p className="text-muted mt-2">Bannere, autocolante, pliante și materiale publicitare în {data.name} și localitățile din jur. Prețuri instant, calitate garantată.</p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Localitățile acoperite în județul {data.name}</h2>
        <p className="mb-4">Livrăm în toate localitățile din județul {data.name}, inclusiv:</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {data.localities.map((loc) => (
            <span key={loc} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm">{loc}</span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">Dacă localitatea ta nu apare în listă, contactează-ne pentru disponibilitate.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Serviciile noastre de print în județul {data.name}</h2>
        <p className="mb-6">Oferim o gamă completă de servicii de print pentru afaceri și evenimente în județul {data.name}. Toate materialele sunt de înaltă calitate, cu print UV rezistent.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.slug} className="card p-4">
              <h3 className="text-lg font-semibold mb-2">
                <Link href={`/${service.slug}`} className="hover:underline">{service.name}</Link>
              </h3>
              <p className="text-sm text-muted mb-3">{service.desc}</p>
              <Link href={`/${service.slug}`} className="btn-primary text-sm">Configurează acum</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">De ce să alegi Prynt pentru județul {data.name}?</h2>
        <ul className="list-disc list-inside space-y-2 text-muted">
          <li><strong>Prețuri instant:</strong> Calculează costul exact în configuratoarele online.</li>
          <li><strong>Livrare rapidă:</strong> Termen de producție 24-48 ore, livrare în 1-3 zile în județul {data.name}.</li>
          <li><strong>Calitate superioară:</strong> Cerneluri UV rezistente, materiale premium.</li>
          <li><strong>Suport local:</strong> Consultanță gratuită pentru proiectele tale în {data.name}.</li>
          <li><strong>Garanție:</strong> Satisfacție garantată sau bani înapoi.</li>
        </ul>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Începe proiectul tău acum</h2>
        <p className="mb-6">Alege serviciul dorit și configurează online. Livrare direct în județul {data.name}.</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {services.slice(0, 4).map((service) => (
            <Link key={service.slug} href={`/${service.slug}`} className="btn-primary">{service.name}</Link>
          ))}
        </div>
      </section>
    </main>
  );
}