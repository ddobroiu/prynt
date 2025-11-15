"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "./CartContext";
import { ChevronDown, ChevronRight, Menu, ShoppingCart, X, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const { data: session } = useSession();
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);
  const [lastBilling, setLastBilling] = useState<any>(null);
  const [lastAddress, setLastAddress] = useState<any>(null);

  useEffect(() => {
    if (!session?.user) return;
    // Fetch last billing and address for quick menu preview
    (async () => {
      try {
        const [bResp, aResp] = await Promise.all([
          fetch('/api/account/last-billing').then((r) => r.json()).catch(() => null),
          fetch('/api/account/last-address').then((r) => r.json()).catch(() => null),
        ]);
        if (bResp && bResp.billing) setLastBilling(bResp.billing);
        if (aResp && aResp.address) setLastAddress(aResp.address);
      } catch (e) {
        // ignore
      }
    })();
  }, [session]);

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
        sticky top-0 z-80 w-full border-b
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

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                  aria-label="Meniu cont"
                  className="inline-flex items-center justify-center rounded-xl p-2 border border-transparent text-slate-700 hover:bg-gray-100 transition dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <User size={22} />
                </button>
                {accountOpen ? (
                  <div className="absolute right-0 mt-2 w-72 rounded-lg border bg-white/95 dark:bg-slate-900/95 p-3 shadow-lg z-50">
                    <div className="mb-2">
                      <div className="font-semibold">{(session.user as any)?.name || (session.user as any)?.email}</div>
                      <div className="text-xs text-muted">{(session.user as any)?.email}</div>
                    </div>
                    <div className="divide-y divide-white/6">
                      <div className="py-2">
                        <a href="/account" className="block px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">Contul meu</a>
                      </div>
                      <div className="py-2">
                        <div className="text-xs text-muted px-2">Facturare recentă</div>
                        {lastBilling ? (
                          <div className="px-2 py-1">
                            <div className="font-medium">{lastBilling.name || lastBilling.cui || '—'}</div>
                            <div className="text-xs text-muted">{lastBilling.localitate ? `${lastBilling.localitate}, ${lastBilling.judet}` : '—'}</div>
                          </div>
                        ) : (
                          <div className="px-2 py-1 text-xs text-muted">Nu sunt date de facturare</div>
                        )}
                      </div>
                      <div className="py-2">
                        <div className="text-xs text-muted px-2">Ultima adresă</div>
                        {lastAddress ? (
                          <div className="px-2 py-1 text-sm">{lastAddress.nume_prenume}<div className="text-xs text-muted">{lastAddress.strada_nr}, {lastAddress.localitate}</div></div>
                        ) : (
                          <div className="px-2 py-1 text-xs text-muted">Nu există adresă</div>
                        )}
                      </div>
                      <div className="py-2 flex gap-2">
                        <button
                          onClick={() => { setAccountOpen(false); signOut({ callbackUrl: '/' }); }}
                          className="w-full text-left px-2 py-2 rounded bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          Deconectare
                        </button>
                        <button
                          onClick={() => { setAccountOpen(false); router.push('/account'); }}
                          className="w-full text-left px-2 py-2 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        >
                          Setări cont
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Contul meu"
                className="inline-flex items-center justify-center rounded-xl p-2 border border-transparent text-slate-700 hover:bg-gray-100 transition dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <User size={22} />
              </Link>
            )}

            <Link
              href="/checkout"
              className="relative inline-flex items-center justify-center rounded-xl p-2 border border-transparent text-slate-700 hover:bg-gray-100 transition dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label="Coșul meu"
            >
              <ShoppingCart size={22} />
              {isLoaded && count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
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
                  <li key="shop-mobile">
                    <Link
                      href="/shop"
                      className="block rounded-xl border border-gray-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/60 px-3 py-2.5 text-slate-800 dark:text-slate-100 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition"
                      onClick={() => setOpenMobile(false)}
                    >
                      Shop
                    </Link>
                  </li>
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
          <nav className="justify-self-center flex items-center gap-3">
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
                    className="group inline-flex items-center gap-1 rounded-lg px-5 py-3 text-[15px] font-semibold text-slate-800 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
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
                      shadow-lg ring-1 ring-black/5
                      z-120 transition-all origin-top pointer-events-auto
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

            {session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                  aria-label="Meniu cont"
                  className="relative inline-flex items-center justify-center rounded-xl px-4 py-2 border border-gray-300/80 text-slate-700 hover:bg-gray-100 transition dark:border-slate-700/80 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <User size={20} />
                  <span className="ml-2 hidden md:inline text-sm">Cont</span>
                </button>
                {accountOpen ? (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-white/95 dark:bg-slate-900/95 p-4 shadow-lg z-50">
                    <div className="mb-3">
                      <div className="font-semibold">{(session.user as any)?.name || (session.user as any)?.email}</div>
                      <div className="text-xs text-muted">{(session.user as any)?.email}</div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <a href="/account" className="block px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">Contul meu</a>
                    </div>
                    <div className="mt-3 border-t pt-3">
                      <div className="text-xs text-muted">Facturare recentă</div>
                      {lastBilling ? (
                        <div className="mt-1 text-sm">{lastBilling.name || lastBilling.cui || '—'}<div className="text-xs text-muted">{lastBilling.localitate ? `${lastBilling.localitate}, ${lastBilling.judet}` : '—'}</div></div>
                      ) : (
                        <div className="mt-1 text-xs text-muted">Nu sunt date de facturare</div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="flex-1 rounded px-3 py-2 bg-red-50 text-red-700">Deconectare</button>
                        <button onClick={() => router.push('/account')} className="flex-1 rounded px-3 py-2 bg-indigo-50 text-indigo-700">Cont</button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                href="/login"
                className="relative inline-flex items-center justify-center rounded-xl px-4 py-2 border border-gray-300/80 text-slate-700 hover:bg-gray-100 transition dark:border-slate-700/80 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-label="Contul meu"
              >
                <User size={20} />
              </Link>
            )}

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