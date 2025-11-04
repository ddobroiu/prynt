// app/page.tsx
// Am înlocuit importurile Next.js specifice (Image, Link) cu echivalentele HTML/React
// pentru a asigura compilarea corectă în mediul de lucru (Canvas).

// Versiunea componentei ProductCard, definită aici pentru a rezolva eroarea de import.
// Această versiune folosește stilul modernizat din fișierul ProductCard.tsx cel mai actualizat.
const ProductCard = ({ href, title, desc, img, cta }) => (
  <a 
    href={href} 
    // Stil modernizat: fundal închis, bordură de accent și umbră la hover (preluat din ProductCard.tsx)
    className="group block overflow-hidden rounded-2xl border border-indigo-700/50 bg-gray-900 
               transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10"
  >
    <div className="relative h-56 w-full">
      <img 
        src={img} 
        alt={title} 
        // Stil pentru imagine
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      {/* Suprapunere subtilă pentru contrastul textului */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
    
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-1 text-indigo-300">{title}</h3>
      <p className="mt-1 text-white/70 text-base">{desc}</p>
      
      {/* CTA (Call to Action) stilizat ca un link puternic */}
      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-600/90 text-white 
                    px-5 py-2 text-sm font-semibold hover:bg-indigo-500 transition-colors">
        {cta || "Configurează"} &rarr;
      </div>
    </div>
  </a>
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Container principal cu padding ajustat */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* HERO Section - Centered and impactful */}
        <section className="pt-20 pb-16 text-center border-b border-white/5 mb-12">
          <div className="flex flex-col items-center">
            {/* Logoul - Folosim tag-ul <img> standard */}
            <img 
              src="/logo.png" 
              alt="Prynt.ro" 
              width={140} 
              height={140} 
              className="mb-6 rounded-full shadow-lg border-2 border-indigo-500/50 transition-transform duration-300 hover:scale-[1.02]" 
              style={{ objectFit: 'contain' }} // Asigură afișarea corectă a logoului
            />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300">
              Prynt.ro — Tipar rapid & calitate premium
            </h1>
            <p className="mt-4 text-xl text-indigo-200/90 max-w-3xl font-light">
              Configurezi online, vezi prețul în timp real și primești livrarea ultra-rapid cu DPD.
            </p>
            {/* Am scos blocul div cu butonul "Începe cu Banner" */}
          </div>
        </section>

        {/* PRODUSE Section - Improved Card Grid */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-10 text-center border-b border-indigo-500/20 pb-4">Produse populare</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCard href="/banner" title="Banner" desc="Frontlit 440/510 g/mp · opțiuni: găuri de vânt, tiv + capse." img="/products/banner/1.jpg" cta="Configurează" />
            <ProductCard href="/flayer" title="Flayer" desc="Flayere color, formate multiple și finisări profesionale." img="/products/flayer/1.jpg" cta="Vezi opțiuni" />
            <ProductCard href="/roll-up" title="Roll-Up" desc="Sisteme roll-up premium cu print inclus. Montaj rapid." img="/products/rollup/1.jpg" cta="Vezi opțiuni" />
            <ProductCard href="/canvas" title="Canvas" desc="Tablouri canvas pe șasiu de lemn, print premium." img="/products/canvas/1.jpg" cta="Vezi opțiuni" />
            <ProductCard href="/autocolante" title="Autocolante" desc="Stickere personalizate, print UV, interior/exterior." img="/products/autocolante/1.jpg" cta="Vezi opțiuni" />
            <ProductCard href="/materiale-rigide" title="Materiale rigide" desc="Forex, PVC, plexiglas, carton plume — print direct." img="/products/rigide/1.jpg" cta="Vezi opțiuni" />
          </div>
        </section>

        {/* ABOUT Section - Focused Content */}
        <section className="mx-auto max-w-4xl py-16 text-center">
          <h2 className="text-3xl font-bold mb-5 text-indigo-400">Despre Prynt.ro</h2>
          <p className="text-white/70 leading-relaxed text-lg">
            Suntem un centru de producție publicitară și tipar digital cu **peste 10 ani de experiență**. 
            Oferim print de calitate pe o gamă largă de materiale — totul cu **prețuri transparente** și livrare rapidă.
            Misiunea noastră este să transformăm ideile tale în produse fizice impecabile.
          </p>
        </section>

        {/* REVIEWS Section - Refined look */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-indigo-400">Ce spun clienții noștri</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Andrei P.", text: "Print impecabil, livrare rapidă. Recomand cu încredere!" },
              { name: "Mădălina S.", text: "Bannerele pentru eveniment au ieșit perfect. Mulțumesc!" },
              { name: "George T.", text: "Preț corect, suport prompt. Comand din nou!" },
            ].map((r) => (
              <div key={r.name} className="rounded-2xl border border-indigo-700/50 bg-gray-800 p-6 shadow-xl hover:shadow-indigo-500/20 transition-all duration-300">
                <p className="text-white italic text-lg mb-4">“{r.text}”</p>
                <div className="text-indigo-400 font-semibold text-base">— {r.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Am eliminat GALLER Section - Highlighting the work */}
      </div>
      
      {/* FOOTER placeholder */}
      <footer className="w-full py-8 border-t border-white/5 mt-12 text-center text-white/50">
          <p>&copy; {new Date().getFullYear()} Prynt.ro. Toate drepturile rezervate.</p>
      </footer>
    </main>
  );
}
