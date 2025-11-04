// components/Header.tsx
"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Am înlocuit importurile Next.js (Image, Link) cu echivalentele HTML/React (<a>, <img>)
// și am eliminat importurile Next.js pentru a asigura compilarea corectă în mediu.

const LINKS = [
  { href: "/banner", label: "Banner" },
  { href: "/flayer", label: "Flayer" },
  { href: "/canvas", label: "Canvas" },
  { href: "/autocolante", label: "Autocolante" },
  { href: "/materiale-rigide", label: "Materiale rigide" },
];

// Icon pentru coșul de cumpărături
function CartIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

function BurgerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" {...props} aria-hidden>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon(props) {
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
            <div className="absolute inset-0 bg-gray-950 flex flex-col">
              {/* top bar */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-white/10"
                style={{ paddingTop: "env(safe-area-inset-top)" }}
              >
                {/* Logo Mobile */}
                <img src="/logo.png" alt="Prynt.ro" width={64} height={64} />
                <button
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 text-white border border-white/10"
                  onClick={() => setOpen(false)}
                  aria-label="Închide meniul"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* linkuri */}
              <nav className="px-4 py-6 overflow-y-auto flex-1">
                <ul className="space-y-3">
                  {LINKS.map((l) => (
                    <li key={l.href}>
                      <a // Folosim <a> în loc de Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="block w-full rounded-xl px-5 py-3 bg-white/5 hover:bg-indigo-600/20 border border-white/10 text-white text-lg font-medium transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                  <li className="pt-4">
                    <a // Folosim <a> în loc de Link
                      href="/checkout"
                      onClick={() => setOpen(false)}
                      className="block w-full rounded-xl px-5 py-4 bg-indigo-600 text-white font-bold text-center hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <CartIcon />
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
    // Header cu fundal semitransparent și blur
    <header className="sticky top-0 z-[100] bg-gray-950/85 backdrop-blur-md border-b border-indigo-700/50">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <a href="/" className="flex items-center">
          {/* Folosim <img> în loc de Image */}
          <img src="/logo.png" alt="Prynt.ro" width={64} height={64} style={{ objectFit: 'contain' }} />
        </a>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-base text-white/80">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="font-medium hover:text-indigo-400 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* COȘ DESKTOP */}
        <div className="hidden md:flex">
          <a
            href="/checkout"
            className="px-5 py-2.5 rounded-full bg-indigo-600 text-white font-semibold 
                       hover:bg-indigo-500 transition-colors text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/30"
          >
            <CartIcon />
            Coșul meu
          </a>
        </div>

        {/* BUTON MENIU MOBIL */}
        <button
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-white"
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
