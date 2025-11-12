
export const metadata = {
  title: "Politica de confidențialitate | Prynt.ro",
  description: "Află cum protejăm și prelucrăm datele tale personale pe Prynt.ro.",
};


export default function ConfidentialitatePage() {
  return (
    <main className="min-h-screen bg-surface text-ui px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-xl card-bg border border-[--border] shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-ui">Politica de confidențialitate</h1>
        <p className="text-lg text-muted mb-6">
          Această politică explică modul în care <b>Prynt.ro</b> colectează, utilizează și protejează datele tale personale.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Ce date colectăm?</h2>
        <p className="text-muted mb-4">
          Colectăm datele necesare pentru procesarea comenzilor: nume, adresă, email, telefon și detalii de facturare. Datele pot fi colectate direct sau prin formulare de pe site.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Cum folosim datele?</h2>
        <ul className="list-disc pl-6 text-muted mb-4">
          <li>Procesarea și livrarea comenzilor</li>
          <li>Comunicare privind statusul comenzii</li>
          <li>Emiterea facturilor</li>
          <li>Respectarea obligațiilor legale</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Stocarea și securitatea datelor</h2>
        <p className="text-muted mb-4">
          Datele sunt stocate pe servere securizate, cu acces limitat la personal autorizat. Folosim conexiuni HTTPS, criptare și măsuri tehnice pentru protecția datelor.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Drepturile tale</h2>
        <ul className="list-disc pl-6 text-muted mb-4">
          <li>Acces la datele personale</li>
          <li>Rectificare sau ștergere</li>
          <li>Retragerea consimțământului</li>
          <li>Portabilitatea datelor</li>
        </ul>
        <p className="text-muted mb-4">
          Pentru orice solicitare sau întrebare, ne poți contacta la <a href="mailto:contact@prynt.ro" className="text-primary underline">contact@prynt.ro</a>.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Partajarea datelor</h2>
        <p className="text-muted mb-4">
          Datele sunt partajate doar cu partenerii implicați în livrare și plată (ex: curier, procesator de plăți). Nu vindem datele personale către terți.
        </p>
        <div className="mt-8 text-center">
          <a href="/" className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">Înapoi la prima pagină</a>
        </div>
      </div>
    </main>
  );
}
