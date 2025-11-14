"use client";
// components/Footer.tsx
// Am înlocuit Image și Link din Next.js cu tag-uri standard <img> și <a>.


export default function Footer() {
  return (
  <footer className="mt-16 bg-ui text-ui border-t border-indigo-700/40">
    <div className="w-full px-6 py-14 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Col 1 – Brand & Descriere */}
        <div className="flex flex-col items-start min-w-0">
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
          {/* Linkuri ANPC / UE – plasate sub descriere */}
          <div className="mt-6 flex flex-nowrap items-center gap-4">
            <a
              href="https://anpc.ro/ce-este-sal/"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center"
              title="Soluționarea Alternativă a Litigiilor – ANPC"
            >
              <img
                src="/250x50_icon_ANPC-SAL.webp"
                alt="ANPC – SAL"
                width={200}
                height={40}
                loading="lazy"
                className="h-10 w-[200px] object-contain border border-indigo-700/30 rounded bg-white"
              />
            </a>
            <a
              href="https://consumer-redress.ec.europa.eu/index_ro"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center"
              title="Platforma europeană SOL – Soluționarea Online a Litigiilor"
            >
              <img
                src="/250x50_icon_ANPC-SOL.webp"
                alt="UE – Platformă SOL (Soluționarea Online a Litigiilor)"
                width={200}
                height={40}
                loading="lazy"
                className="h-10 w-[200px] object-contain border border-indigo-700/30 rounded bg-white"
              />
            </a>
          </div>
        </div>

        {/* Col 2 – Contact */}
        <div className="hidden md:block min-w-0">
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
              <a className="hover:text-indigo-300 transition-colors" href="tel:+40750473111">+40 750 473 111</a>
            </li>
            <li>Program: L–V 9:00–18:00</li>
            <li className="pt-2 text-muted">Livrăm în toată România (DPD)</li>
          </ul>
        </div>

        {/* Col 3 – Newsletter */}
        <div className="min-w-0">
          <h3 className="font-bold mb-5 text-xl text-indigo-300 flex items-center gap-2">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><path d="M3 8l8 5 8-5"/><path d="M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18-3a2 2 0 00-2-2H5a2 2 0 00-2 2v0"/></svg>
            Newsletter
          </h3>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const email = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value || '';
              if (!email) return;
              fetch('/api/subscribers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, source: 'footer' }),
              })
                .then((r) => r.json())
                .then((res) => {
                  alert(res?.message || 'Verifică emailul pentru confirmare.');
                  (form.querySelector('input[name="email"]') as HTMLInputElement).value = '';
                })
                .catch(() => alert('Nu am putut trimite cererea. Încearcă din nou.'));
            }}
          >
            <input
              type="email"
              required
              name="email"
              placeholder="Emailul tău"
              className="flex-1 rounded-md border px-3 py-2 bg-surface border-[--border] text-ui focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <button
              type="submit"
              className="rounded-md px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
            >
              Abonează-mă
            </button>
          </form>
          <p className="text-xs text-muted mt-2">Primești un email de confirmare (double opt‑in).</p>
        </div>

        {/* Col 4 – Informații Legale */}
        <div className="hidden md:block min-w-0">
          <h3 className="font-bold mb-5 text-xl text-indigo-300 flex items-center gap-2">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><rect x="4" y="4" width="14" height="14" rx="2"/><path d="M8 8h8M8 12h8"/></svg>
            Info
          </h3>
          <ul className="text-base text-ui space-y-3">
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/termeni"><span>Termeni & condiții</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/confidentialitate"><span>Politica de confidențialitate</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/politica-cookies"><span>Politica Cookies</span></a></li>
            <li><a className="hover:text-indigo-300 transition-colors flex items-center gap-1" href="/blog"><span>Blog</span></a></li>
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
