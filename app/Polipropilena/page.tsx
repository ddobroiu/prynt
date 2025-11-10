import React from "react";
import ConfiguratorPolipropilena from "../../components/ConfiguratorPolipropilena";

export const metadata = {
  title: "Polipropilenă - Configurator",
  description: "Configurare Akyplac Alb (polipropilenă) 3mm / 5mm",
};

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <ConfiguratorPolipropilena />
    </main>
  );
}