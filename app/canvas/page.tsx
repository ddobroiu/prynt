// app/canvas/page.tsx
import ProductGallery from "../../components/ProductGallery";
import CanvasConfigurator from "../../components/CanvasConfigurator";

export const metadata = {
  title: "Canvas personalizat | Prynt.ro",
  description: "Tablouri canvas pe șasiu — alege formă și dimensiune. Preț în timp real.",
};

export default function CanvasPage() {
  const images = [
    { src: "/products/canvas/1.jpg", alt: "Canvas living" },
    { src: "/products/canvas/2.jpg", alt: "Detaliu pânză" },
    { src: "/products/canvas/3.jpg", alt: "Șasiu lemn" },
  ];

  const features = [
    "Pânză canvas texturată, culori vibrante",
    "Întins pe șasiu de lemn, gata de agățat",
    "Forme: dreptunghi sau pătrat",
    "Dimensiuni standard: 30×40, 40×60, 60×90 / 30×30, 40×40, 60×60, 90×90",
  ];

  const badges = [
    { title: "Print premium", desc: "detaliu și claritate" },
    { title: "Ambalare sigură", desc: "protejat la transport" },
    { title: "Livrare rapidă", desc: "24–48h prin DPD" },
  ];

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-white/60">
          <a href="/" className="hover:underline">Acasă</a> <span className="mx-2">/</span>
          <span className="text-white">Canvas</span>
        </nav>

        {/* Titlu + subtitlu */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Canvas personalizat</h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            Alege forma (dreptunghi/pătrat) și dimensiunea dorită. Prețul se calculează automat.
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
              <h2 className="text-xl font-semibold mb-3">De ce să alegi canvasul nostru</h2>
              <ul className="list-disc pl-5 space-y-1 text-white/80">
                {features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>

            {/* Descriere */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold mb-2">Descriere</h3>
              <p className="text-white/80">
                Print pe pânză canvas de calitate, întinsă pe șasiu de lemn. Recomandare fișiere: PDF/PNG/JPG, minim
                200–300 DPI la scara 1:1. Opțional, putem ajusta imaginile (contra cost).
              </p>
            </div>
          </div>

          {/* Dreapta: configurator sticky */}
          <aside className="lg:pl-4">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <CanvasConfigurator />
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                * Include sistem de prindere simplu. Livrare în cutie protejată.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
