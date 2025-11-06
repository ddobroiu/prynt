"use client";

import React, { useState } from "react";
import { useCart } from "./CartProvider";
import { ShoppingCart, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/banner", label: "Banner" },
  { href: "/flayer", label: "Flayer" },
  { href: "/canvas", label: "Canvas" },
  { href: "/autocolante", label: "Autocolante" },
  { href: "/materiale-rigide", label: "Materiale rigide" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count, isLoaded } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        {/* Bara mobil: burger (stânga) + logo (centru) + coș (dreapta) */}
        <div className="flex items-center justify-between py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <a href="/" className="inline-flex items-center gap-2" aria-label="Prynt.ro">
            <img
              src="/logo.png"
              alt="Prynt.ro"
              width={36}
              height={36}
              className="rounded-full border border-white/10"
              loading="lazy"
            />
            <span className="sr-only">Prynt.ro</span>
          </a>

          <a
            href="/checkout"
            className="relative inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10"
            aria-label="Coșul meu"
          >
            <ShoppingCart size={22} />
            {isLoaded && count > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </a>
        </div>

        {/* Meniu mobil drop-down */}
        {open && (
          <nav className="lg:hidden pb-3">
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="block rounded-md px-3 py-2 text-white/90 hover:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <a
                href="/checkout"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-500"
                onClick={() => setOpen(false)}
              >
                <ShoppingCart size={18} /> Coșul meu
                {isLoaded && count > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold">
                    {count}
                  </span>
                )}
              </a>
            </div>
          </nav>
        )}

        {/* Bara desktop: logo stânga + linkuri + buton coș */}
        <div className="hidden items-center justify-between py-4 lg:flex">
          <a href="/" className="inline-flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Prynt.ro"
              width={48}
              height={48}
              className="rounded-full border border-white/10"
              loading="lazy"
            />
            <span className="text-lg font-bold tracking-tight">Prynt.ro</span>
          </a>

          <nav className="flex items-center gap-6">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-white/80 hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>

          <DesktopCartButton />
        </div>
      </div>
    </header>
  );
}

function DesktopCartButton() {
  const { count, isLoaded } = useCart();
  return (
    <a
      href="/checkout"
      className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500"
    >
      <ShoppingCart size={18} />
      Coșul meu
      {isLoaded && count > 0 && (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold">
          {count}
        </span>
      )}
    </a>
  );
}