"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CartWidget from "./CartWidget";
import ContactButton from "./ContactButton";
import CookieConsentBanner from "./CookieConsentBanner";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Verificăm dacă suntem pe o pagină de admin
  const isAdmin = pathname?.startsWith("/admin");

  // Dacă suntem pe admin, returnăm DOAR conținutul (care va fi gestionat de app/admin/layout.tsx)
  if (isAdmin) {
    return <>{children}</>;
  }

  // Dacă suntem pe site-ul public, afișăm layout-ul standard
  return (
    <>
      <Header />
      <CartWidget />
      <main className="mx-auto max-w-7xl px-0 md:px-0">{children}</main>
      <Footer />
      <ContactButton />
      <CookieConsentBanner />
    </>
  );
}