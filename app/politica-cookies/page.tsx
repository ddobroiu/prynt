
export const metadata = {
  title: "Politica de Cookies | Prynt.ro",
  description: "Află cum folosim cookies pe site-ul Prynt.ro pentru o experiență optimă.",
};


export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen bg-surface text-ui px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-xl card-bg border border-[--border] shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-ui">Politica de Cookies</h1>
        <p className="text-lg text-muted mb-6">
          Această pagină explică modul în care site-ul <b>Prynt.ro</b> folosește cookies pentru a îmbunătăți experiența ta online.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Ce sunt cookies?</h2>
        <p className="text-muted mb-4">
          Cookies sunt fișiere mici stocate pe dispozitivul tău atunci când vizitezi un site web. Ele ajută la funcționarea corectă a site-ului, la personalizarea conținutului și la analizarea traficului.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Cum folosim cookies?</h2>
        <ul className="list-disc pl-6 text-muted mb-4">
          <li>Funcționare esențială: Asigură funcționalitatea de bază a site-ului (autentificare, coș de cumpărături etc).</li>
          <li>Analiză și performanță: Ne ajută să înțelegem cum este folosit site-ul și să îmbunătățim serviciile.</li>
          <li>Personalizare: Rețin preferințele tale pentru o experiență mai plăcută.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Controlul cookies</h2>
        <p className="text-muted mb-4">
          Poți controla sau șterge cookies din setările browserului. Limitarea cookies poate afecta funcționalitatea site-ului.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Confidențialitate</h2>
        <p className="text-muted mb-4">
          Pentru detalii despre protecția datelor, consultă <a href="/confidentialitate" className="text-primary underline">Politica de confidențialitate</a>.
        </p>
        <div className="mt-8 text-center">
          <a href="/" className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">Înapoi la prima pagină</a>
        </div>
      </div>
    </main>
  );
}
