import Link from 'next/link';

export const metadata = {
  title: 'Stergere date — Prynt',
  description: 'Instrucțiuni pentru solicitarea ștergerii datelor personale conform GDPR.',
};

export default function StergereDatePage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Stergere date personale</h1>

      <p className="text-gray-700 mb-6">
        La Prynt respectăm drepturile tale la confidențialitate. Mai jos găsești pașii pentru a solicita ștergerea
        datelor personale pe care le deținem despre tine.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ce înseamnă "ștergere a datelor"?</h2>
        <p className="text-gray-700">
          Solicitarea de ștergere înseamnă că vom elimina din sistem datele personale care ne permit să te identificăm
          (nume, email, telefon, adresa, detalii de comandă stocate în profil) în conformitate cu prevederile GDPR,
          cu excepția cazurilor în care avem obligații legale de păstrare (de ex. contabilitate, emitere facturi) sau
          interese legitime care împiedică ștergerea imediată.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pașii pentru a solicita ștergerea</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Trimite o cerere prin email la <a className="text-blue-600 underline" href="mailto:contact@prynt.ro">contact@prynt.ro</a> sau folosește formularul de contact.</li>
          <li>Include în cerere: numele complet, adresa de email folosită la înregistrare (dacă există), numărul comandă (dacă e cazul) și o scurtă mențiune că soliciți "ștergerea datelor".</li>
          <li>Vom verifica identitatea solicitantului — este posibil să solicităm o confirmare suplimentară pentru a evita ștergerea neautorizată.</li>
          <li>După verificare, vom procesa cererea în termen de 30 de zile și te vom notifica prin email cu rezultatul.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ce date vor fi șterse</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Date de identificare: nume, email, telefon (dacă nu sunt necesare pentru obligații legale).</li>
          <li>Datele din profilul tău de utilizator (dacă ai cont).</li>
          <li>Datele din coș sau din comenzile care nu sunt sub obligație legală de păstrare.</li>
          <li>Fișiere încărcate (dacă ne soliciți explicit ștergerea lor și nu sunt păstrate pentru facturare).</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Excepții</h2>
        <p className="text-gray-700">
          Nu putem șterge anumite date dacă există obligații legale de păstrare (de exemplu, prevederi de contabilitate sau
          documente fiscale). În aceste cazuri, vom anonimiza datele acolo unde este posibil și vom păstra doar minimul necesar
          pentru conformitate legală.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="text-gray-700 mb-2">Pentru solicitări, scrie la: <a className="text-blue-600 underline" href="mailto:contact@prynt.ro">contact@prynt.ro</a></p>
        <p className="text-gray-700">Poți folosi și numărul de telefon pentru suport: <strong>+40 750 473 111</strong></p>
        <p className="text-sm text-gray-500 mt-4">Dacă nu ești mulțumit de răspuns, ai dreptul să depui plângere la autoritatea națională de protecție a datelor (ANSPDCP).</p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-sm text-blue-600 underline">Înapoi la pagina principală</Link>
      </div>
    </main>
  );
}
