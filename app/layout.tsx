import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "../components/Providers";
import ContactButton from "../components/ContactButton";

// Cart provider + widget (client components)
import { CartProvider } from "../components/CartContext";
import CartWidget from "../components/CartWidget";

export const metadata = {
  title: "Prynt.ro | Tipar digital & producție publicitară",
  description:
    "Bannere, flayere, canvas, autocolante, materiale rigide. Configurează online și vezi prețul în timp real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className="bg-[#0b0f19] text-white antialiased">
        <Providers>
          <Header />

          {/* CartProvider trebuie să învăluie părțile care folosesc useCart */}
          <CartProvider>
            <main>{children}</main>

            {/* CartWidget folosește useCart, deci trebuie în interiorul CartProvider */}
            <CartWidget />
          </CartProvider>

          <Footer />
          <ContactButton />
        </Providers>
      </body>
    </html>
  );
}