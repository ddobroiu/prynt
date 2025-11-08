import React from "react";
import AfiseConfigurator from "@/components/AfiseConfigurator";

export const metadata = {
  title: "Afișe — Print digital | Prynt",
  description: "Alege formatul A3..A0 sau S5/S7, materiale Blueback / Whiteback / Satin / Foto sau hârtie 150/300 g (lucioasă/mată). Preț instant și adaugă în coș.",
};

export default function Page() {
  return (
    <main style={{ padding: 16 }}>
      <section>
        <AfiseConfigurator />
      </section>
    </main>
  );
}