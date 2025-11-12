import React from "react";
import ConfiguratorPlexiglass from "@/components/ConfiguratorPlexiglass";
import FaqJsonLd from "@/components/FaqJsonLd";

export const metadata = {
  title: "Plexiglass - Configurator",
  description: "Configurare Plexiglass alb și transparent",
};

export default function Page() {
  return (
    <div>
      <ConfiguratorPlexiglass />
      <FaqJsonLd
        qa={[
          { question: "Ce grosimi de plexiglas oferiți?", answer: "Diverse grosimi (ex. 2–10 mm) în funcție de stoc; selectează din configurator sau cere o ofertă." },
          { question: "Se poate decupa la formă?", answer: "Da, putem debita și finisa plexiglasul la cerere. Menționează în detalii comandă." },
        ]}
      />
    </div>
  );
}