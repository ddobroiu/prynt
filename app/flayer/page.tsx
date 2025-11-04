// app/flayer/page.tsx
import ProductGallery from "../../components/ProductGallery";
import FlyerConfigurator from "../../components/FlyerConfigurator";

export const metadata = {
  title: "Flayere personalizate | Prynt.ro",
  description: "Configurează formatul, hârtia, față/verso, laminare și tiraj. Preț în timp real.",
};

export default function FlayerPage() {
  const images = [
    { src: "/products/flayer/1.jpg", alt: "Flayere color" },
    { src: "/products/flayer/2.jpg", alt: "Detaliu print" },
    { src: "/products/flayer/3.jpg", alt: "Set flayere" },
  ];

  const features = [
    "Formate A6 / A5 / A4 / A3",
    "Hârtie lucioasă sau mată 130–250 g/mp",
    "Față sau față/verso, opțional laminare",
    "Discount progresiv pe tiraj",
  ];

  const badges = [
    { title: "Print calitativ", desc: "culori vii, text clar" },
    { title: "Tiraj flexibil", desc: "100 — 5000+ buc" },
    { title: "Preț corect", desc: "calcul instant" },
  ];

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-white/60">
          <a href="/" className="hover:underline">Acasă</a> <span className="mx-2">/</span>
          <span className="text-white">Flayer</span>
        </nav>

        {/* Titlu + subtitlu */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Flayere personalizate</h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            Alege formatul, hârtia și tirajul. Prețul se actualizează automat în funcție de opțiuni.
          </p>
        </header>

        {/* Grid 2 coloane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Stânga: galerie + info */}
          <div>
            <ProductGallery images={images} />

            {/* Badge-uri */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {badges.map((b, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-base font-semibold">{b.title}</div>
                  <div className="text-sm text-white/70">{b.desc}</div>
                </div>
              ))}
            </div>

            {/* Beneficii */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-3">De ce să alegi flayerele noastre</h2>
              <ul className="list-disc pl-5 space-y-1 text-white/80">
                {features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>

            {/* Descriere */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold mb-2">Descriere</h3>
              <p className="text-white/80">
                Flayere tipărite digital sau offset, în funcție de tiraj, cu hârtie 130–250 g/mp. Opțional, laminare
                lucioasă sau mată pentru protecție sporită. Fișiere recomandate: PDF/PNG/JPG, 300 DPI, CMYK.
              </p>
            </div>
          </div>

          {/* Dreapta: configurator sticky */}
          <aside className="lg:pl-4">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <FlyerConfigurator />
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                * Design la cerere (+cost). Timp de producție rapid, în funcție de tiraj.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
