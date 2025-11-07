import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "../components/Providers";
import ContactButton from "../components/ContactButton";
import CartWidget from "../components/CartWidget";

export const metadata = {
  title: "Prynt.ro | Tipar digital & producție publicitară",
  description: "Bannere, flyere, canvas, autocolante. Configurează online și vedeți prețul în timp real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body className="bg-[#0b0f19] text-white antialiased">
        {/* Providers este un Client Component și conține CartProvider */}
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <ContactButton />
          <CartWidget />
        </Providers>
      </body>
    </html>
  );
}