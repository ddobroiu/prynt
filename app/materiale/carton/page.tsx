import React from "react";
import ConfiguratorCarton from "@/components/ConfiguratorCarton";

export const metadata = {
  title: "Carton - Configurator",
  description: "Configurare Carton Ondulat și Carton reciclat",
  alternates: { canonical: "/carton" },
};

export default function Page() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <ConfiguratorCarton />
    </main>
  );
}