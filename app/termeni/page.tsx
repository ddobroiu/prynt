import React from 'react';

export const metadata = {
  title: "Termeni și condiții | Prynt.ro",
  description: "Vezi termenii și condițiile de utilizare și procesare comenzi pe Prynt.ro.",
};

export default function TermeniPage() {
  return (
    <main className="min-h-screen bg-surface text-ui px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-xl card-bg border border-[--border] shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-ui">Termeni și condiții</h1>
        <p className="text-lg text-muted mb-6">
          Prin utilizarea site-ului <b>Prynt.ro</b> și efectuarea unei comenzi, sunteți de acord cu termenii și condițiile de mai jos.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">1. Informații generale</h2>
        <p className="text-muted mb-4">
          Prynt.ro este o platformă online care oferă servicii de tipar digital și producție publicitară. Prețurile afișate includ TVA, iar comenzile sunt procesate doar după confirmarea plății sau acceptarea comenzii.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">2. Comenzi și livrare</h2>
        <p className="text-muted mb-4">
          Termenul standard de livrare este 24–48h din momentul confirmării comenzii. Livrarea se face prin DPD România. Prynt.ro nu este responsabil pentru întârzierile datorate firmelor de curierat.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">3. Plată și facturare</h2>
        <p className="text-muted mb-4">
          Plata se poate efectua online (card bancar), prin ordin de plată sau ramburs. Facturile sunt emise automat pe baza datelor furnizate de client.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">4. Drepturi de autor</h2>
        <p className="text-muted mb-4">
          Clientul este responsabil de drepturile asupra imaginilor, textelor sau designului încărcat pentru tipar. Prynt.ro nu își asumă răspunderea pentru conținutul trimis de client.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">5. Retur și reclamații</h2>
        <p className="text-muted mb-4">
          Produsele personalizate nu se pot returna. Reclamațiile privind calitatea se trimit în maximum 48h de la primirea coletului, împreună cu fotografii relevante.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">6. Comunicare și Suport (AI & WhatsApp)</h2>
        <p className="text-muted mb-4">
          Prin acceptarea acestor termeni, sunteți de acord ca Prynt.ro să vă contacteze prin e-mail, SMS sau aplicații de mesagerie (WhatsApp) pentru notificări legate de comandă.
        </p>
        <p className="text-muted mb-4">
            De asemenea, luați la cunoștință că serviciul nostru de suport poate utiliza asistenți virtuali (AI) pentru a răspunde solicitărilor dvs. în timp real. Deși depunem toate eforturile pentru acuratețea informațiilor, răspunsurile generate de AI pot conține uneori erori. Vă recomandăm să verificați informațiile critice cu un operator uman.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">7. Date de contact</h2>
        <p className="text-muted">
          Email: <a href="mailto:contact@prynt.ro" className="text-primary underline">contact@prynt.ro</a><br />
          Tel: <a href="tel:0750473111" className="text-primary underline">0750 473 111</a><br />
          Program: L–V 9:00–18:00
        </p>

        <div className="mt-8 text-center">
          <a href="/" className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">Înapoi la prima pagină</a>
        </div>
      </div>
    </main>
  );
}