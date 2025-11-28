export const metadata = {
  title: "Politica de Cookies | Prynt.ro",
  description: "Află cum folosim cookies pe site-ul Prynt.ro, inclusiv pentru Chat AI și WhatsApp, pentru o experiență optimă.",
};

export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen bg-surface text-ui px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-xl card-bg border border-[--border] shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-ui">Politica de Cookies</h1>
        <p className="text-lg text-muted mb-6">
          Această pagină explică modul în care site-ul <b>Prynt.ro</b> folosește cookies și tehnologii similare pentru a îmbunătăți experiența ta online.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Ce sunt cookies?</h2>
        <p className="text-muted mb-4">
          Cookies sunt fișiere mici de text stocate pe dispozitivul tău (computer, telefon, tabletă) atunci când vizitezi un site web. Ele ajută la funcționarea corectă a site-ului, la personalizarea conținutului și la analizarea traficului. Pe lângă cookies, putem folosi și "Local Storage" pentru a salva preferințele tale direct în browser.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Cum folosim cookies?</h2>
        <ul className="list-disc pl-6 text-muted mb-4 space-y-2">
          <li>
            <strong className="text-ui">Funcționare esențială:</strong> Asigură funcționalitatea de bază a site-ului (autentificare, menținerea produselor în coșul de cumpărături, securitate).
          </li>
          <li>
            <strong className="text-ui">Comunicare și Asistență (Chat & WhatsApp):</strong> Necesare pentru funcționarea asistentului virtual și a integrării cu WhatsApp.
          </li>
          <li>
            <strong className="text-ui">Analiză și performanță:</strong> Ne ajută să înțelegem cum este folosit site-ul pentru a putea îmbunătăți serviciile și viteza de încărcare.
          </li>
          <li>
            <strong className="text-ui">Personalizare:</strong> Rețin preferințele tale (de exemplu: tema întunecată/luminoasă) pentru o experiență mai plăcută.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Cookies pentru Chat AI și WhatsApp</h2>
        <div className="text-muted mb-4 space-y-3">
          <p>
            Pentru a vă oferi suport rapid și eficient, site-ul nostru integrează funcționalități de chat avansate:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-ui">Asistentul AI (Chatbot):</strong> Utilizăm tehnologii de stocare (precum Local Storage) pentru a salva istoricul conversației dumneavoastră cu asistentul nostru virtual. Acest lucru vă permite să navigați pe diferite pagini ale site-ului fără a pierde contextul discuției sau răspunsurile primite.
            </li>
            <li>
              <strong className="text-ui">WhatsApp Widget:</strong> Integrarea butonului de WhatsApp poate utiliza cookies pentru a facilita deschiderea aplicației și pentru a iniția conversația direct cu echipa noastră de suport, reținând uneori dacă ați interacționat anterior cu acest widget.
            </li>
          </ul>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Controlul cookies</h2>
        <p className="text-muted mb-4">
          Poți controla sau șterge cookies din setările browserului tău. Te rugăm să reții că dezactivarea anumitor cookies (în special cele esențiale sau de funcționalitate pentru chat) poate afecta experiența de utilizare și poate bloca anumite funcții ale site-ului.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">Confidențialitate</h2>
        <p className="text-muted mb-4">
          Pentru detalii complete despre cum prelucrăm datele tale personale, te rugăm să consulți <a href="/confidentialitate" className="text-primary underline hover:text-primary/80 transition-colors">Politica de confidențialitate</a>.
        </p>

        <div className="mt-8 text-center">
          {/* FIX: Am înlocuit bg-primary cu bg-slate-900 pentru a asigura contrastul cu text-white */}
          <a href="/" className="inline-block px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow transition transform hover:-translate-y-0.5">
            Înapoi la prima pagină
          </a>
        </div>
      </div>
    </main>
  );
}