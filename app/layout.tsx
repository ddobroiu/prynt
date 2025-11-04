import "./globals.css";
import { CartProvider } from "../components/CartProvider";

export const metadata = {
  title: "Prynt.ro",
  description: "Tipărituri profesionale.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="bg-[#0b0f19] text-white">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">Prynt<span className="text-white/60">.ro</span></a>
            <a href="/checkout" className="text-sm bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20">
              Finalizează comanda
            </a>
          </div>
        </header>

        <CartProvider>{children}</CartProvider>

        <footer className="mt-16 border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-white/70">
            © {new Date().getFullYear()} Prynt.ro
          </div>
        </footer>
      </body>
    </html>
  );
}
