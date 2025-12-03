import WindowGraphicsConfigurator from "@/components/WindowGraphicsConfigurator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Window Graphics - Folie Perforată Ferestre | Prynt.ro",
  description:
    "Folie PVC perforată pentru ferestre și vitrine. Vizibilitate unidirecțională perfectă, aplicare uscată, durabilitate până la 3 ani. Publicitate outdoor profesională.",
  keywords: [
    "window graphics",
    "folie perforata ferestre",
    "folie vitrine",
    "publicitate geamuri",
    "folie one-way vision",
    "autocolante ferestre",
    "folie perforata PVC",
    "publicitate outdoor",
  ],
  openGraph: {
    title: "Window Graphics - Folie Perforată Ferestre",
    description:
      "Folie PVC perforată 140μ cu vizibilitate unidirecțională. Perfectă pentru vitrine, birouri și autovehicule.",
    images: ["/products/window-graphics/1.webp"],
    type: "website",
  },
};

export default function WindowGraphicsPage() {
  return <WindowGraphicsConfigurator productSlug="window-graphics" />;
}
