import ProductGallery from "../../components/ProductGallery";
import StickerConfigurator from "../../components/StickerConfigurator";

export const metadata = {
  title: "Autocolante personalizate | Prynt.ro",
  description: "Configurează autocolante personalizate – dimensiuni, material, laminare și tiraj. Preț în timp real.",
};

export default function StickerPage() {
  const images = [
    { src: "/products/autocolant/1.jpg", alt: "Autocolant vitrină" },
    { src: "/products/autocolant/2.jpg", alt: "Autocolant lucios" },
    { src: "/products/autocolant/3.jpg", alt: "Print detaliu" },
  ];

  const features = [
    "Autocolant PVC de calitate, lucios sau mat",
    "Rezistent la exterior, durabilitate 3–5 ani",
    "Opțional laminare UV pentru protecție",
    "Tipărire eco-solvent profesională",
  ];

  const badges = [
    { title: "Livrare 24–48h", desc: "în funcție de cantitate" },
    { title: "Plată sigură", desc: "card / OP / ramburs" },
    { title: "Rezistență UV", desc: "3–5 ani exterior" },
  ];

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <nav className="mb-6 text-sm text-white/60">
          <a href="/" className="hover:underline">Acasă</a> <span className="mx-2">/</span>
          <span className="text-white">Autocolante</span>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Autocolante personalizate</h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            Configurează dimensiunea, materialul și laminarea. Prețul se actualizează automat.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <ProductGallery images={images} />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {badges.map((b, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-base font-semibold">{b.title}</div>
                  <div className="text-sm text-white/70">{b.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-3">De ce să alegi autocolantele noastre</h2>
              <ul className="list-disc pl-5 space-y-1 text-white/80">
                {features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold mb-2">Descriere</h3>
              <p className="text-white/80">
                Autocolante tipărite digital pe material PVC durabil, potrivite pentru vitrine, pereți sau mașini.
                Laminarea asigură protecție UV și rezistență la zgârieturi. Producție rapidă, calitate garantată.
              </p>
            </div>
          </div>

          <aside className="lg:pl-4">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <StickerConfigurator />
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                * Autocolante tăiate la dimensiunea dorită, ambalate profesional.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
