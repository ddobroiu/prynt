// components/Footer.tsx
// Am înlocuit Image și Link din Next.js cu tag-uri standard <img> și <a>.


export default function Footer() {
  return (
  <footer className="mt-16 bg-ui text-ui border-t border-indigo-700/40">
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-12 md:grid-cols-4">
        {/* Col 1 – Brand & Descriere */}
        <div className="md:col-span-1 flex flex-col items-start">
          <a href="/" className="inline-flex items-center group">
            <img
              src="/logo.png"
              alt="Prynt.ro"
              width={96}
              height={96}
              className="rounded-full border-2 border-indigo-400 shadow-lg group-hover:scale-105 group-hover:shadow-indigo-400/30 transition-transform duration-300"
              loading="lazy"
            />
          </a>
          <p className="mt-5 text-base text-muted max-w-xs font-light">
            Tipar digital & producție publicitară: bannere, flayere, canvas, autocolante și materiale rigide. Calitate, viteză și preț corect.
          </p>
        </div>

        {/* Col 2 – Contact */}
        <div>
          <h3 className="font-bold mb-5 text-xl text-indigo-300 flex items-center gap-2">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><circle cx="11" cy="11" r="10"/><path d="M7 11h6M11 7v6"/></svg>
            Contact
          </h3>
          <ul className="text-base text-ui space-y-3">
            <li>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-2 align-middle"><path d="M2 4v8a2 2 0 002 2h8a2 2 0 002-2V4"/><path d="M2 4l6 5 6-5"/></svg>
              <a className="hover:text-indigo-300 transition-colors" href="mailto:contact@prynt.ro">contact@prynt.ro</a>
            </li>
            <li>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="inline mr-2 align-middle"><path d="M3 5a4 4 0 018 0c0 2.5-2 4.5-4 4.5S3 7.5 3 5z"/><path d="M11 11v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2"/></svg>
              <a className="hover:text-indigo-300 transition-colors" href="tel:+40734123456">+40 734 123 456</a>
            </li>
            <li>Program: L–V 9:00–18:00</li>
            <li className="pt-2 text-muted">Livrăm în toată România (DPD)</li>
          </ul>
        </div>

        {/* Col 3 – Produse */}
        <div>
          <h3 className="font-bold mb-5 text-xl text-indigo-300 flex items-center gap-2">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><rect x="3" y="7" width="16" height="8" rx="2"/><path d="M3 7V5a2 2 0 012-2h10a2 2 0 012 2v2"/></svg>
            Produse
          </h3>
          <ul className="text-base text-ui space-y-3">
            <li className="pt-0.5 text-indigo-300/90 font-semibold">Fonduri UE</li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/fonduri-pnrr"><span>Fonduri PNRR</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/fonduri-regio"><span>Fonduri REGIO</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/fonduri-nationale"><span>Fonduri Naționale</span></a></li>
            <li className="pt-2 text-indigo-300/90 font-semibold">Publicitar</li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/banner"><span>Banner</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/flayere"><span>Flayere</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/canvas"><span>Canvas</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/autocolante"><span>Autocolante</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/materiale-rigide"><span>Materiale rigide</span></a></li>
          </ul>
        </div>

        {/* Col 4 – Informații Legale */}
        <div>
          <h3 className="font-bold mb-5 text-xl text-indigo-300 flex items-center gap-2">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><rect x="4" y="4" width="14" height="14" rx="2"/><path d="M8 8h8M8 12h8"/></svg>
            Info
          </h3>
          <ul className="text-base text-ui space-y-3">
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/termeni"><span>Termeni & condiții</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/confidentialitate"><span>Politica de confidențialitate</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/politica-cookies"><span>Politica Cookies</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/contact"><span>Contact</span></a></li>
          </ul>
        </div>
      </div>

      {/* Bară de jos */}
  <div className="border-t border-indigo-700/40 py-5 text-center text-sm text-muted font-medium tracking-wide bg-indigo-950/60">
        © {new Date().getFullYear()} Prynt.ro — Toate drepturile rezervate.
      </div>
    </footer>
  );
}
