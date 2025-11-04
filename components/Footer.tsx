// components/Footer.tsx
// Am înlocuit Image și Link din Next.js cu tag-uri standard <img> și <a>.

export default function Footer() {
  return (
    // Folosim o clasă consistentă cu fundalul închis
    <footer className="mt-16 bg-gray-950 text-white border-t border-indigo-700/50">
      {/* Conținut principal */}
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-4">
        {/* Col 1 – Brand & Descriere */}
        <div className="md:col-span-1">
          <a href="/" className="inline-flex items-center">
            {/* Înlocuit <Image> cu <img> */}
            <img
              src="/logo.png"
              alt="Prynt.ro"
              width={80}
              height={80}
              className="rounded-full border border-white/10"
              loading="lazy"
            />
          </a>
          <p className="mt-4 text-sm text-white/70 max-w-xs">
            Tipar digital & producție publicitară: bannere, flayere, canvas,
            autocolante și materiale rigide. Calitate, viteză și preț corect.
          </p>
        </div>

        {/* Col 2 – Contact */}
        <div>
          <h3 className="font-bold mb-4 text-xl text-indigo-400">Contact</h3>
          <ul className="text-sm text-white/80 space-y-2">
            <li>
              Email:{" "}
              <a
                className="hover:text-indigo-300 transition-colors"
                href="mailto:contact@prynt.ro"
              >
                contact@prynt.ro
              </a>
            </li>
            <li>
              Tel:{" "}
              <a
                className="hover:text-indigo-300 transition-colors"
                href="tel:+40734123456"
              >
                +40 734 123 456
              </a>
            </li>
            <li>Program: L–V 9:00–18:00</li>
            <li className="pt-2 text-white/50">Livrăm în toată România (DPD)</li>
          </ul>
        </div>

        {/* Col 3 – Produse */}
        <div>
          <h3 className="font-bold mb-4 text-xl text-indigo-400">Produse</h3>
          <ul className="text-sm text-white/80 space-y-2">
            <li>
              <a className="hover:text-indigo-300 transition-colors" href="/banner">
                Banner
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-300 transition-colors" href="/flayer">
                Flayer
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-300 transition-colors" href="/canvas">
                Canvas
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-300 transition-colors" href="/autocolante">
                Autocolante
              </a>
            </li>
            <li>
              <a className="hover:text-indigo-300 transition-colors" href="/materiale-rigide">
                Materiale rigide
              </a>
            </li>
          </ul>
        </div>
        
        {/* Col 4 – Informații Legale */}
        <div>
          <h3 className="font-bold mb-4 text-xl text-indigo-400">Info</h3>
          <ul className="text-sm text-white/80 space-y-2">
             <li>
              <a
                className="hover:text-indigo-300 transition-colors"
                href="/termeni"
              >
                Termeni & condiții
              </a>
            </li>
            <li>
              <a
                className="hover:text-indigo-300 transition-colors"
                href="/confidentialitate"
              >
                Politica de confidențialitate
              </a>
            </li>
            <li>
              <a
                className="hover:text-indigo-300 transition-colors"
                href="/politica-cookies"
              >
                Politica Cookies
              </a>
            </li>
            <li>
              <a
                className="hover:text-indigo-300 transition-colors"
                href="/contact"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bară de jos */}
      <div className="border-t border-indigo-700/50 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Prynt.ro — Toate drepturile rezervate.
      </div>
    </footer>
  );
}
