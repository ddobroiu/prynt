import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "../components/Providers";
import ContactButton from "../components/ContactButton";

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
          <main>{children}</main>
          <Footer />
          <ContactButton />
        </Providers>
      </body>
    </html>
  );
}