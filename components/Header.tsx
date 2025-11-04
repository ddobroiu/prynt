// components/Header.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LINKS = [
  { href: "/banner", label: "Banner" },
  { href: "/flayer", label: "Flayer" },
  { href: "/canvas", label: "Canvas" },
  { href: "/autocolante", label: "Autocolante" },
  { href: "/materiale-rigide", label: "Materiale rigide" },
];

function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" {...props} aria-hidden>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" {...props} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // blochează scroll-ul paginii când meniul e deschis
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // evită mismatch pe SSR când folosim portal
  useEffect(() => setMounted(true), []);

  const MobileMenu =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[9999] md:hidden">
            {/* overlay */}
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            {/* panou full-screen */}
            <div className="absolute inset-0 bg-[#0b0f19] flex flex-col">
              {/* top bar */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-white/10"
                style={{ paddingTop: "env(safe-area-inset-top)" }}
              >
                <Image src="/logo.png" alt="Prynt.ro" width={64} height={64} />
                <button
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 text-white"
                  onClick={() => setOpen(false)}
                  aria-label="Închide meniul"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* linkuri */}
              <nav className="px-4 py-6 overflow-y-auto">
                <ul className="space-y-3">
                  {LINKS.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="block w-full rounded-2xl px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2">
                    <a
                      href="/checkout"
                      onClick={() => setOpen(false)}
                      className="block w-full rounded-2xl px-5 py-4 bg-white text-black font-semibold text-center hover:bg-white/90"
                    >
                      Coșul meu
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="mt-auto px-4 py-4 text-xs text-white/60 border-t border-white/10">
                © {new Date().getFullYear()} Prynt.ro
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <header className="sticky top-0 z-[100] bg-[#0b0f19]/85 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Prynt.ro" width={80} height={80} priority />
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* COȘ DESKTOP */}
        <div className="hidden md:flex">
          <a
            href="/checkout"
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold hover:bg-white/90 text-sm"
          >
            Coșul meu
          </a>
        </div>

        {/* BUTON MENIU MOBIL */}
        <button
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-white/15 bg-white/5 text-white"
          aria-label="Deschide meniul"
          onClick={() => setOpen(true)}
        >
          <BurgerIcon />
        </button>
      </div>

      {/* Portal cu meniul mobil (deasupra tuturor) */}
      {MobileMenu}
    </header>
  );
}
