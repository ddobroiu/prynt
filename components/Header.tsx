"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...props} aria-hidden>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...props} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const LINKS = [
  { href: "/banner", label: "Banner" },
  { href: "/flayer", label: "Flayer" },
  { href: "/canvas", label: "Canvas" },
  { href: "/autocolante", label: "Autocolante" },
  { href: "/materiale-rigide", label: "Materiale rigide" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="border-b border-white/10 bg-[#0b0f19]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Prynt.ro" width={80} height={80} priority />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Coș desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/checkout"
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-white/90 text-sm"
          >
            Coșul meu
          </a>
        </div>

        {/* Buton meniu mobil */}
        <button
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-white/15 bg-white/5 text-white"
          aria-label="Deschide meniul"
          onClick={() => setOpen(true)}
        >
          <BurgerIcon />
        </button>
      </div>

      {/* Overlay + Drawer mobil */}
      {open && (
        <>
          <button
            aria-label="Închide meniul"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed right-0 top-0 h-full w-80 max-w-[85%] bg-[#0b0f19] border-l border-white/10 z-50 md:hidden animate-slide-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
              <Image src="/logo.png" alt="Prynt.ro" width={60} height={60} />
              <button
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-white"
                onClick={() => setOpen(false)}
                aria-label="Închide"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block w-full rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10"
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href="/checkout"
                    className="block w-full rounded-xl px-4 py-3 bg-white text-black font-semibold text-center hover:bg-white/90"
                    onClick={() => setOpen(false)}
                  >
                    Coșul meu
                  </a>
                </li>
              </ul>
            </nav>

            <div className="mt-auto p-4 text-xs text-white/60 border-t border-white/10">
              © {new Date().getFullYear()} Prynt.ro
            </div>
          </div>
        </>
      )}
    </header>
  );
}
