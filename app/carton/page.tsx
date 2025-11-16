import ConfiguratorCarton from "@/components/ConfiguratorCarton";

export const metadata = {
  title: "Configurator Carton Personalizat - Prynt",
  description: "Configurează și comandă produse din carton personalizate, cu diverse opțiuni de material, print și finisaje.",
};

export default function CartonPage() {
  return <ConfiguratorCarton productSlug="carton" />;
}
