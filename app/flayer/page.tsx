import FlyerConfigurator from "../../components/FlyerConfigurator";

export const metadata = {
  title: "Flayere personalizate | Prynt.ro",
  description: "Configurează formatul, hârtia, față/verso, laminare și tiraj. Preț în timp real.",
};

export default function FlayerPage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <nav className="mb-6 text-sm text-white/60">
          <a href="/" className="hover:underline">Acasă</a>
          <span className="mx-2">/</span>
          <span className="text-white">Flayer</span>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Flayere personalizate</h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            Alege formatul, hârtia și tirajul. Procentele pentru opțiuni se aplică doar în calcule — UI-ul rămâne curat.
          </p>
        </header>

        <div className="max-w-3xl">
          <FlyerConfigurator />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          * Recomandare fișiere: PDF/PNG/JPG, minim 300 DPI, CMYK. Putem realiza și designul (cost separat).
        </div>
      </section>
    </main>
  );
}
