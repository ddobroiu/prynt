import ProductGallery from "../../components/ProductGallery";
import BannerConfigurator from "../../components/BannerConfigurator";
import StockBannerList from "../../components/StockBannerList";
import type { StockBanner } from "../../components/StockBannerCard";

export const metadata = {
  title: "Banner personalizat | Prynt.ro",
  description:
    "Configurează bannere personalizate – dimensiuni, material, opțiuni. Preț în timp real.",
};

export default function BannerPage() {
  const images = [
    { src: "/products/banner/1.jpg", alt: "Banner exterior" },
    { src: "/products/banner/2.jpg", alt: "Print calitate" },
    { src: "/products/banner/3.jpg", alt: "Detaliu tiv și capse" },
  ];

  const features = [
    "Print UV rezistent la intemperii",
    "Culoare bogată, nefadeată",
    "Livrare rapidă",
    "Opțiuni: găuri de vânt, tiv + capse",
  ];

  const badges = [
    { title: "Livrare 24–48h", desc: "în funcție de cantitate" },
    { title: "Plată sigură", desc: "card / OP / ramburs" },
    { title: "Garanția calității", desc: "verificare fișier" },
  ];

  const stockItems: StockBanner[] = [
    {
      id: "s1",
      title: "Banner promoțional 300x100 cm",
      image: "/products/banner/stock-1.jpg",
      status: "de_vanzare",
      size: "300 x 100 cm",
      material: "Frontlit 440 g/mp",
      condition: "nou",
      location: "București",
      price: 220,
      price_unit: "",
      note: "Cantitate limitată, livrare imediată.",
    },
    {
      id: "s2",
      title: "Banner 400x150 cm – eveniment",
      image: "/products/banner/stock-2.jpg",
      status: "de_inchiriat",
      size: "400 x 150 cm",
      material: "Frontlit 510 g/mp",
      condition: "folosit",
      location: "Cluj-Napoca",
      price: 35,
      price_unit: "/zi",
      note: "Include kit prindere, minim 3 zile.",
    },
    {
      id: "s3",
      title: "Banner Mesh 500x300 cm – fațadă",
      image: "/products/banner/stock-3.jpg",
      status: "de_inchiriat",
      size: "500 x 300 cm",
      material: "Mesh 270 g/mp",
      condition: "folosit",
      location: "Iași",
      price: 60,
      price_unit: "/zi",
      note: "Ideal pentru șantiere sau clădiri în renovare.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-white/60">
          <a href="/" className="hover:underline">
            Acasă
          </a>{" "}
          <span className="mx-2">/</span>
          <span className="text-white">Banner</span>
        </nav>

        {/* Titlu + subtitlu */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Banner personalizat
          </h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            Configurează dimensiuni, material și opțiuni. Prețul se calculează automat.
          </p>
        </header>

        {/* Grid 2 coloane: galerie + configurator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Stânga: galerie + info */}
          <div>
            <ProductGallery images={images} />

            {/* Badge-uri încredere */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="text-base font-semibold">{b.title}</div>
                  <div className="text-sm text-white/70">{b.desc}</div>
                </div>
              ))}
            </div>

            {/* Beneficii */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-3">
                De ce să alegi bannerele noastre
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-white/80">
                {features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Descriere detaliată */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold mb-2">Descriere</h3>
              <p className="text-white/80">
                Bannerul este tipărit pe material frontlit (440–510 g/mp) cu
                cerneală UV. Opțional poți adăuga găuri de vânt și tiv + capse
                pentru montaj. Recomandăm încărcarea unui fișier la rezoluție
                mare (min. 150 DPI la scara 1:1).
              </p>
            </div>

            {/* Bannere în stoc */}
            <StockBannerList items={stockItems} />
          </div>

          {/* Dreapta: configurator sticky */}
          <aside className="lg:pl-4">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <BannerConfigurator />
              </div>

              {/* Info suplimentar sub configurator */}
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                * Necesită fișier pregătit pentru tipar (PDF/PNG/JPG). La cerere,
                putem realiza designul (+cost).
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}