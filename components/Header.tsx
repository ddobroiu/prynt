"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "./CartContext";
import { siteConfig } from "@/lib/siteConfig";
import { ChevronDown, Menu, ShoppingCart, X, User } from "lucide-react";

// --- Sub-components for better structure ---

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="relative text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
  >
    {children}
  </Link>
);

const DesktopNav = () => {
  return (
    <nav className="hidden lg:flex items-center gap-10">
      {siteConfig.headerNav.map((item) =>
        item.highlight ? (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {item.label}
          </Link>
        ) : item.children ? (
          <div key={item.label} className="relative group focus-within:z-50">
            <button
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 focus:text-blue-600 transition-colors outline-none"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded="false"
            >
              {item.label}
              <ChevronDown size={14} className="transition-transform duration-300 ease-out group-hover:rotate-180" />
            </button>
            {/* Dropdown Wrapper for positioning and hover bridge */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-4 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-300 ease-out transform-gpu origin-top pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto"
            >
              {/* Visual Dropdown */}
              <div className="rounded-xl bg-white shadow-lg border border-gray-100 p-2">
                <div className="flex flex-col gap-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-700 transition-colors block outline-none"
                      tabIndex={0}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
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

  useEffect(() => {
    if (!isOpen) {
      setOpenSub(null);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-bg border-r border-border shadow-xl p-6 z-50 
                   transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-lg font-bold text-text" onClick={onClose}>
            {siteConfig.name}
          </Link>
          <button onClick={onClose} className="p-2 -m-2 text-muted hover:text-text">
            <X size={22} />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {siteConfig.headerNav.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between text-left font-medium text-text py-2"
                    >
                      {item.label}
                      <ChevronDown size={16} className={`transition-transform duration-200 ${openSub === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openSub === item.label && (
                      <ul className="pl-4 mt-2 space-y-2 border-l border-border">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} onClick={onClose} className="block text-muted hover:text-text py-1">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={item.href} onClick={onClose} className="font-medium text-text block py-2">
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
  const { count, isLoaded } = useCart();
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-5">
      <Link href={session?.user ? "/account" : "/login"} className="text-muted hover:text-text transition-colors">
        <User size={22} />
      </Link>
      <Link href="/checkout" className="relative text-muted hover:text-text transition-colors">
        <ShoppingCart size={22} />
        {isLoaded && count > 0 && (
          <span className="absolute -top-2 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
};

// --- Main Header Component ---

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalStyle;
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-4">
           <button onClick={toggleMobileMenu} className="lg:hidden p-2 -ml-2 text-muted hover:text-text">
            <Menu size={24} />
          </button>
          <Link href="/" className="text-xl font-bold text-text">
            {siteConfig.name}
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <DesktopNav />
        </div>

        {/* Right: Actions */}
        <div className="flex justify-end">
          <HeaderActions />
        </div>
      </div>
      <MobileNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
}