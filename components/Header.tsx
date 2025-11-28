"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { siteConfig } from "@/lib/siteConfig";
import { ChevronDown, Menu, X, User, LogOut, Package, Settings } from "lucide-react";
// 1. IMPORTĂM WIDGETUL DE CART
import CartWidget from "./CartWidget";

// --- SUB-COMPONENTS ---

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="relative font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
  >
    {children}
  </Link>
);

const DesktopNav = () => {
  return (
    <nav className="hidden lg:flex items-center gap-8">
      {siteConfig.headerNav.map((item) =>
        item.highlight ? (
          <Link
            key={item.href}
            href={item.href}
            className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            {item.label}
          </Link>
        ) : item.children ? (
          <div key={item.label} className="relative group">
            <button
              className="flex items-center gap-1 font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors outline-none py-4"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {item.label}
              <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
            </button>

            {/* Dropdown Container */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 overflow-hidden">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <NavLink key={item.href} href={item.href}>
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  );
};

const MobileNav = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [openSub, setOpenSub] = useState<string | null>(null);

  // Nu apelăm setState direct într-un effect; dacă meniul e închis, tratăm sub-meniul ca "nul" la randare
  const visibleOpenSub = isOpen ? openSub : null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 z-50 transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white" onClick={onClose}>
            {siteConfig.name}
          </Link>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {siteConfig.headerNav.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <div className="rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                      className={`w-full flex items-center justify-between p-3 text-left font-semibold transition-colors ${visibleOpenSub === item.label ? 'bg-zinc-50 dark:bg-zinc-900 text-indigo-600' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                    >
                      {item.label}
                      <ChevronDown size={18} className={`transition-transform duration-300 ${visibleOpenSub === item.label ? "rotate-180 text-indigo-600" : "text-zinc-400"}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${visibleOpenSub === item.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
                        {item.children.map((child) => (
                          <Link 
                            key={child.href} 
                            href={child.href} 
                            onClick={onClose} 
                            className="block py-2.5 pl-6 pr-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 border-l-2 border-transparent hover:border-indigo-500 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    onClick={onClose} 
                    className={`block p-3 font-semibold rounded-xl transition-colors ${item.highlight ? 'bg-indigo-600 text-white shadow-md mt-4 text-center' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

const HeaderActions = () => {
  // 2. Nu mai avem nevoie de useCart aici, CartWidget se ocupă de logică
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3 sm:gap-5">
      {/* Account Dropdown */}
      {session?.user ? (
        <div className="relative group">
          <button className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Cont">
            <User size={24} />
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 w-56 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {session.user.name || session.user.email}
                </p>
                {session.user.name && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {session.user.email}
                  </p>
                )}
              </div>
              
              {/* Menu Items */}
              <div className="p-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Settings size={18} />
                  Setări cont
                </Link>
                
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Package size={18} />
                  Comenzile mele
                </Link>
                
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={18} />
                  Delogare
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link href="/login" className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Cont">
          <User size={24} />
        </Link>
      )}

      {/* 3. AICI AM ÎNLOCUIT VECHIUL LINK CU COMPONENTA NOUĂ */}
      <CartWidget />
    </div>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-md border-zinc-200/50 dark:border-white/10 shadow-sm py-2" 
          : "bg-white dark:bg-black border-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setMobileMenuOpen(true)} 
             className="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
             aria-label="Meniu"
           >
            <Menu size={26} />
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-extrabold tracking-tighter text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Prynt<span className="text-indigo-600">.ro</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <div className="hidden lg:block">
          <DesktopNav />
        </div>

        {/* Right: Actions */}
        <HeaderActions />
      </div>

      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}