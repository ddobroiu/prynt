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
      <div className="page">
        {/* BARĂ MOBIL: burger stânga · logo centru · coș dreapta (meniul rămâne ca înainte) */}
        <div className="flex items-center justify-between py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo centrat */}
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

          {/* Coș permanent (dreapta) */}
          <a
            href="/checkout"
            className="relative inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition"
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

        {/* MENIU MOBIL: panou centrat sub header, ca înainte (nu full-screen) */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
            open ? "opacity-100 max-h-[420px]" : "opacity-0 max-h-0"
          }`}
        >
          <nav className="pb-3">
            <div className="mx-auto max-w-sm">
              <div className="card p-3 shadow-xl shadow-black/30">
                <ul className="space-y-2 text-center">
                  {LINKS.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        className="block rounded-xl px-5 py-3 text-base font-semibold text-white/90 hover:bg-white/10 transition"
                        onClick={() => setOpen(false)}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* CTA coș (opțional, discret) */}
                <div className="mt-3 flex justify-center">
                  <a
                    href="/checkout"
                    className="btn-primary"
                    onClick={() => setOpen(false)}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Coșul meu
                    {isLoaded && count > 0 && (
                      <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold">
                        {count}
                      </span>
                    )}
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* DESKTOP: logo · linkuri · coș */}
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
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-white/80 hover:text-white transition"
              >
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
      className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition"
      aria-label="Coșul meu"
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