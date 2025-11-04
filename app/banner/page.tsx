import BannerConfigurator from "../../components/BannerConfigurator";

export default function BannerPage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Banner personalizat</h1>
        <p className="text-white/70 mb-10 max-w-2xl">
          Configurează dimensiunea, materialul și finisarea. Prețul se actualizează automat.
        </p>
        <BannerConfigurator />
      </section>
    </main>
  );
}
