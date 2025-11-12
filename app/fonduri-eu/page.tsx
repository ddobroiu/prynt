import { notFound } from "next/navigation";

export const metadata = {
  title: "Fonduri UE",
  description: "Pagina a fost mutată. Folosește subcategoriile: PNRR, REGIO, Naționale.",
};

export default function Page() {
  // Pagina principală Fonduri UE nu mai este accesibilă.
  // Accesează subcategoriile din meniu.
  notFound();
}
