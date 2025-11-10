import React from "react";
import ConfiguratorPVCForex from "../../components/ConfiguratorPVCForex";

export const metadata = {
  title: "PVC Forex - Configurator",
  description: "Configurare plăci PVC Forex (PVC spumă)",
};

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <ConfiguratorPVCForex />
    </main>
  );
}