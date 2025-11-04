import "./globals.css";

export const metadata = {
  title: "Prynt.ro",
  description: "Tipărituri profesionale: bannere, flyere, canvas și altele.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="bg-[#0b0f19] text-white">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">Prynt<span className="text-white/60">.ro</span></a>
            <nav className="flex items-center gap-6 text-sm text-white/80">
              <a className="hover:text-white" href="/banner">Banner</a>
              {/* aici poți adăuga alte produse */}
            </nav>
          </div>
        </header>

        {/* Conținut */}
        {children}

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-white/70">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>© {new Date().getFullYear()} Prynt.ro. Toate drepturile rezervate.</div>
              <div className="space-x-4">
                <a className="hover:text-white" href="#">Termeni & condiții</a>
                <a className="hover:text-white" href="#">Politica de confidențialitate</a>
                <a className="hover:text-white" href="#">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
