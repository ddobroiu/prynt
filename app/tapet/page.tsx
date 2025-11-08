import React from "react";

export const metadata = {
  title: "Tapet — Prynt",
  description: "Tapet personalizat — configurator și prețuri.",
};

export default function Page() {
  return (
    <main style={{ padding: 16 }}>
      <section>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Tapet — Print digital</h1>
        <p style={{ marginTop: 8, color: "#9ca3af" }}>
          Pagină pentru tapet (schelet). Voi integra aici configuratorul pentru tapet pe baza cerințelor tale.
        </p>
      </section>
    </main>
  );
}