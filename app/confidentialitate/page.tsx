import React from 'react';

export default function ConfidentialitatePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Politica de Confidențialitate GDPR</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p><strong>Actualizat la:</strong> {new Date().toLocaleDateString('ro-RO')} | <strong>Versiunea:</strong> 2.1</p>
        <p><strong>Operator de date:</strong> SC PRYNT SRL, CUI: [CUI], J40/[nr]/2024, Str. [Adresa], București, România</p>
        <p><strong>Persoana de contact DPO:</strong> contact@prynt.ro | <strong>Telefon:</strong> 0750.473.111</p>

        <section className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <h2 className="text-xl font-bold mt-2 mb-2 text-red-800 dark:text-red-300">1. Temei Legal și Categorii de Date (Art. 6 GDPR)</h2>
            <p><strong>Temeiuri legale de prelucrare:</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Executarea contractului (Art. 6(1)(b)):</strong> Procesarea și livrarea comenzilor</li>
                <li><strong>Obligație legală (Art. 6(1)(c)):</strong> Facturare, arhivare fiscală (10 ani), raportare ANAF</li>
                <li><strong>Consimțământ (Art. 6(1)(a)):</strong> Newsletter, marketing, comunicări WhatsApp</li>
                <li><strong>Interes legitim (Art. 6(1)(f)):</strong> Prevenirea fraudei, securitatea site-ului</li>
            </ul>
            <p className="mt-3"><strong>Categorii de date prelucrate:</strong> Date de identificare (nume, prenume), date de contact (email, telefon), adrese de livrare/facturare, date financiare (pentru plată), preferințe de comunicare, istoricul conversațiilor cu AI.</p>
        </section>

        {/* --- SECȚIUNE NOUĂ PENTRU AI --- */}
        <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h2 className="text-xl font-bold mt-2 mb-2 text-blue-800 dark:text-blue-300">2. Servicii AI și Profilare Automată (Art. 22 GDPR)</h2>
            <p>
                <strong>Declarație de transparență AI:</strong> Utilizăm sisteme de inteligență artificială (OpenAI GPT, Meta WhatsApp Business API) pentru suport automatizat, respectând Regulamentul AI Act (UE) 2024/1689.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Dreptul de a nu fi supus deciziilor automate:</strong> Aveți dreptul să solicitați intervenția umană pentru orice decizie care vă afectează semnificativ</li>
                <li><strong>Retenția conversațiilor:</strong> Mesajele cu AI sunt stocate 30 de zile pentru îmbunătățirea serviciului, apoi anonimizate</li>
                <li><strong>Transferuri internaționale:</strong> Datele pot fi procesate în SUA/UE prin OpenAI (adequacy decision) cu garanții suplimentare SCC</li>
                <li><strong>Securitate:</strong> Criptare end-to-end pentru conversațiile WhatsApp, acces restricted pentru personalul autorizat</li>
                <li><strong>Acuratețe AI:</strong> Răspunsurile AI pot conține erori - verificați informațiile critice cu personalul uman</li>
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

        <section className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h2 className="text-xl font-bold mt-2 mb-2 text-green-800 dark:text-green-300">5. Drepturile Persoanelor Vizate (Cap. III GDPR)</h2>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div>
                    <p><strong>Drepturi fundamentale:</strong></p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        <li><strong>Acces (Art. 15):</strong> Copie gratuită a datelor prelucrate</li>
                        <li><strong>Rectificare (Art. 16):</strong> Corectarea datelor inexacte</li>
                        <li><strong>Ștergerea (Art. 17):</strong> "Dreptul de a fi uitat"</li>
                        <li><strong>Restricționare (Art. 18):</strong> Limitarea prelucrării</li>
                        <li><strong>Portabilitate (Art. 20):</strong> Export date în format structurat</li>
                    </ul>
                </div>
                <div>
                    <p><strong>Exercitarea drepturilor:</strong></p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        <li><strong>Email:</strong> dpo@prynt.ro</li>
                        <li><strong>Telefon:</strong> 0750.473.111</li>
                        <li><strong>Poștă:</strong> SC PRYNT SRL, București</li>
                        <li><strong>Termen răspuns:</strong> Maximum 30 zile</li>
                        <li><strong>Reclamații:</strong> ANSPDCP (dataprotection.ro)</li>
                    </ul>
                </div>
            </div>
        </section>
        <section>
            <h2 className="text-xl font-bold mt-6 mb-2">6. Perioada de Stocare și Măsuri de Securitate</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p><strong>Termene de păstrare conform legislației române:</strong></p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Date comenzi și facturi: <strong>10 ani</strong> (Codul Fiscal, Legea 82/1991)</li>
                    <li>Conversații AI și suport: <strong>30 zile</strong> (apoi anonimizare)</li>
                    <li>Date marketing (cu consimțământ): până la retragerea consimțământului</li>
                    <li>Loguri de securitate: <strong>6 luni</strong> (Legea 506/2004 privind prelucrarea datelor)</li>
                </ul>
                <p className="mt-3"><strong>Măsuri tehnice și organizatorice:</strong> Criptare SSL/TLS, autentificare cu doi factori pentru admin, backup-uri criptate, acces pe bază de "need to know", auditări regulate de securitate.</p>
            </div>
        </section>

        <section>
            <h2 className="text-xl font-bold mt-6 mb-2">7. Transferuri Internaționale și Prelucrători</h2>
            <p><strong>Parteneri și localizarea datelor:</strong></p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li><strong>OpenAI (SUA):</strong> Adequacy Decision + Standard Contractual Clauses</li>
                <li><strong>Stripe (Irlanda/SUA):</strong> Adecvat GDPR, certificare PCI DSS</li>
                <li><strong>Vercel (SUA):</strong> Hosting cu garanții GDPR și SCC</li>
                <li><strong>DPD România:</strong> Prelucrător local, contract de prelucrare GDPR</li>
                <li><strong>Meta WhatsApp (Irlanda):</strong> Adequacy Decision UE</li>
            </ul>
        </section>

        <section className="mt-8 border-t pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Document legal actualizat conform:</strong> GDPR (UE) 2016/679, Legea 190/2018 (implementare GDPR România), 
                OUG 34/2014 (drepturile consumatorilor), Regulamentul AI Act (UE) 2024/1689, 
                Legea 506/2004 (prelucrarea datelor personale), Codul Civil român.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Pentru întrebări juridice: <a href="mailto:legal@prynt.ro" className="text-blue-600 underline">legal@prynt.ro</a>
            </p>
        </section>
      </div>
    </div>
  );
}