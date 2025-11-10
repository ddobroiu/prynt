import React from "react";
import ConfiguratorCarton from "../../components/ConfiguratorCarton";

export const metadata = {
  title: "Carton - Configurator",
  description: "Configurare Carton Ondulat și Carton reciclat",
};

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <ConfiguratorCarton />
    </main>
  );
}