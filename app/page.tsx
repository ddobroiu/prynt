// app/page.tsx
// Am păstrat conținutul inițial și am aplicat stilul folosit în configurator/coș (glassmorphism).
// Am înlocuit doar clasele Tailwind pentru a unifica designul și am menținut <a>/<img> pentru compatibilitate Canvas.

import React from 'react';
import { PRODUCTS } from '@/lib/products';

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
  className="group block overflow-hidden rounded-2xl border border-[--border] card-bg p-0 shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface"
  >
    <div className="relative h-56 w-full">
      <img
        src={img}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
    </div>

    <div className="p-6">
  <h3 className="text-xl font-bold mb-1 text-ui">{title}</h3>
  <p className="mt-1 text-muted text-base">{desc}</p>

      <span className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold btn-primary">
        {cta || 'Configurează'} →
      </span>
    </div>
  </a>
);

export default function HomePage() {
  // Selectăm câteva produse din shop (ex. primele 12 bannere)
  const shopItems = PRODUCTS.slice(0, 12).map((p) => {
    const category = String(p.metadata?.category ?? '').toLowerCase();
    const slug = String(p.routeSlug ?? p.slug ?? p.id);
    const price = category === 'bannere' ? 50 : (p.priceBase ?? 0);
    const image = p.images?.[0] ?? '/products/banner/1.jpg';
    const href = category === 'bannere' ? `/banner/${slug}` : `/${category}/${slug}`;
    return {
      id: p.id,
      title: p.title,
      desc: p.description ?? '',
      img: image,
      href,
      price,
    };
  });

  const CONFIG_GROUPS: { title: string; items: { title: string; href: string; image: string }[] }[] = [
    {
      title: 'Publicitar',
      items: [
        { title: 'Afișe', href: '/afise', image: '/products/afise/1.jpg' },
        { title: 'Flyer', href: '/flayere', image: '/products/flyer/1.jpg' },
        { title: 'Pliante', href: '/pliante', image: '/products/pliante/1.jpg' },
        { title: 'Autocolante', href: '/autocolante', image: '/products/autocolante/1.jpg' },
      ],
    },
    {
      title: 'Banner',
      items: [
        { title: 'Banner', href: '/banner', image: '/products/banner/1.jpg' },
        { title: 'Banner față-verso', href: '/banner-verso', image: '/products/banner/verso/1.jpg' },
      ],
    },
    {
      title: 'Decor',
      items: [
        { title: 'Canvas', href: '/canvas', image: '/products/canvas/1.jpg' },
        { title: 'Tapet', href: '/tapet', image: '/products/wallpaper/1.jpg' },
      ],
    },
    {
      title: 'Materiale rigide',
      items: [
        { title: 'Plexiglas', href: '/plexiglass', image: '/products/plexiglass/1.jpg' },
        { title: 'Alucobond', href: '/alucobond', image: '/products/alucobond/1.jpg' },
        { title: 'Carton', href: '/carton', image: '/products/carton/1.jpg' },
        { title: 'Polipropilenă', href: '/polipropilena', image: '/products/polipropilena/1.jpg' },
        { title: 'PVC Forex', href: '/pvc-forex', image: '/products/PVC-Forex/1.jpg' },
      ],
    },
  ];

  return (
  <main className="min-h-screen text-ui bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* HERO */}
  <section className="pt-20 pb-16 text-center border-b border-[--border] mb-12">
          <div className="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Prynt.ro"
              width={140}
              height={140}
              className="mb-6 rounded-full border border-[--border] shadow-xl shadow-black/30 transition-transform duration-300 hover:scale-[1.02]"
              style={{ objectFit: 'contain' }}
            />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Prynt.ro — Tipar rapid & calitate premium
            </h1>
            <p className="mt-4 text-xl text-muted max-w-3xl">
              Configurezi online, vezi prețul în timp real și primești livrarea ultra-rapid cu DPD.
            </p>
          </div>
        </section>

        {/* CONFIGURATOARE RAPIDE */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4 text-ui text-center">Configurează direct</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { title: 'Afișe', href: '/afise', image: '/products/afise/1.jpg', badge: 'Publicitar' },
              { title: 'Flyer', href: '/flayere', image: '/products/flyer/1.jpg', badge: 'Publicitar' },
              { title: 'Pliante', href: '/pliante', image: '/products/pliante/1.jpg', badge: 'Publicitar' },
              { title: 'Autocolante', href: '/autocolante', image: '/products/autocolante/1.jpg', badge: 'Publicitar' },
              { title: 'Banner', href: '/banner', image: '/products/banner/1.jpg', badge: 'Banner' },
              { title: 'Banner față-verso', href: '/banner-verso', image: '/products/banner/verso/1.jpg', badge: 'Banner' },
              { title: 'Canvas', href: '/canvas', image: '/products/canvas/1.jpg', badge: 'Decor' },
              { title: 'Tapet', href: '/tapet', image: '/products/wallpaper/1.jpg', badge: 'Decor' },
              { title: 'Plexiglas', href: '/plexiglass', image: '/products/plexiglass/1.jpg', badge: 'Materiale rigide' },
              { title: 'Alucobond', href: '/alucobond', image: '/products/alucobond/1.jpg', badge: 'Materiale rigide' },
              { title: 'Carton', href: '/carton', image: '/products/carton/1.jpg', badge: 'Materiale rigide' },
              { title: 'Polipropilenă', href: '/polipropilena', image: '/products/polipropilena/1.jpg', badge: 'Materiale rigide' },
              { title: 'PVC Forex', href: '/pvc-forex', image: '/products/PVC-Forex/1.jpg', badge: 'Materiale rigide' },
            ].map((c) => (
              <article key={c.href} className="group rounded-2xl overflow-hidden border border-[--border] card-bg shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <a href={c.href} className="block" aria-label={`Deschide configurator ${c.title}`}>
                  <div className="relative" style={{ height: 180 }}>
                    <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                    {c.badge && (
                      <span className="absolute left-3 top-3 badge bg-black/70 text-white backdrop-blur-sm">{c.badge}</span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-between gap-3">
                    <h3 className="text-ui font-semibold truncate">{c.title}</h3>
                    <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-white text-sm font-semibold shadow hover:bg-indigo-500">Configurează</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* CONFIGURATOARE PE CATEGORII */}
        <section className="py-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-ui">Configurează direct</h2>
          <div className="space-y-8">
            {CONFIG_GROUPS.map((group) => (
              <div key={group.title}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-ui">{group.title}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {group.items.map((c) => (
                    <article key={c.href} className="group rounded-2xl overflow-hidden border border-[--border] card-bg shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                      <a href={c.href} className="block" aria-label={`Deschide configurator ${c.title}`}>
                        <div className="relative" style={{ height: 180 }}>
                          <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
                          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                        <div className="p-4 flex items-center justify-between gap-3">
                          <h4 className="text-ui font-semibold truncate">{c.title}</h4>
                          <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-white text-sm font-semibold shadow hover:bg-indigo-500">Configurează</span>
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DIN SHOP */}
        <section className="py-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-ui">Din Shop</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shopItems.map((p) => (
              <a key={p.id} href={p.href} className="group block overflow-hidden rounded-2xl border border-[--border] card-bg shadow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative" style={{ height: 200 }}>
                  <img src={p.img} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-ui">{p.title}</h3>
                  {p.desc ? <p className="text-sm text-muted mt-1 line-clamp-2">{p.desc}</p> : null}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-indigo-400 font-bold">De la {Number(p.price).toFixed(0)} RON</span>
                    <span className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-white text-sm font-semibold shadow hover:bg-indigo-500">Configurează</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* DESPRE */}
        <section className="mx-auto max-w-4xl py-16 text-center">
          <div className="rounded-2xl border border-[--border] card-bg p-6 shadow-xl shadow-black/30">
            <h2 className="text-3xl font-bold mb-4 text-ui">Despre Prynt.ro</h2>
            <p className="text-muted leading-relaxed text-lg">
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
                className="rounded-2xl border border-[--border] card-bg p-6 shadow-xl shadow-black/30 transition"
              >
                <p className="text-ui italic text-lg mb-3">“{r.text}”</p>
                <div className="text-muted font-semibold text-sm">— {r.name}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-8 border-t border-[--border] mt-8 text-center text-muted">
        <p>&copy; {new Date().getFullYear()} Prynt.ro. Toate drepturile rezervate.</p>
      </footer>
    </main>
  );
}