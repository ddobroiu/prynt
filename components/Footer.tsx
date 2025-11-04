import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0a0d14] text-white">
      {/* Conținut principal */}
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        {/* Col 1 – Brand */}
        <div>
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="Prynt.ro"
              width={80}
              height={80}
              className="rounded"
              priority
            />
          </Link>
          <p className="mt-3 text-sm text-white/70">
            Tipar digital & producție publicitară: bannere, flayere, canvas,
            autocolante și materiale rigide. Calitate, viteză și preț corect —
            totul online.
          </p>
        </div>

        {/* Col 2 – Contact */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Contact</h3>
          <ul className="text-sm text-white/80 space-y-1">
            <li>
              Email:{" "}
              <a
                className="underline hover:text-white"
                href="mailto:contact@prynt.ro"
              >
                contact@prynt.ro
              </a>
            </li>
            <li>
              Tel:{" "}
              <a
                className="underline hover:text-white"
                href="tel:+40734123456"
              >
                +40 734 123 456
              </a>
            </li>
            <li>Program: L–V 9:00–18:00</li>
            <li>Livrăm în toată România (DPD)</li>
          </ul>
        </div>

        {/* Col 3 – Linkuri utile */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Linkuri utile</h3>
          <ul className="text-sm text-white/80 space-y-2">
            <li>
              <Link className="hover:text-white" href="/banner">
                Banner
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/flayer">
                Flayer
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/canvas">
                Canvas
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/autocolante">
                Autocolante
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/materiale-rigide">
                Materiale rigide
              </Link>
            </li>
            <li className="pt-2">
              <Link
                className="hover:text-white underline"
                href="/termeni"
              >
                Termeni & condiții
              </Link>
              {" · "}
              <Link
                className="hover:text-white underline"
                href="/confidentialitate"
              >
                Politica de confidențialitate
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bară de jos */}
      <div className="border-t border-white/10 py-3 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Prynt.ro — Toate drepturile rezervate.
      </div>
    </footer>
  );
}
