import React from 'react';

type Review = {
  id: string;
  author: string;
  rating: number; // 1-5
  title: string;
  body: string;
  date: string;
  productSlug?: string;
};

const SAMPLE_REVIEWS: Review[] = [
  { id: 'r1', author: 'Ioana M.', rating: 5, title: '[EXEMPLU / TEST] Banner excelent', body: 'Material premium, culori vii și finisaje foarte bune. Montaj simplu.', date: '2025-11-01', productSlug: 'banner' },
  { id: 'r2', author: 'Andrei P.', rating: 4, title: '[EXEMPLU / TEST] Foarte bun', body: 'Produsul arată bine, livrare punctuală. Marginea ar putea fi puțin mai fină.', date: '2025-10-28', productSlug: 'banner' },
  { id: 'r3', author: 'Maria S.', rating: 5, title: '[EXEMPLU / TEST] Recomand', body: 'Design-ul personalizat a fost respectat 1:1. Rezistent la vânt.', date: '2025-09-15', productSlug: 'banner' },
  { id: 'r4', author: 'Dan C.', rating: 3, title: '[EXEMPLU / TEST] OK pentru promoții', body: 'Calitate decentă, dar nu pentru utilizare pe termen lung în exterior.', date: '2025-08-10', productSlug: 'banner' },
  { id: 'r5', author: 'Elena V.', rating: 5, title: '[EXEMPLU / TEST] Serviciu excelent', body: 'Echipa m-a ajutat cu ajustările la fișier și totul a venit perfect.', date: '2025-07-22', productSlug: 'banner' },
  { id: 'r6', author: 'Bogdan T.', rating: 4, title: '[EXEMPLU / TEST] Bun raport calitate/preț', body: 'Preț corect și material solid. Ar fi utilă o opțiune de proof final.', date: '2025-06-30', productSlug: 'banner' },
  { id: 'r7', author: 'Raluca I.', rating: 5, title: '[EXEMPLU / TEST] Perfect pentru evenimente', body: 'Am folosit bannerul la un eveniment și arăta foarte bine — foarte vizibil.', date: '2025-05-14', productSlug: 'banner' },
  { id: 'r8', author: 'Mihai L.', rating: 2, title: '[EXEMPLU / TEST] Așteptam mai mult', body: 'Materialul pare sub așteptări pentru expunere permanentă; recomand doar promoții.', date: '2025-04-02', productSlug: 'banner' },
  { id: 'r9', author: 'Cristina Z.', rating: 4, title: '[EXEMPLU / TEST] Culori bune', body: 'Contrast și culori foarte bune. Livrarea a întârziat ușor.', date: '2025-03-18', productSlug: 'banner' },
  { id: 'r10', author: 'Alex F.', rating: 5, title: '[EXEMPLU / TEST] Experiență foarte bună', body: 'Montaj facil, capse bine poziționate și material robust. Recomand!', date: '2025-02-05', productSlug: 'banner' },
];

export default function ReviewPreview({ productSlug = 'banner', limit = 10 }: { productSlug?: string; limit?: number }) {
  const reviews = SAMPLE_REVIEWS.filter(r => r.productSlug === productSlug).slice(0, limit);

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold">Recenzii de test (EXEMPLU)</h3>
      <p className="text-sm text-gray-500">Aceste recenzii sunt pentru dezvolare/demo — nu sunt recenzii reale.</p>
      <div className="grid gap-4">
        {reviews.map(r => (
          <article key={r.id} className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{r.author} <span className="text-xs text-gray-400">· {r.date}</span></p>
                <p className="text-xs text-gray-500">{r.title}</p>
              </div>
              <div className="text-yellow-500 font-bold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < r.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{r.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
