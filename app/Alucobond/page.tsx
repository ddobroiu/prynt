import React from "react";
import ConfiguratorAlucobond from "../../components/ConfiguratorAlucobond";

export const metadata = {
  title: "Alucobond - Configurator",
  description: "Configurare plăci Alucobond (Visual Bond PE / PVDF)",
};

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <ConfiguratorAlucobond />
    </main>
  );
}