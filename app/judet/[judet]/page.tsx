import React from "react";
import Link from "next/link";
import { getAllJudeteSlugs, getJudetBySlug } from "@/lib/judeteData";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import Script from "next/script";

// Helper pentru a genera text variat (evităm duplicate content 100%)
function getSynonym(term: "titlu" | "descriere" | "cta", seed: number) {
  constvariations = {
    titlu: [
      "Servicii de Print Digital & Tipar",
      "Producție Publicitară Completă",
      "Tipografie Online și Printuri Mari",
      "Soluții de Promovare și Print",
    ],
    descriere: [
      "Materiale publicitare de impact",
      "Soluții profesionale de vizibilitate",
      "Printuri outdoor și indoor rezistente",
      "Reclame vizuale personalizate",
    ],
    cta: [
      "Configurează oferta online",
      "Vezi prețurile instant",
      "Comandă acum simplu",
      "Calculează costul total",
    ],
  };
  
  const list = variations[term];
  return list[seed % list.length];
}

export async function generateStaticParams() {
  return getAllJudeteSlugs().map((slug) => ({ judet: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ judet: string }> }) {
  const { judet } = await params;
  const data = getJudetBySlug(judet);
  
  if (!data) return {};

  const cityName = data.localities[0] || data.name;
  
  // Optimizare titlu pentru CTR mai mare
  const title = `Print ${data.name} - Bannere, Autocolante & Tipar Digital | Livrare Rapidă`;
  const description = `Cauți servicii de print în ${data.name}? Livrăm în ${cityName}, ${data.localities.slice(1, 3).join(", ")} și tot județul. Bannere, afișe, autocolante la preț de producător.`;

  return {
    title,
    description,
    keywords: `print ${data.name}, tipografie ${data.name}, bannere ${data.name}, autocolante ${data.name}, productie publicitara ${data.name}`,
    alternates: { canonical: `/judet/${data.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ro_RO",
    }
  };
}

export default async function JudetPage({ params }: { params: Promise<{ judet: string }> }) {
  const { judet } = await params;
  const data = getJudetBySlug(judet);
  
  if (!data) return <div className="container py-10 text-center">Județul nu a fost găsit.</div>;

  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  
  // Seed simplu bazat pe lungimea numelui pentru variație deterministă
  const variationSeed = data.name.length; 
  const dynamicTitle = getSynonym("titlu", variationSeed);
  const dynamicDesc = getSynonym("descriere", variationSeed);
  const dynamicCta = getSynonym("cta", variationSeed);

  const services = [
    { 
      name: "Bannere Publicitare", 
      slug: "banner", 
      desc: "Bannere PVC rezistente la exterior, tivite și capsate.", 
      price: "de la 9 €/mp" 
    },
    { 
      name: "Autocolante & Stickere", 
      slug: "autocolante", 
      desc: "Autocolant printat, decupat pe contur, pentru vitrine sau auto.",
      price: "de la 12 €/mp" 
    },
    { 
      name: "Afișe și Postere", 
      slug: "afise", 
      desc: "Print digital pe hârtie blueback sau foto pentru evenimente.",
      price: "de la 3 RON/buc" 
    },
    { 
      name: "Mesh Publicitar", 
      slug: "banner", // Momentan ducem la banner, ideal pagină separată
      desc: "Printuri de mari dimensiuni pentru clădiri, rezistente la vânt.",
      price: "Personalizat"
    },
    { 
      name: "Tablouri Canvas", 
      slug: "canvas", 
      desc: "Decor interior premium, print pe pânză cu șasiu de lemn.",
      price: "de la 79 RON" 
    },
    { 
      name: "Flyere și Pliante", 
      slug: "flayere", 
      desc: "Materiale promoționale ieftine pentru distribuție stradală.",
      price: "Tiraj mare" 
    },
    { 
      name: "Tapet Personalizat", 
      slug: "tapet", 
      desc: "Transformă orice perete cu tapet printat la dimensiunea ta.",
      price: "de la 45 RON/mp" 
    },
    { 
      name: "Plăci Rigide (Forex)", 
      slug: "materiale/pvc-forex", 
      desc: "Panouri pentru semnalistică, expoziții sau decor.",
      price: "Diverse grosimi" 
    },
  ];

  // Schema.org specifică pentru SEO Local
  const localSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Servicii Print și Publicitate ${data.name}`,
    "serviceType": "Large Format Printing",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Prynt.ro",
      "url": `${base}/judet/${data.slug}`,
      "telephone": "+40 750 473 111",
      "priceRange": "$$",
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": `Județul ${data.name}`
      }
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": `Județul ${data.name}`,
      "containsPlace": data.localities.map(loc => ({
        "@type": "City",
        "name": loc
      }))
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicii Tipar Digital",
      "itemListElement": services.map((s, i) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.name
        },
        "position": i + 1
      }))
    }
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Cât durează livrarea comenzilor în județul ${data.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Pentru județul ${data.name}, termenul standard de producție este de 24-48 ore, iar livrarea prin curier rapid durează 1-2 zile lucrătoare.`
        }
      },
      {
        "@type": "Question",
        "name": `Livrați și în alte localități din ${data.name} în afară de ${data.localities[0]}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Da, prin partenerii noștri de curierat acoperim toate localitățile din județul ${data.name}, inclusiv sate și comune, fără costuri de kilometri suplimentari.`
        }
      },
      {
        "@type": "Question",
        "name": "Pot vedea prețul final înainte să comand?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Desigur. Pe Prynt.ro ai configuratoare online unde introduci dimensiunile și vezi prețul instant, fără să aștepți oferte pe mail."
        }
      }
    ]
  };

  return (
    <main className="page py-10 bg-gray-50/50 min-h-screen">
      <Script
        id="local-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <BreadcrumbsJsonLd items={[
        { name: "Acasă", url: `${base}/` },
        { name: "Acoperire Națională", url: `${base}/judet` },
        { name: `Print în ${data.name}`, url: `${base}/judet/${data.slug}` }
      ]} />

      {/* Hero Section Local */}
      <header className="text-center mb-12 px-4 max-w-4xl mx-auto">
        <span className="inline-block py-1 px-3 rounded-full bg-ui/10 text-ui text-sm font-medium mb-4">
          Livrare rapidă în {data.name}
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
          {dynamicTitle} în județul <span className="text-ui">{data.name}</span>
        </h1>
        <p className="text-lg text-muted md:px-10 leading-relaxed">
          Comandă online {dynamicDesc}. Suntem partenerul tău de încredere pentru
          proiecte publicitare livrate direct în <strong>{data.localities.join(", ")}</strong> și oriunde în județ.
        </p>
      </header>

      {/* Localities Tags */}
      <section className="mb-16 container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 opacity-80">
          <span className="text-sm text-muted py-1 flex items-center">Livrăm în:</span>
          {data.localities.map((loc) => (
            <span key={loc} className="px-3 py-1 bg-white border border-gray-200 shadow-sm rounded-full text-sm text-gray-700 font-medium">
              📍 {loc}
            </span>
          ))}
          <span className="px-3 py-1 bg-gray-100 border border-transparent rounded-full text-sm text-gray-500">
            + orice sat/comună
          </span>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mb-16 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Ce putem produce pentru afacerea ta din {data.name}?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.slug} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-ui transition-colors">
                  <Link href={`/${service.slug}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {service.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted mb-4">{service.desc}</p>
                <div className="text-xs font-semibold text-green-600 bg-green-50 inline-block px-2 py-1 rounded">
                  {service.price}
                </div>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-100 mt-auto">
                <span className="text-ui text-sm font-semibold flex items-center justify-between">
                  {dynamicCta} 
                  <span className="text-lg">→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-12 bg-white mb-16 rounded-3xl mx-4 lg:mx-8 shadow-sm border border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-bold text-lg mb-2">Producție Rapidă</h3>
              <p className="text-muted text-sm">Majoritatea comenzilor pleacă de la noi în 24-48 ore spre {data.name}.</p>
            </div>
            <div>
              <div className="text-4xl mb-4">💎</div>
              <h3 className="font-bold text-lg mb-2">Calitate Garantată</h3>
              <p className="text-muted text-sm">Folosim cerneală UV rezistentă și materiale premium pentru durabilitate.</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📐</div>
              <h3 className="font-bold text-lg mb-2">Orice Dimensiune</h3>
              <p className="text-muted text-sm">Configuratoarele noastre permit dimensiuni personalizate la milimetru.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO Gold */}
      <section className="mb-16 container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl font-bold mb-8 text-center">Întrebări frecvente despre livrarea în {data.name}</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-2">Cât costă transportul până în {data.name}?</h3>
            <p className="text-muted">Costul transportului este calculat automat în coș în funcție de greutatea coletului. Colaborăm cu firme de curierat care asigură livrare rapidă în tot județul {data.name}.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-2">Pot ridica comanda personal?</h3>
            <p className="text-muted">Momentan, atelierul nostru principal expediază toate comenzile prin curier. Acest lucru ne permite să menținem prețurile scăzute și să servim eficient clienții din {data.name}.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-2">Oferiți montaj în județul {data.name}?</h3>
            <p className="text-muted">Pentru produsele standard (bannere, autocolante, afișe), montajul este simplu și oferim instrucțiuni. Pentru proiecte complexe de fațade în {data.name}, vă rugăm să ne contactați pentru a verifica disponibilitatea echipelor partenere.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center pb-12">
        <div className="bg-ui text-white rounded-2xl p-8 md:p-12 mx-4 max-w-4xl md:mx-auto shadow-xl shadow-ui/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ai un proiect în {data.name}?</h2>
          <p className="mb-8 opacity-90 text-lg">Nu pierde timpul cerând oferte pe email. Configurează produsul online și lansează comanda acum.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/banner" className="bg-white text-ui px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
              Vreau Banner
            </Link>
            <Link href="/autocolante" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">
              Vreau Autocolant
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}