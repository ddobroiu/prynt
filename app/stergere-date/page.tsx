import Link from 'next/link';

export const metadata = {
  title: 'Ștergerea Datelor Personale | Exercitarea Dreptului la Uitare GDPR | Prynt.ro',
  description: 'Instrucțiuni complete pentru exercitarea dreptului la ștergere (dreptul la uitare) conform GDPR Art. 17 și Legii 190/2018. Proceduri clare și termene legale.',
};

export default function StergereDatePage() {
  return (
    <main className="min-h-screen bg-surface text-ui px-4 py-12">
      <div className="max-w-4xl mx-auto rounded-xl card-bg border border-[--border] shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-ui">Dreptul la Ștergere (Dreptul la Uitare)</h1>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <p className="text-lg text-blue-800 font-semibold mb-2">
            Exercitarea drepturilor GDPR: <strong>Art. 17 - Dreptul la ștergere</strong> | <strong>Legea 190/2018</strong> (România)
          </p>
          <p className="text-sm text-blue-700">
            <strong>Operator:</strong> CULOAREA DIN VIATA SA SRL | <strong>CUI:</strong> RO44820819 | <strong>Contact DPO:</strong> contact@prynt.ro | <strong>Termen procesare:</strong> Maximum 30 zile
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-800">🛡️ Ce înseamnă dreptul la ștergere?</h2>
          <p className="text-yellow-700 text-sm">
            Conform <strong>Art. 17 GDPR</strong>, ai dreptul să obții din partea operatorului ștergerea fără întârziere nejustificată 
            a datelor cu caracter personal care te privesc, iar operatorul are obligația să șteargă fără întârziere nejustificată datele, 
            cu respectarea excepțiilor legale (obligații de arhivare, exercitarea dreptului la libera exprimare, motive de sănătate publică).
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">📋 Temeiuri legale pentru exercitarea dreptului (Art. 17 GDPR)</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">✅ Cererea poate fi acceptată dacă:</h3>
            <ul className="text-sm text-green-700 list-disc pl-5 space-y-1">
              <li>Datele nu mai sunt necesare pentru scopurile inițiale</li>
              <li>Îți retragi consimțământul și nu există alt temei legal</li>
              <li>Datele au fost prelucrate ilicit</li>
              <li>Ștergerea este necesară pentru respectarea obligațiilor legale</li>
              <li>Datele au fost colectate în legătură cu serviciile societății informaționale oferite copiilor</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">❌ Excepții legale (nu poate fi acceptată):</h3>
            <ul className="text-sm text-red-700 list-disc pl-5 space-y-1">
              <li>Exercitarea dreptului la libera exprimare și informare</li>
              <li>Respectarea obligațiilor legale (10 ani - documente fiscale)</li>
              <li>Pentru motive de interes public în domeniul sănătății</li>
              <li>În scopuri de arhivare în interes public, cercetare științifică</li>
              <li>Pentru constatarea, exercitarea sau apărarea drepturilor în instanță</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">🔄 Procedura de solicitare (completă și conformă GDPR)</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Pasul 1: Depunerea cererii</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>Modalități de contact:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Email DPO:</strong> <a href="mailto:contact@prynt.ro" className="underline">contact@prynt.ro</a> (preferat)</li>
                <li><strong>Email general:</strong> <a href="mailto:contact@prynt.ro" className="underline">contact@prynt.ro</a></li>
                <li><strong>Poștă:</strong> CULOAREA DIN VIATA SA SRL, Sat Topliceni, Buzău, România (specifică "Cerere GDPR - Ștergere date")</li>
                <li><strong>Telefon:</strong> +40 750 473 111 (pentru clarificări)</li>
              </ul>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2">Pasul 2: Informații obligatorii în cerere</h3>
            <div className="text-sm text-orange-700">
              <p className="mb-2"><strong>Cererea trebuie să conțină:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Date de identificare:</strong> Nume complet, email înregistrat, număr telefon (dacă este)</li>
                <li><strong>Cererea explicită:</strong> "Solicit exercitarea dreptului la ștergere conform Art. 17 GDPR"</li>
                <li><strong>Temeiul legal:</strong> Motivul pentru care soliciți ștergerea (vezi temeurile de mai sus)</li>
                <li><strong>Documente anexate:</strong> Copie act identitate pentru verificarea identității</li>
                <li><strong>Istoric interacțiuni:</strong> Numere comenzi, email-uri cu suport (dacă există)</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Pasul 3: Verificarea identității și procesarea</h3>
            <div className="text-sm text-purple-700 space-y-2">
              <p><strong>Termene legale (Art. 12 GDPR):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Confirmare primire:</strong> Maximum 72 ore</li>
                <li><strong>Verificare identitate:</strong> 3-5 zile lucrătoare (pot solicita informații suplimentare)</li>
                <li><strong>Decizie finală:</strong> Maximum 30 zile (poate fi extins cu 60 zile în cazuri complexe)</li>
                <li><strong>Notificare terți:</strong> Vom informa și terții cărora le-am transmis datele (dacă este cazul)</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">🗂️ Categorii de date care pot fi șterse</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <h4 className="font-semibold text-green-800 text-sm mb-2">Cont utilizator</h4>
            <ul className="text-xs text-green-700 list-disc pl-4 space-y-1">
              <li>Nume, prenume</li>
              <li>Email, parolă (hash)</li>
              <li>Telefon, adrese</li>
              <li>Preferințe profil</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <h4 className="font-semibold text-blue-800 text-sm mb-2">Activitate site</h4>
            <ul className="text-xs text-blue-700 list-disc pl-4 space-y-1">
              <li>Istoric navigare</li>
              <li>Coș salvat</li>
              <li>Chat AI conversații</li>
              <li>Cookies comportament</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-3 rounded border border-purple-200">
            <h4 className="font-semibold text-purple-800 text-sm mb-2">Conținut utilizator</h4>
            <ul className="text-xs text-purple-700 list-disc pl-4 space-y-1">
              <li>Fișiere încărcate</li>
              <li>Designuri personale</li>
              <li>Comentarii, review-uri</li>
              <li>Newsletter subscriptions</li>
            </ul>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-4">
          <h3 className="font-semibold text-orange-800 mb-2">🎨 Contextul Produselor Personalizate</h3>
          <p className="text-sm text-orange-700 mb-2">
            <strong>PRYNT.ro</strong> realizează exclusiv <strong>produse personalizate</strong> (bannere, afișe, canvas, autocolante) după designul și specificațiile clientului. 
            Acest context influențează procesarea cererii de ștergere:
          </p>
          <ul className="text-sm text-orange-700 list-disc pl-5 space-y-1">
            <li><strong>Fișiere design încărcate:</strong> Pot fi șterse la cerere explicită (dacă nu sunt păstrate pentru garanție)</li>
            <li><strong>Specificații tehnice:</strong> Pot fi anonimizate pentru comenzile finalizate</li>
            <li><strong>Istoric comenzi personalizate:</strong> Păstrat pentru obligații fiscale și garanție produse</li>
            <li><strong>Comunicări design/revizii:</strong> Pot fi șterse după expirarea garanției (6 luni comercială)</li>
          </ul>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">⚖️ Date păstrate pentru obligații legale (nu pot fi șterse)</h3>
          <div className="text-sm text-red-700 grid md:grid-cols-2 gap-4">
            <div>
              <p><strong>Documente contabile (10 ani):</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Facturi emise și primite</li>
                <li>Registre contabile</li>
                <li>Declarații fiscale</li>
                <li>Contracte comerciale</li>
                <li><strong>Detalii comenzi personalizate</strong> (pentru fiscalitate)</li>
              </ul>
            </div>
            <div>
              <p><strong>Date pentru apărarea în instanță:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Comunicări litigii</li>
                <li>Evidența reclamațiilor</li>
                <li>Garanții produse personalizate</li>
                <li>Transferuri bancare</li>
                <li><strong>Specificații tehnice produse</strong> (pentru reclamații)</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-ui">📞 Contact și Căi de Atac</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-semibold mb-2">Contact Principal</h4>
              <p className="text-sm space-y-1">
                <strong>DPO (Data Protection Officer):</strong><br/>
                Email: <a href="mailto:contact@prynt.ro" className="text-primary underline">contact@prynt.ro</a><br/>
                Telefon: <a href="tel:+40750473111" className="text-primary underline">+40 750 473 111</a><br/>
                Program: L-V 9:00-18:00
              </p>
            </div>
          </div>
          <div>
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Căi de atac legale</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p><strong>ANSPDCP (Autoritatea rom de protecție date):</strong></p>
                <p>📧 <a href="mailto:anspdcp@dataprotection.ro" className="underline">anspdcp@dataprotection.ro</a></p>
                <p>🌐 <a href="https://dataprotection.ro" target="_blank" className="underline">dataprotection.ro</a></p>
                <p>📞 +40 318 059 211</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-xs text-muted text-center mb-4">
            <strong>Document actualizat:</strong> {new Date().toLocaleDateString('ro-RO')} | 
            <strong>Versiune:</strong> 2.0 | 
            <strong>Conformitate:</strong> GDPR Art. 17, Legea 190/2018 (RO)
          </p>
          <div className="text-center space-x-4">
            <Link href="/confidentialitate" className="text-primary underline hover:text-primary/80 text-sm">
              Politica de confidențialitate
            </Link>
            <Link href="/politica-cookies" className="text-primary underline hover:text-primary/80 text-sm">
              Politica cookies
            </Link>
            <Link href="/" className="inline-block px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow transition transform hover:-translate-y-0.5">
              Înapoi la prima pagină
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
