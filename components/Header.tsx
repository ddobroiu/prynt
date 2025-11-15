"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "./CartContext";
import { siteConfig } from "@/lib/siteConfig";
import { ChevronDown, Menu, ShoppingCart, X, User } from "lucide-react";

// --- Sub-components for better structure ---

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm font-medium text-muted hover:text-text transition-colors">
    {children}
  </Link>
);

const DesktopNav = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-6">
      {siteConfig.headerNav.map((item) =>
        item.children ? (
          <div key={item.label} className="relative" onMouseLeave={() => setOpenDropdown(null)}>
            <button
              onMouseEnter={() => setOpenDropdown(item.label)}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
              <ChevronDown size={16} />
            </button>
            {openDropdown === item.label && (
              <div
                className="absolute top-full mt-2 w-56 rounded-md bg-white shadow-lg border border-gray-200 p-2 z-40"
              >
                <div className="flex flex-col gap-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-lg p-6 z-50 transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-lg font-bold" onClick={onClose}>
            {siteConfig.name}
          </Link>
          <button onClick={onClose} className="p-2">
            <X size={20} />
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            {siteConfig.headerNav.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between text-left font-medium"
                    >
                      {item.label}
                      <ChevronDown size={16} className={`transition-transform ${openSub === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {openSub === item.label && (
                      <ul className="pl-4 mt-2 space-y-3 border-l border-gray-200">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} onClick={onClose} className="block text-gray-600 hover:text-gray-900">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link href={item.href} onClick={onClose} className="font-medium">
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
    <div className="flex items-center gap-4">
      <Link href={session?.user ? "/account" : "/login"} className="text-gray-600 hover:text-gray-900">
        <User size={20} />
      </Link>
      <Link href="/checkout" className="relative text-gray-600 hover:text-gray-900">
        <ShoppingCart size={20} />
        {isLoaded && count > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
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
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6 h-20 grid grid-cols-2 lg:grid-cols-3 items-center">
        {/* Left: Logo */}
        <div className="flex justify-start">
          <Link href="/" className="text-xl font-bold text-gray-900">
            {siteConfig.name}
          </Link>
        </div>

        {/* Center: Desktop Nav */}
        <div className="hidden lg:flex justify-center">
          <DesktopNav />
        </div>

        {/* Right: Actions & Mobile Toggle */}
        <div className="flex justify-end items-center gap-4">
          <HeaderActions />
          <button onClick={toggleMobileMenu} className="lg:hidden p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>
      <MobileNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
}