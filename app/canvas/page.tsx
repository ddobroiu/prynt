import CanvasConfigurator from "../../components/CanvasConfigurator";

export const metadata = {
  title: "Canvas personalizat | Prynt.ro",
  description:
    "Alege formă (dreptunghi / pătrat), dimensiunea din listă și cantitatea. Preț în timp real.",
};

export default function CanvasPage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <nav className="mb-6 text-sm text-white/60">
          <a href="/" className="hover:underline">
            Acasă
          </a>
          <span className="mx-2">/</span>
          <span className="text-white">Canvas</span>
        </nav>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Canvas personalizat
          </h1>
          <p className="mt-2 text-white/70 max-w-2xl">
            Dimensiuni disponibile:
            {" "}Dreptunghi – 30×40, 40×60, 60×90 cm;
            {" "}Pătrat – 30×30, 40×40, 60×60, 90×90 cm.
          </p>
        </header>

        <div className="max-w-3xl">
          <CanvasConfigurator />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          * Print premium pe pânză canvas, întinsă pe șasiu de lemn. Recomandare fișiere: PDF/PNG/JPG, minim 200–300 DPI.
        </div>
      </section>
    </main>
  );
}
