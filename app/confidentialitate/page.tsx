import React from 'react';

export default function ConfidentialitatePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Politica de Confidențialitate</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p>Actualizat la: {new Date().toLocaleDateString('ro-RO')}</p>

        <section>
            <h2 className="text-xl font-bold mt-6 mb-2">1. Colectarea datelor</h2>
            <p>
                Colectăm informații personale pe care ni le furnizați direct, cum ar fi: nume, prenume, adresa de e-mail, 
                număr de telefon, adresa de livrare și facturare, atunci când plasați o comandă sau vă creați un cont.
            </p>
        </section>

        {/* --- SECȚIUNE NOUĂ PENTRU AI --- */}
        <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h2 className="text-xl font-bold mt-2 mb-2 text-blue-800 dark:text-blue-300">2. Utilizarea Serviciilor de Inteligență Artificială (AI)</h2>
            <p>
                Pentru a vă oferi un suport rapid și eficient, utilizăm tehnologii de inteligență artificială (AI), inclusiv dar fără a se limita la modele furnizate de OpenAI și integrări WhatsApp (Meta).
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                    <strong>Identificare:</strong> Numărul dvs. de telefon și numele pot fi utilizate pentru a vă identifica automat atunci când ne contactați prin chat-ul de pe site sau pe WhatsApp, pentru a vă putea adresa personalizat.
                </li>
                <li>
                    <strong>Procesare:</strong> Conținutul mesajelor dvs. poate fi procesat de algoritmi AI pentru a genera răspunsuri automate, a oferi informații despre comenzi sau a verifica statusul livrării.
                </li>
                <li>
                    <strong>Confidențialitate:</strong> Nu folosim datele dvs. personale pentru antrenarea modelelor AI publice. Datele sunt partajate strict în scopul furnizării răspunsului către dvs., conform acordurilor de prelucrare a datelor încheiate cu furnizorii noștri.
                </li>
            </ul>
        </section>
        {/* ------------------------------- */}

        <section>
            <h2 className="text-xl font-bold mt-6 mb-2">3. Scopul prelucrării</h2>
            <p>Folosim datele dvs. pentru:</p>
            <ul className="list-disc pl-5">
                <li>Procesarea și livrarea comenzilor.</li>
                <li>Comunicarea legată de statusul comenzii (email, SMS, WhatsApp).</li>
                <li>Servicii de suport clienți (inclusiv suport automatizat AI).</li>
                <li>Obligații fiscale și legale (facturare).</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold mt-6 mb-2">4. Partajarea datelor</h2>
            <p>
                Putem partaja datele dvs. cu furnizori de servicii terți care ne ajută să operăm afacerea:
                procesatori de plăți (Stripe, Netopia), firme de curierat (DPD, Fan Courier), furnizori de servicii IT și AI (OpenAI, Vercel, Supabase).
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold mt-6 mb-2">5. Drepturile dvs.</h2>
            <p>
                Conform GDPR, aveți dreptul de a accesa, rectifica sau șterge datele dvs. personale. 
                Pentru exercitarea acestor drepturi, ne puteți contacta la contact@prynt.ro.
            </p>
        </section>
      </div>
    </div>
  );
}