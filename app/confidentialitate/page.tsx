export const metadata = {
  title: "Politica de confidențialitate | Prynt.ro",
  description: "Informații despre modul în care Prynt.ro colectează și prelucrează datele personale.",
};

export default function ConfidentialitatePage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Politica de confidențialitate</h1>
        <p className="text-white/80 mb-4">
          Această politică explică modul în care <b>Prynt.ro</b> colectează, utilizează și protejează informațiile dumneavoastră personale.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Date colectate</h2>
        <p className="text-white/70 mb-4">
          Colectăm datele necesare pentru procesarea comenzilor: nume, adresă, email, telefon și detalii de facturare.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Scopul utilizării</h2>
        <p className="text-white/70 mb-4">
          Datele sunt folosite pentru livrarea produselor, comunicare privind comanda și facturare. Nu folosim datele în scopuri de marketing fără consimțământul dumneavoastră explicit.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Stocarea datelor</h2>
        <p className="text-white/70 mb-4">
          Datele sunt stocate pe servere securizate. Ne asigurăm că accesul este limitat doar la personalul autorizat.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Drepturile utilizatorilor</h2>
        <p className="text-white/70 mb-4">
          Aveți dreptul de a accesa, corecta sau șterge datele personale. Pentru orice solicitare, ne puteți contacta la adresa contact@prynt.ro.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Partajarea datelor</h2>
        <p className="text-white/70 mb-4">
          Transmitem datele doar partenerilor implicați în procesul de livrare și plată (ex: DPD, procesator de plăți). Nu vindem datele personale.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Securitate</h2>
        <p className="text-white/70">
          Folosim conexiuni HTTPS, criptare și măsuri tehnice pentru protecția datelor personale.
        </p>
      </div>
    </main>
  );
}
