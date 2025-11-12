"use client";

import React, { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "./CartContext";
import { ChevronDown, ChevronRight, Menu, ShoppingCart, X } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const LINKS: NavItem[] = [
  {
    href: "/publicitar",
    label: "Publicitar",
    children: [
      { href: "/pliante", label: "Pliante" },
      { href: "/flayere", label: "Flayere" },
      { href: "/afise", label: "Afișe" },
      { href: "/autocolante", label: "Autocolante" },
    ],
  },
  {
    href: "/banner",
    label: "Banner",
    children: [
      { href: "/banner", label: "O față" },
      { href: "/banner-verso", label: "Față-verso" },
    ],
  },
  {
    href: "/decor",
    label: "Decor",
    children: [
      { href: "/canvas", label: "Canvas" },
      { href: "/tapet", label: "Tapet" },
    ],
  },
  {
    href: "/materiale-rigide",
    label: "Materiale rigide",
    children: [
      { href: "/plexiglass", label: "Plexiglas" },
      { href: "/alucobond", label: "Alucobond" },
      { href: "/carton", label: "Carton" },
      { href: "/polipropilena", label: "Polipropilenă" },
      { href: "/pvc-forex", label: "PVC Forex" },
    ],
  },
];

export default function Header() {
  const [openMobile, setOpenMobile] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const { count, isLoaded } = useCart();

  // Desktop dropdown control
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimers = useRef<Record<string, any>>({});

  useEffect(() => {
    return () => {
      Object.values(dropdownTimers.current).forEach(clearTimeout);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (openMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [openMobile]);

  const openNow = (key: string) => {
    clearTimeout(dropdownTimers.current[key]);
    setOpenDropdown(key);
  };

  const closeSoon = (key: string) => {
    clearTimeout(dropdownTimers.current[key]);
    dropdownTimers.current[key] = setTimeout(() => {
      setOpenDropdown((cur) => (cur === key ? null : cur));
    }, 120);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 shadow-md">
      <div className="page">
        {/* MOBILE BAR: burger · logo · cart */}
        <div className="flex items-center justify-between py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label={openMobile ? "Închide meniul" : "Deschide meniul"}
            className="inline-flex items-center justify-center rounded-lg p-2 border border-gray-300 text-slate-700 hover:bg-gray-100 transition dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {openMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
          <a href="/" className="inline-flex items-center gap-2 group" aria-label="Prynt.ro">
            <img src="/logo.png" alt="Prynt.ro" className="rounded-full w-14 h-14 lg:w-16 lg:h-16 shadow-lg transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <span className="sr-only">Prynt.ro</span>
          </a>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/checkout"
              className="relative inline-flex items-center justify-center rounded-lg p-2 border border-gray-300 text-slate-700 hover:bg-gray-100 transition dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Coșul meu"
            >
              <ShoppingCart size={22} />
              {isLoaded && count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-lg">
                  {count}
                </span>
              )}
            </a>
          </div>
        </div>

        {/* MOBILE NAV */}
        {openMobile && <div className="fixed inset-0 z-40 bg-white dark:bg-slate-950 lg:hidden" />}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 relative z-50 ${
            openMobile ? "opacity-100 max-h-[70vh]" : "opacity-0 max-h-0"
          }`}
        >
          <nav className="pb-3">
            <div className="mx-auto max-w-sm">
              <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 shadow-xl">
                <ul className="space-y-2">
                  

                  {LINKS.map((l) =>
                    l.children ? (
                      <li key={l.label}>
                        <button
                          type="button"
                          onClick={() => setOpenMobileSub((cur) => (cur === l.label ? null : l.label))}
                          className="w-full inline-flex items-center justify-between rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                          aria-expanded={openMobileSub === l.label}
                          aria-controls={`mobile-sub-${l.label.replace(/\s+/g, "-").toLowerCase()}`}
                        >
                          <span>{l.label}</span>
                          {openMobileSub === l.label ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <div
                          id={`mobile-sub-${l.label.replace(/\s+/g, "-").toLowerCase()}`}
                          className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                            openMobileSub === l.label ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <ul className="pl-3 space-y-2">
                              {l.children.map((c) => (
                                <li key={c.href}>
                                  <a
                                    href={c.href}
                                    className="block rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                                  >
                                    {c.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </li>
                    ) : (
                      <li key={l.href} className="text-center">
                        <a
                          href={l.href}
                          className="block rounded-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          {l.label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center justify-between py-3">
          <a href="/" className="inline-flex items-center gap-2 group" aria-label="Prynt.ro">
            <img src="/logo.png" alt="Prynt.ro" className="rounded-full w-16 h-16 lg:w-20 lg:h-20 shadow-lg transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            <span className="sr-only">Prynt.ro</span>
          </a>

          <nav className="flex items-center gap-4">
            {LINKS.map((l) =>
              l.children ? (
                <div
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => openNow(l.label)}
                  onMouseLeave={() => closeSoon(l.label)}
                  onFocus={() => openNow(l.label)}
                  onBlur={() => closeSoon(l.label)}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === l.label}
                    className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-slate-800 dark:text-slate-100 font-semibold bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    onClick={() => setOpenDropdown((cur) => (cur === l.label ? null : l.label))}
                  >
                    {l.label}
                    <ChevronDown size={16} className={`opacity-70 transition-transform ${openDropdown === l.label ? "rotate-180 opacity-100" : ""}`} />
                  </button>
                  <div
                    role="menu"
                    className={`absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl z-50 transition-all origin-top ${openDropdown === l.label ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-95"}`}
                  >
                    {l.children.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        role="menuitem"
                        className="block rounded-md px-4 py-2 text-base text-slate-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none font-medium transition"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-4 py-2 text-slate-800 dark:text-slate-100 font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                >
                  {l.label}
                </a>
              )
            )}

            
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/checkout"
              className="relative inline-flex items-center justify-center rounded-lg px-4 py-2 border border-gray-300 text-slate-700 hover:bg-gray-100 transition dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Coșul meu"
            >
              <ShoppingCart size={20} />
              {isLoaded && count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-lg">
                  {count}
                </span>
              )}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}