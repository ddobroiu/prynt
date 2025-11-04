// app/page.tsx
import Image from "next/image";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8 text-center">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Prynt.ro" width={120} height={120} className="mb-5" priority />
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Prynt.ro — Tipar rapid & calitate</h1>
          <p className="mt-3 text-white/80 max-w-2xl">
            Configurezi online, vezi prețul în timp real și primești livrarea rapid cu DPD.
          </p>
          <div className="mt-6">
            <a href="/banner" className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-black font-semibold hover:bg-white/90 transition">
              Începe cu Banner →
            </a>
          </div>
        </div>

      </section>

      {/* PRODUSE */}
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Produse disponibile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard href="/banner" title="Banner" desc="Frontlit 440/510 g/mp · opțiuni: găuri de vânt, tiv + capse." img="/products/banner/1.jpg" cta="Configurează" />
          <ProductCard href="/flayer" title="Flayer" desc="Flayere color, formate multiple și finisări profesionale." img="/products/flayer/1.jpg" cta="Vezi opțiuni" />
          <ProductCard href="/roll-up" title="Roll-Up" desc="Sisteme roll-up premium cu print inclus. Montaj rapid." img="/products/rollup/1.jpg" cta="Vezi opțiuni" />
          <ProductCard href="/canvas" title="Canvas" desc="Tablouri canvas pe șasiu de lemn, print premium." img="/products/canvas/1.jpg" cta="Vezi opțiuni" />
          <ProductCard href="/autocolante" title="Autocolante" desc="Stickere personalizate, print UV, interior/exterior." img="/products/autocolante/1.jpg" cta="Vezi opțiuni" />
          <ProductCard href="/materiale-rigide" title="Materiale rigide" desc="Forex, PVC, plexiglas, carton plume — print direct." img="/products/rigide/1.jpg" cta="Vezi opțiuni" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Despre Prynt.ro</h2>
        <p className="text-white/70 leading-relaxed">
          Suntem un centru de producție publicitară și tipar digital cu peste 10 ani de experiență.
          Oferim print de calitate pe o gamă largă de materiale — totul cu prețuri transparente și livrare rapidă.
        </p>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Ce spun clienții noștri</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Andrei P.", text: "Print impecabil, livrare rapidă. Recomand cu încredere!" },
            { name: "Mădălina S.", text: "Bannerele pentru eveniment au ieșit perfect. Mulțumesc!" },
            { name: "George T.", text: "Preț corect, suport prompt. Comand din nou!" },
          ].map((r) => (
            <div key={r.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-white/80 italic mb-3">“{r.text}”</p>
              <div className="text-white/60 text-sm">— {r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">Exemple de lucrări</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <img key={i} src={`/gallery/${i}.jpg`} alt={`Lucrare ${i}`} className="rounded-2xl border border-white/10 hover:scale-105 transition" />
          ))}
        </div>
      </section>
    </main>
  );
}
