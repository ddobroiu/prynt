"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "./CartContext";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  ShoppingCart,
  X,
  User,
  Layers,
  Star,
  Image,
  Tag,
  LayoutGrid,
} from "lucide-react";
import { useSession } from "next-auth/react";

type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const LINKS: (NavItem & { icon?: React.ReactNode })[] = [
  {
    href: "/publicitar",
    label: "Publicitar",
    icon: <Tag size={16} className="mr-1" />,
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
    icon: <Star size={16} className="mr-1" />,
    children: [
      { href: "/fonduri-pnrr", label: "Fonduri PNRR" },
      { href: "/fonduri-regio", label: "Fonduri REGIO" },
      { href: "/fonduri-nationale", label: "Fonduri Naționale" },
    ],
  },
  {
    href: "/banner",
    label: "Banner",
    icon: <Layers size={16} className="mr-1" />,
    children: [
      { href: "/banner", label: "O față" },
      { href: "/banner-verso", label: "Față-verso" },
    ],
  },
  {
    href: "/decor",
    label: "Decor",
    icon: <Image size={16} className="mr-1" />,
    children: [
      { href: "/canvas", label: "Canvas" },
      { href: "/tapet", label: "Tapet" },
    ],
  },
  {
    href: "/materiale-rigide",
    label: "Materiale rigide",
    icon: <LayoutGrid size={16} className="mr-1" />,
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { count, isLoaded } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    if (!openMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openMobile]);

  const toggleMobileSub = (label: string) => {
    setOpenMobileSub((cur) => (cur === label ? null : label));
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown((cur) => (cur === label ? null : label));
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setOpenMobile(false);
    setOpenMobileSub(null);
  };

  return (
    <header
      className="
        sticky top-0 z-80 w-full border-b
        bg-white/70 dark:bg-slate-950/60
        border-gray-200/70 dark:border-slate-800/70
        backdrop-blur-md supports-backdrop-filter:backdrop-blur
      "
    >
      <div className="page">
        {/* MOBILE BAR */}
        <div className="flex items-center justify-between py-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label={openMobile ? "Închide meniul" : "Deschide meniul"}
            className="inline-flex items-center justify-center rounded-xl p-2 border border-gray-300/80 text-slate-700 hover:bg-gray-100 transition dark:border-slate-700/80 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {openMobile ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="text-xs font-semibold text-slate-700 dark:text-slate-100 tracking-tight uppercase">
            Prynt.ro
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* Auth icon only */}
            {session?.user ? (
              <Link
                href="/account"
                aria-label="Contul meu"
                className="inline-flex items-center justify-center rounded-full p-1.5 text-slate-700 hover:bg-gray-100 transition dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <User size={18} />
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Autentificare"
                className="inline-flex items-center justify-center rounded-full p-1.5 text-slate-700 hover:bg-gray-100 transition dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <User size={18} />
              </Link>
            )}

            <Link
              href="/checkout"
              className="relative inline-flex items-center justify-center rounded-full p-1.5 border border-transparent text-slate-700 hover:bg-gray-100 transition dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Coșul meu"
            >
              <ShoppingCart size={18} />
              {isLoaded && count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE OVERLAY */}
        {openMobile && (
          <div
            className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 lg:hidden"
            aria-hidden="true"
            onClick={closeAll}
          />
        )}

        {/* MOBILE NAV */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 relative z-50 ${
            openMobile ? "opacity-100 max-h-[80vh]" : "opacity-0 max-h-0"
          }`}
        >
          <nav className="pb-3">
            <div className="mx-auto max-w-sm">
              <div
                className="
                  rounded-2xl border border-gray-200/80 dark:border-slate-800/80
                  bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl p-3 shadow-2xl
                "
              >
                <ul className="space-y-2">
                  {/* SHOP compact */}
                  <li key="shop-mobile">
                    <Link
                      href="/shop"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-3 py-2 text-xs font-semibold text-white shadow-md hover:from-indigo-500 hover:via-violet-600 hover:to-fuchsia-600 transition"
                      onClick={closeAll}
                    >
                      <ShoppingCart size={14} />
                      <span>Shop</span>
                    </Link>
                  </li>

                  {LINKS.map((l) =>
                    l.children ? (
                      <li key={l.label}>
                        <button
                          type="button"
                          onClick={() => toggleMobileSub(l.label)}
                          className="
                            w-full inline-flex items-center justify-between rounded-xl
                            border border-gray-200/80 dark:border-slate-800/80
                            bg-white/80 dark:bg-slate-950/70
                            px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-100
                            hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition
                          "
                          aria-expanded={openMobileSub === l.label}
                          aria-controls={`mobile-sub-${l.label.replace(/\s+/g, "-").toLowerCase()}`}
                        >
                          <span className="inline-flex items-center gap-1">
                            {l.icon}
                            {l.label}
                          </span>
                          {openMobileSub === l.label ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </button>
                        <div
                          id={`mobile-sub-${l.label
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          className={`
                            grid transition-[grid-template-rows,opacity] duration-300
                            ${
                              openMobileSub === l.label
                                ? "grid-rows-[1fr] opacity-100 mt-1.5"
                                : "grid-rows-[0fr] opacity-0"
                            }
                          `}
                        >
                          <div className="overflow-hidden">
                            <ul className="pl-2 space-y-1.5">
                              {l.children.map((c) => (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    className="
                                      block rounded-lg border border-gray-200/80 dark:border-slate-800/80
                                      bg-white/80 dark:bg-slate-950/70
                                      px-3 py-1.5 text-[11px] text-slate-800 dark:text-slate-100
                                      hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition
                                    "
                                    onClick={closeAll}
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
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="
                            block rounded-xl border border-gray-200/80 dark:border-slate-800/80
                            bg-white/80 dark:bg-slate-950/70
                            px-3 py-2 text-xs text-slate-800 dark:text-slate-100
                            hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition
                          "
                          onClick={closeAll}
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

        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center py-2.5">
          {/* LEFT (logo / spațiu) */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 px-2.5 py-1 shadow-sm"
            >
              <span className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
              <span className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                Prynt.ro
              </span>
            </Link>
          </div>

          {/* CENTER NAV compact */}
          <nav className="justify-self-center flex items-center gap-1.5">
            {LINKS.map((l) =>
              l.children ? (
                <div
                  key={l.label}
                  className="relative"
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === l.label}
                    className={`
                      group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
                      text-xs font-semibold text-slate-800 dark:text-slate-100
                      border border-transparent bg-white/60 dark:bg-slate-900/60
                      shadow-sm hover:border-indigo-400/60 hover:bg-white dark:hover:bg-slate-900
                      transition-all duration-200
                    `}
                    onClick={() => handleDropdownToggle(l.label)}
                  >
                    {l.icon}
                    <span className="relative">
                      {l.label}
                      <span
                        className={`
                          absolute left-0 -bottom-0.5 h-0.5 w-full rounded-full
                          bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500
                          transition-all duration-200 origin-left
                          ${
                            openDropdown === l.label
                              ? "scale-x-100 opacity-100"
                              : "scale-x-0 opacity-0"
                          }
                        `}
                      />
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        openDropdown === l.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    role="menu"
                    className={`
                      absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-2xl
                      border border-gray-200/80 dark:border-slate-800/80
                      bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-2.5 shadow-2xl
                      z-120 transition-all origin-top
                      ${
                        openDropdown === l.label
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-95 pointer-events-none"
                      }
                    `}
                  >
                    <div className="flex flex-col gap-1">
                      {l.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          role="menuitem"
                          className="
                            inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium
                            border border-transparent
                            text-slate-800 dark:text-slate-100
                            hover:bg-slate-50 dark:hover:bg-slate-900
                            hover:border-indigo-400/60
                            transition-all duration-150
                          "
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-[10px] font-semibold text-white/90">
                            {c.label.charAt(0)}
                          </span>
                          <span>{c.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="
                    group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
                    text-xs font-semibold text-slate-800 dark:text-slate-100
                    border border-transparent bg-white/60 dark:bg-slate-900/60
                    shadow-sm hover:border-indigo-400/60 hover:bg-white dark:hover:bg-slate-900
                    transition-all duration-200
                  "
                >
                  {l.icon}
                  <span className="relative">
                    {l.label}
                    <span className="absolute left-0 -bottom-0.5 h-0.5 w-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-200 origin-left scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100" />
                  </span>
                </Link>
              )
            )}
          </nav>

          {/* RIGHT ACTIONS compact */}
          <div className="justify-self-end flex items-center gap-2.5">
            <ThemeToggle />

            {/* Auth = icon only */}
            {session?.user ? (
              <Link
                href="/account"
                aria-label="Contul meu"
                className="
                  inline-flex items-center justify-center rounded-full p-1.5
                  text-slate-700 dark:text-slate-100
                  border border-gray-300/70 dark:border-slate-700/70
                  bg-white/70 dark:bg-slate-900/70 shadow-sm hover:bg-gray-100 dark:hover:bg-slate-800
                  transition
                "
              >
                <User size={16} />
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Autentificare"
                className="
                  inline-flex items-center justify-center rounded-full p-1.5
                  text-slate-700 dark:text-slate-100
                  border border-gray-300/70 dark:border-slate-700/70
                  bg-white/70 dark:bg-slate-900/70 shadow-sm hover:bg-gray-100 dark:hover:bg-slate-800
                  transition
                "
              >
                <User size={16} />
              </Link>
            )}

            <Link
              href="/checkout"
              className="
                relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold
                border border-gray-300/80 dark:border-slate-700/80
                bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-100
                shadow-sm hover:bg-gray-100 dark:hover:bg-slate-800 transition
              "
            >
              <ShoppingCart size={14} />
              <span>Coș</span>
              {isLoaded && count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-lg">
                  {count}
                </span>
              )}
            </Link>

            {/* SHOP principal – compact, text „Shop” */}
            <Link
              href="/shop"
              className="
                inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold
                bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white
                shadow-md ring-1 ring-indigo-400/40
                hover:from-indigo-500 hover:via-violet-600 hover:to-fuchsia-600
                active:scale-[0.98]
                transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-slate-950
              "
            >
              <ShoppingCart size={14} />
              <span>Shop</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
