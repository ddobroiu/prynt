export const metadata = {
  title: "Termeni și condiții | Prynt.ro",
  description: "Condițiile generale de utilizare ale site-ului și de procesare a comenzilor Prynt.ro.",
};

export default function TermeniPage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Termeni și condiții</h1>
        <p className="text-white/80 mb-4">
          Prin utilizarea site-ului <b>Prynt.ro</b> și efectuarea unei comenzi, sunteți de acord cu termenii și condițiile de mai jos.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Informații generale</h2>
        <p className="text-white/70 mb-4">
          Prynt.ro este o platformă online care oferă servicii de tipar digital și producție publicitară. Prețurile afișate includ TVA, iar comenzile sunt procesate doar după confirmarea plății sau acceptarea comenzii.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Comenzi și livrare</h2>
        <p className="text-white/70 mb-4">
          Termenul standard de livrare este 24–48h din momentul confirmării comenzii. Livrarea se face prin DPD România. Prynt.ro nu este responsabil pentru întârzierile datorate firmelor de curierat.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Plată și facturare</h2>
        <p className="text-white/70 mb-4">
          Plata se poate efectua online (card bancar), prin ordin de plată sau ramburs. Facturile sunt emise automat pe baza datelor furnizate de client.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Drepturi de autor</h2>
        <p className="text-white/70 mb-4">
          Clientul este responsabil de drepturile asupra imaginilor, textelor sau designului încărcat pentru tipar. Prynt.ro nu își asumă răspunderea pentru conținutul trimis de client.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Retur și reclamații</h2>
        <p className="text-white/70 mb-4">
          Produsele personalizate nu se pot returna. Reclamațiile privind calitatea se trimit în maximum 48h de la primirea coletului, împreună cu fotografii relevante.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Date de contact</h2>
        <p className="text-white/70">
          Email: contact@prynt.ro<br />
          Tel: +40 734 123 456<br />
          Program: L–V 9:00–18:00
        </p>
      </div>
    </main>
  );
}
