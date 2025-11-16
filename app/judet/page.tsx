import React from "react";
import Link from "next/link";
import { JUDETE_DATA } from "@/lib/judeteData";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Servicii de print în toate județele României - Prynt",
  description: "Comandă bannere, autocolante, pliante și materiale publicitare în orice județ din România. Livrare rapidă, prețuri instant. Alege județul tău.",
  keywords: "print România, județe, bannere, autocolante, pliante, afișe, livrare județe",
  alternates: { canonical: "/judet" },
};

export default function JudetePage() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");

  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[
        { name: "Acasă", url: `${base}/` },
        { name: "Județe", url: `${base}/judet` }
      ]} />

      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-ui">Servicii de print în toate județele României</h1>
        <p className="text-muted mt-2">Livrăm bannere, autocolante, pliante și materiale publicitare în orice județ. Alege județul tău pentru detalii și prețuri.</p>
      </header>

      <section>
        <h2 className="text-2xl font-bold mb-4">Alege județul pentru servicii de print</h2>
        <p className="mb-6">Prynt acoperă întreaga Românie cu servicii de print de calitate. Selectează județul tău pentru a vedea localitățile disponibile și serviciile oferite.</p>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {JUDETE_DATA.map((judet) => (
            <Link key={judet.slug} href={`/judet/${judet.slug}`} className="card p-4 hover:bg-white/10 transition">
              <h3 className="text-lg font-semibold mb-2">{judet.name}</h3>
              <p className="text-sm text-muted mb-2">Localități principale: {judet.localities.slice(0, 3).join(", ")}{judet.localities.length > 3 ? "..." : ""}</p>
              <span className="text-sm text-ui font-medium">Vezi detalii →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">De ce Prynt pentru județul tău?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Livrare rapidă</h3>
            <p className="text-sm text-muted">În 1-3 zile în majoritatea județelor.</p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Prețuri transparente</h3>
            <p className="text-sm text-muted">Calculează exact online.</p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Calitate garantată</h3>
            <p className="text-sm text-muted">Materiale premium, print UV.</p>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Suport 24/7</h3>
            <p className="text-sm text-muted">Ajutor pentru orice proiect.</p>
          </div>
        </div>
      </section>
    </main>
  );
}