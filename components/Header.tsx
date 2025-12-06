"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { siteConfig } from "@/lib/siteConfig";
import { ChevronDown, Menu, X, User, LogOut, Package, Settings, MapPin, CreditCard, Heart, ShieldCheck } from "lucide-react";
// 1. IMPORTĂM WIDGETUL DE CART
import CartWidget from "./CartWidget";
import SearchBox from "./SearchBox";

// --- SUB-COMPONENTS ---

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="relative font-medium text-slate-950 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
            className="flex items-center gap-1 font-medium text-slate-950 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors outline-none py-4"
            aria-haspopup="true"
            aria-expanded="false"
            aria-label={`Deschide meniul ${item.label}`}
          >
            {item.label}
            <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
          </button>            {/* Dropdown Container */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 overflow-hidden">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-950 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
        role="presentation"
      />
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header mobil */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
            <Link href="/" className="flex items-center" onClick={onClose}>
              <img 
                src="/logo.jpg" 
                alt="Prynt.ro" 
                className="h-7 w-auto object-contain"
              />
            </Link>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-950 dark:text-zinc-500 transition-all" aria-label="Închide meniul">
              <X size={20} />
            </button>
          </div>

          {/* Bara de căutare mobilă */}
          <div className="px-4 pt-4 pb-2">
            <SearchBox placeholder="Caută produse..." />
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
            {siteConfig.headerNav.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <div className="rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm font-semibold rounded-lg transition-all ${visibleOpenSub === item.label ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-slate-950 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                      aria-label={`${visibleOpenSub === item.label ? 'Închide' : 'Deschide'} submeniul ${item.label}`}
                      aria-expanded={visibleOpenSub === item.label}
                    >
                      {item.label}
                      <ChevronDown size={16} className={`transition-transform duration-200 ${visibleOpenSub === item.label ? "rotate-180 text-indigo-600" : "text-zinc-400"}`} />
                    </button>
                    <div className={`grid transition-all duration-200 ease-in-out ${visibleOpenSub === item.label ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        {item.children.map((child) => (
                          <Link 
                            key={child.href} 
                            href={child.href} 
                            onClick={onClose} 
                            className="flex items-center py-2 pl-8 pr-3 text-sm text-slate-950 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
                    className={`flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${item.highlight ? 'bg-indigo-600 text-white shadow-md mt-3 justify-center hover:bg-indigo-700' : 'text-slate-950 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        </div>
      </div>
    </>
  );
};

const HeaderActions = () => {
  // 2. Nu mai avem nevoie de useCart aici, CartWidget se ocupă de logică
  const { data: session } = useSession();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Închide dropdown-ul când se face click în afară
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isAccountOpen && !target.closest('.account-dropdown')) {
        setIsAccountOpen(false);
      }
    };

    if (isAccountOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isAccountOpen]);

  return (
    <div className="flex items-center gap-4">
      {/* Account Dropdown */}
      {session?.user ? (
        <div className="relative account-dropdown">
          <button 
            className="flex items-center gap-2 px-3 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all" 
            aria-label="Cont"
            onClick={() => setIsAccountOpen(!isAccountOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-950 dark:text-zinc-300">
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M5.5 20.5C5.5 17 8.5 14 12 14C15.5 14 18.5 17 18.5 20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-slate-950 dark:text-zinc-300 text-sm font-medium">Cont</span>
          </button>
          
          {/* Dropdown Menu */}
          <div className={`absolute top-full right-0 w-56 pt-2 transition-all duration-200 ease-out z-50 ${
            isAccountOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}>
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
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-950 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <User size={18} />
                  Profilul meu
                </Link>
                
                <Link
                  href="/account?tab=orders"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-950 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Package size={18} />
                  Comenzile mele
                </Link>

                <Link
                  href="/account?tab=billing"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-950 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <CreditCard size={18} />
                  Facturi & Plăți
                </Link>

                <Link
                  href="/account?tab=addresses"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-950 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <MapPin size={18} />
                  Adrese livrare
                </Link>

                <Link
                  href="/account?tab=payment-methods"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-950 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <CreditCard size={18} />
                  Metode de plată
                </Link>

                <Link
                  href="/account?tab=favorites"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-950 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Heart size={18} />
                  Favorite
                </Link>

                <Link
                  href="/account?tab=security"
                  onClick={() => setIsAccountOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-950 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <ShieldCheck size={18} />
                  Securitate
                </Link>
              </div>

              {/* Separator */}
              <div className="border-t border-zinc-200 dark:border-zinc-800"></div>

              {/* Logout */}
              <div className="p-2">
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
        <Link href="/login" className="flex items-center gap-2 px-3 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all" aria-label="Cont">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-950 dark:text-zinc-300">
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M5.5 20.5C5.5 17 8.5 14 12 14C15.5 14 18.5 17 18.5 20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-slate-950 dark:text-zinc-300 text-sm font-medium">Login</span>
        </Link>
      )}

      {/* 3. AICI AM ÎNLOCUIT VECHIUL LINK CU COMPONENTA NOUĂ */}
      <CartWidget />
    </div>
  );
};

export default function Header() {
  // FORCE RELOAD - iconițele și logo-ul TREBUIE să fie vizibile
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
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
          ? "bg-white/95 dark:bg-black/95 backdrop-blur-lg border-zinc-200 dark:border-white/10 shadow-lg" 
          : "bg-white dark:bg-black border-zinc-200 dark:border-zinc-800"
      }`}
    >
      {/* PRIMUL RÂND: Logo, Căutare, Cont + Coș */}
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setMobileMenuOpen(true)} 
             className="lg:hidden p-2 text-slate-950 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
             aria-label="Deschide meniul"
           >
            <Menu size={22} />
          </button>
          <Link href="/" className="flex items-center group">
            <img 
              src="/logo.jpg" 
              alt="Prynt.ro" 
              className="h-10 max-h-10 w-auto max-w-[140px] object-contain"
            />
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden lg:block flex-1 max-w-2xl mx-8">
          <SearchBox placeholder="Caută produse..." />
        </div>


        {/* Right: Actions */}
        <HeaderActions />
      </div>

      {/* AL DOILEA RÂND: Meniu de navigare */}
      <div className="hidden lg:block border-b border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 sm:px-6">
          <DesktopNav />
        </div>
      </div>

      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}