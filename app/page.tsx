// app/page.tsx
// Am păstrat conținutul inițial și am aplicat stilul folosit în configurator/coș (glassmorphism).
// Am înlocuit doar clasele Tailwind pentru a unifica designul și am menținut <a>/<img> pentru compatibilitate Canvas.

import React from 'react';

interface ProductCardProps {
  href: string;
  title: string;
  desc: string;
  img: string;
  cta: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ href, title, desc, img, cta }) => (
  <a
    href={href}
    className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0 shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
  >
    <div className="relative h-56 w-full">
      <img
        src={img}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold mb-1 text-white">{title}</h3>
      <p className="mt-1 text-white/70 text-base">{desc}</p>

      <span className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold btn-primary">
        {cta || 'Configurează'} →
      </span>
    </div>
  </a>
);

export default function HomePage() {
  return (
    <main className="min-h-screen text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* HERO */}
        <section className="pt-20 pb-16 text-center border-b border-white/10 mb-12">
          <div className="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Prynt.ro"
              width={140}
              height={140}
              className="mb-6 rounded-full border border-white/10 shadow-xl shadow-black/30 transition-transform duration-300 hover:scale-[1.02]"
              style={{ objectFit: 'contain' }}
            />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Prynt.ro — Tipar rapid & calitate premium
            </h1>
            <p className="mt-4 text-xl text-white/80 max-w-3xl">
              Configurezi online, vezi prețul în timp real și primești livrarea ultra-rapid cu DPD.
            </p>
          </div>
        </section>

        {/* PRODUSE */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Produse populare</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              href="/banner"
              title="Banner"
              desc="Frontlit 440/510 g/mp · opțiuni: găuri de vânt, tiv + capse."
              img="/products/banner/1.jpg"
              cta="Configurează"
            />
            <ProductCard
              href="/flayer"
              title="Flayer"
              desc="Flayere color, formate multiple și finisări profesionale."
              img="/products/flayer/1.jpg"
              cta="Vezi opțiuni"
            />
            <ProductCard
              href="/roll-up"
              title="Roll-Up"
              desc="Sisteme roll-up premium cu print inclus. Montaj rapid."
              img="/products/rollup/1.jpg"
              cta="Vezi opțiuni"
            />
            <ProductCard
              href="/canvas"
              title="Canvas"
              desc="Tablouri canvas pe șasiu de lemn, print premium."
              img="/products/canvas/1.jpg"
              cta="Vezi opțiuni"
            />
            <ProductCard
              href="/autocolante"
              title="Autocolante"
              desc="Stickere personalizate, print UV, interior/exterior."
              img="/products/autocolante/1.jpg"
              cta="Vezi opțiuni"
            />
            <ProductCard
              href="/materiale-rigide"
              title="Materiale rigide"
              desc="Forex, PVC, plexiglas, carton plume — print direct."
              img="/products/rigide/1.jpg"
              cta="Vezi opțiuni"
            />
          </div>
        </section>

        {/* DESPRE */}
        <section className="mx-auto max-w-4xl py-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/30">
            <h2 className="text-3xl font-bold mb-4">Despre Prynt.ro</h2>
            <p className="text-white/80 leading-relaxed text-lg">
              Suntem un centru de producție publicitară și tipar digital cu <strong>peste 10 ani de experiență</strong>.
              Oferim print de calitate pe o gamă largă de materiale — totul cu <strong>prețuri transparente</strong> și livrare rapidă.
              Misiunea noastră este să transformăm ideile tale în produse fizice impecabile.
            </p>
          </div>
        </section>

        {/* REVIEW-URI */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Ce spun clienții noștri</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Andrei P.', text: 'Print impecabil, livrare rapidă. Recomand cu încredere!' },
              { name: 'Mădălina S.', text: 'Bannerele pentru eveniment au ieșit perfect. Mulțumesc!' },
              { name: 'George T.', text: 'Preț corect, suport prompt. Comand din nou!' },
            ].map((r) => (
              <div
                key={r.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/30 transition"
              >
                <p className="text-white/90 italic text-lg mb-3">“{r.text}”</p>
                <div className="text-white/70 font-semibold text-sm">— {r.name}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-8 border-t border-white/10 mt-8 text-center text-white/60">
        <p>&copy; {new Date().getFullYear()} Prynt.ro. Toate drepturile rezervate.</p>
      </footer>
    </main>
  );
}