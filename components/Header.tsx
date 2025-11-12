"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
    href: "#",
    label: "Fonduri UE",
    children: [
      { href: "/fonduri-pnrr", label: "Fonduri PNRR" },
      { href: "/fonduri-regio", label: "Fonduri REGIO" },
      { href: "/fonduri-nationale", label: "Fonduri Naționale" },
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
    if (!openMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openMobile]);

  const openNow = (key: string) => {
    clearTimeout(dropdownTimers.current[key]);
    setOpenDropdown(key);
  };

  const closeSoon = (key: string) => {
    clearTimeout(dropdownTimers.current[key]);
    dropdownTimers.current[key] = setTimeout(() => {
      setOpenDropdown((cur) => (cur === key ? null : cur));
    }, 140);
  };

  return (
    <header
      className="
        sticky top-0 z-50 w-full border-b
        bg-white/70 dark:bg-slate-950/60
        border-gray-200/70 dark:border-slate-800/70
  backdrop-blur-md supports-backdrop-filter:backdrop-blur
      "
    >
      <div className="page">
        {/* MOBILE BAR: burger · actions (Shop, Theme, Cart) */}
        <div className="flex items-center justify-between py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label={openMobile ? "Închide meniul" : "Deschide meniul"}
            className="inline-flex items-center justify-center rounded-xl p-2 border border-gray-300/80 text-slate-700 hover:bg-gray-100 transition dark:border-slate-700/80 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {openMobile ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Fără logo (la cerere) */}

          <div className="flex items-center gap-2">
            {/* SHOP evidențiat, în dreapta */}
            <Link
              href="/shop"
              aria-label="Shop"
              className="
                inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold
                bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white
                shadow-lg shadow-indigo-600/20 ring-1 ring-white/10
                hover:from-indigo-500 hover:via-violet-600 hover:to-fuchsia-600
                active:scale-[0.98] transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                dark:focus-visible:ring-offset-slate-950
              "
            >
              Shop
            </Link>

            <ThemeToggle />

            <Link
              href="/checkout"
              className="relative inline-flex items-center justify-center rounded-xl p-2 border border-gray-300/80 text-slate-700 hover:bg-gray-100 transition dark:border-slate-700/80 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Coșul meu"
            >
              <ShoppingCart size={22} />
              {isLoaded && count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-lg">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE OVERLAY */}
        {openMobile && (
          <div className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 lg:hidden" aria-hidden="true" />
        )}

        {/* MOBILE NAV (card frosted) */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 relative z-50 ${
            openMobile ? "opacity-100 max-h-[78vh]" : "opacity-0 max-h-0"
          }`}
        >
          <nav className="pb-3">
            <div className="mx-auto max-w-sm">
              <div
                className="
                  rounded-2xl border border-gray-200/80 dark:border-slate-800/80
                  bg-white/80 dark:bg-slate-950/70 backdrop-blur-xl p-3 shadow-2xl
                "
              >
                <ul className="space-y-2">
                  {LINKS.map((l) =>
                    l.children ? (
                      <li key={l.label}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMobileSub((cur) => (cur === l.label ? null : l.label))
                          }
                          className="
                            w-full inline-flex items-center justify-between rounded-xl
                            border border-gray-200/80 dark:border-slate-800/80
                            bg-white/70 dark:bg-slate-950/60
                            px-3 py-2.5 text-slate-800 dark:text-slate-100
                            hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition
                          "
                          aria-expanded={openMobileSub === l.label}
                          aria-controls={`mobile-sub-${l.label.replace(/\s+/g, "-").toLowerCase()}`}
                        >
                          <span className="font-medium">{l.label}</span>
                          {openMobileSub === l.label ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <div
                          id={`mobile-sub-${l.label.replace(/\s+/g, "-").toLowerCase()}`}
                          className={`
                            grid transition-[grid-template-rows,opacity] duration-300
                            ${openMobileSub === l.label ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}
                          `}
                        >
                          <div className="overflow-hidden">
                            <ul className="pl-2.5 space-y-2">
                              {l.children.map((c) => (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    className="
                                      block rounded-lg border border-gray-200/80 dark:border-slate-800/80
                                      bg-white/70 dark:bg-slate-950/60
                                      px-3 py-2 text-sm text-slate-800 dark:text-slate-100
                                      hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition
                                    "
                                    onClick={() => setOpenMobile(false)}
                                  >
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </li>
                    ) : (
                      <li key={l.href} className="text-center">
                        <Link
                          href={l.href}
                          className="
                            block rounded-xl border border-gray-200/80 dark:border-slate-800/80
                            bg-white/70 dark:bg-slate-950/60
                            px-3 py-2.5 text-slate-800 dark:text-slate-100
                            hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition
                          "
                          onClick={() => setOpenMobile(false)}
                        >
                          {l.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* DESKTOP: 3-col grid — left (spacer), center (menu), right (actions) */}
        <div className="hidden lg:grid grid-cols-3 items-center py-3">
          {/* Left spacer (no logo) */}
          <div />

          {/* Centered menu with modern effects */}
          <nav className="justify-self-center flex items-center gap-1">
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
                    className="
                      group inline-flex items-center gap-1 rounded-xl px-4 py-2 font-semibold
                      text-slate-800 dark:text-slate-100
                      hover:bg-gray-100/60 dark:hover:bg-slate-800/60 transition
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                    "
                    onClick={() => setOpenDropdown((cur) => (cur === l.label ? null : l.label))}
                  >
                    <span className="relative">
                      {l.label}
                      <span
                        className={`
                          pointer-events-none absolute left-0 -bottom-1 h-0.5 w-full origin-left scale-x-0
                          bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600
                          transition-transform duration-300 group-hover:scale-x-100
                          ${openDropdown === l.label ? "scale-x-100" : ""}
                        `}
                      />
                    </span>
                    <ChevronDown
                      size={16}
                      className={`opacity-70 transition-transform ${openDropdown === l.label ? "rotate-180 opacity-100" : ""}`}
                    />
                  </button>

                  <div
                    role="menu"
                    className={`
                      absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-2xl
                      border border-gray-200/80 dark:border-slate-800/80
                      bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-2
                      shadow-2xl shadow-black/5 ring-1 ring-black/5
                      z-50 transition-all origin-top
                      ${openDropdown === l.label ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-95"}
                    `}
                  >
                    {l.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        role="menuitem"
                        className="
                          block rounded-xl px-4 py-2 text-[15px] font-medium
                          text-slate-800 dark:text-slate-100
                          hover:bg-gray-100/70 dark:hover:bg-slate-800/70 transition
                        "
                        onClick={() => setOpenDropdown(null)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="
                    group rounded-xl px-4 py-2 font-semibold
                    text-slate-800 dark:text-slate-100
                    hover:bg-gray-100/60 dark:hover:bg-slate-800/60 transition
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                  "
                >
                  <span className="relative">
                    {l.label}
                    <span
                      className="
                        pointer-events-none absolute left-0 -bottom-1 h-0.5 w-full origin-left scale-x-0
                        bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600
                        transition-transform duration-300 group-hover:scale-x-100
                      "
                    />
                  </span>
                </Link>
              )
            )}
          </nav>

          {/* Right actions: Shop special + Theme + Cart */}
          <div className="justify-self-end flex items-center gap-3">
            <Link
              href="/shop"
              className="
                inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold
                bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white
                shadow-lg shadow-indigo-600/20 ring-1 ring-white/10
                hover:from-indigo-500 hover:via-violet-600 hover:to-fuchsia-600
                active:scale-[0.98] transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                dark:focus-visible:ring-offset-slate-950
              "
            >
              Shop
            </Link>

            <ThemeToggle />

            <Link
              href="/checkout"
              className="
                relative inline-flex items-center justify-center rounded-xl px-4 py-2
                border border-gray-300/80 text-slate-700 hover:bg-gray-100 transition
                dark:border-slate-700/80 dark:text-slate-100 dark:hover:bg-slate-800
              "
              aria-label="Coșul meu"
            >
              <ShoppingCart size={20} />
              {isLoaded && count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-lg">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}