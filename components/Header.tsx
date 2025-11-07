"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCart } from "./CartProvider";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const LINKS: NavItem[] = [
  {
    href: "/banner",
    label: "Banner",
    children: [
      { href: "/banner", label: "O față" },
      { href: "/banner-verso", label: "Față-verso" },
    ],
  },
  { href: "/flayere", label: "Flayere" },
  { href: "/canvas", label: "Canvas" },
  { href: "/autocolante", label: "Autocolante" },
  { href: "/materiale-rigide", label: "Materiale rigide" },
];

export default function Header() {
  const [openMobile, setOpenMobile] = useState(false);
  const [openBannerMobile, setOpenBannerMobile] = useState(false);
  const { count, isLoaded } = useCart();

  // Desktop dropdown control
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimers = useRef<Record<string, any>>({});

  useEffect(() => {
    return () => {
      Object.values(dropdownTimers.current).forEach(clearTimeout);
    };
  }, []);

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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur">
      <div className="page">
        {/* BARĂ MOBIL: burger · logo · coș */}
        <div className="flex items-center justify-between py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label={openMobile ? "Închide meniul" : "Deschide meniul"}
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 transition"
          >
            {openMobile ? <X size={22} /> : <Menu size={22} />}
          </button>

          <a
            href="/"
            className="inline-flex items-center gap-2"
            aria-label="Prynt.ro"
          >
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

        {/* MENIU MOBIL */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
            openMobile ? "opacity-100 max-h-[600px]" : "opacity-0 max-h-0"
          }`}
        >
          <nav className="pb-3">
            <div className="mx-auto max-w-sm">
              <div className="card p-3 shadow-xl shadow-black/30">
                <ul className="space-y-2">
                  {LINKS.map((l) =>
                    l.children ? (
                      <li key={l.label}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenBannerMobile((v) => !v)
                          }
                          className="w-full inline-flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10"
                          aria-expanded={openBannerMobile}
                          aria-controls="mobile-banner-sub"
                        >
                          <span>{l.label}</span>
                          {openBannerMobile ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                        <div
                          id="mobile-banner-sub"
                          className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                            openBannerMobile
                              ? "grid-rows-[1fr] opacity-100 mt-2"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <ul className="pl-3 space-y-2">
                              {l.children.map((c) => (
                                <li key={c.href}>
                                  <a
                                    href={c.href}
                                    className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
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
                          className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
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

        {/* MENIU DESKTOP */}
        <div className="hidden lg:flex items-center justify-between py-3">
          <a
            href="/"
            className="inline-flex items-center gap-2"
            aria-label="Prynt.ro"
          >
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

            {/* Desktop nav */}
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
                    className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    onClick={() =>
                      setOpenDropdown((cur) =>
                        cur === l.label ? null : l.label
                      )
                    }
                  >
                    {l.label}
                    <ChevronDown
                      size={16}
                      className={`opacity-70 transition-transform ${
                        openDropdown === l.label ? "rotate-180 opacity-100" : ""
                      }`}
                    />
                  </button>
                  <div
                    role="menu"
                    className={`absolute left-0 mt-2 w-48 rounded-md border border-white/10 bg-[#0b0f19] p-2 shadow-xl z-50 transition-all origin-top ${
                      openDropdown === l.label
                        ? "opacity-100 scale-100"
                        : "opacity-0 pointer-events-none scale-95"
                    }`}
                  >
                    {l.children.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        role="menuitem"
                        className="block rounded-md px-3 py-2 text-sm text-white hover:bg-white/10 focus:bg-white/10 focus:outline-none"
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
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  {l.label}
                </a>
              )
            )}
          </nav>

          <a
            href="/checkout"
            className="relative inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            aria-label="Coșul meu"
          >
            <ShoppingCart size={20} />
            {isLoaded && count > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}