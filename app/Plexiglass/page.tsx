import React from "react";
import ConfiguratorPlexiglass from "../../components/ConfiguratorPlexiglass";

export const metadata = {
  title: "Plexiglass - Configurator",
  description: "Configurare Plexiglass alb și transparent",
};

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <ConfiguratorPlexiglass />
    </main>
  );
}