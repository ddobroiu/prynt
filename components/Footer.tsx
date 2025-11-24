"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react"; // Am adăugat iconițe pentru contact

export default function Footer() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value || "";
    
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data?.message || "Te-ai abonat cu succes! Verifică emailul.");
        (form.querySelector('input[name="email"]') as HTMLInputElement).value = "";
      } else {
        setStatus("error");
        setMessage(data?.message || "A apărut o eroare. Încearcă din nou.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Nu am putut trimite cererea. Verifică conexiunea.");
    }

    // Reset mesaj dupa 5 secunde daca e succes
    if (status === 'success') {
        setTimeout(() => {
            setStatus("idle");
            setMessage("");
        }, 5000);
    }
  };

  // Helper pentru stilul link-urilor
  const linkClass = "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors text-sm";

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 1. Brand & Socials */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt={`${siteConfig.name} Logo`}
                width={48}
                height={48}
                className="rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-sm text-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              {siteConfig.socialLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.title}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Footer Nav (Acum Hardcoded pentru a include link-ul nou) */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            
            {/* Coloana Produse */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-4">Produse</h3>
              <ul className="space-y-3">
                <li><Link href="/banner" className={linkClass}>Bannere</Link></li>
                <li><Link href="/autocolante" className={linkClass}>Autocolante</Link></li>
                <li><Link href="/afise" className={linkClass}>Afișe</Link></li>
                <li><Link href="/tapet" className={linkClass}>Tapet</Link></li>
                <li><Link href="/canvas" className={linkClass}>Canvas</Link></li>
                <li><Link href="/shop" className={linkClass}>Toate produsele</Link></li>
              </ul>
            </div>

            {/* Coloana Suport - AICI AM ADĂUGAT LINK-UL */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-4">Suport</h3>
              <ul className="space-y-3">
                <li><Link href="/urmareste-comanda" className={`${linkClass} font-medium text-indigo-600 dark:text-indigo-400`}>Urmărește Comanda</Link></li>
                <li><Link href="/contact" className={linkClass}>Contact</Link></li>
                <li><Link href="/termeni" className={linkClass}>Termeni și Condiții</Link></li>
                <li><Link href="/confidentialitate" className={linkClass}>Confidențialitate</Link></li>
                <li><Link href="/politica-cookies" className={linkClass}>Cookies</Link></li>
                <li><Link href="/anpc" className={linkClass}>ANPC</Link></li>
              </ul>
            </div>

            {/* Coloana Contact Info */}
            <div>
               <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-4">Contact</h3>
               <ul className="space-y-3">
                 <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">București, Sector 1</span>
                 </li>
                 <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <a href="tel:+40700000000" className={linkClass}>0700 000 000</a>
                 </li>
                 <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <a href="mailto:contact@prynt.ro" className={linkClass}>contact@prynt.ro</a>
                 </li>
               </ul>
            </div>

          </div>

          {/* 3. Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">Newsletter</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Abonează-te pentru oferte exclusive.
            </p>
            <form className="mt-4 flex flex-col gap-2" onSubmit={handleNewsletterSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="email@exemplu.ro"
                required
                className="bg-white dark:bg-gray-900"
                aria-label="Adresa de email"
                disabled={status === "loading"}
              />
              <Button type="submit" variant="default" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Se trimite..." : "Mă Abonez"}
              </Button>
            </form>
            
            {/* Feedback Vizual */}
            <div className="mt-2 min-h-[1.5rem]">
                {status !== "idle" && (
                    <p className={`text-xs ${status === "success" ? "text-green-600" : status === "error" ? "text-red-500" : "text-gray-500"}`}>
                      {message}
                    </p>
                )}
                {status === "idle" && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Nu facem spam. Te poți dezabona oricând.
                    </p>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Toate drepturile rezervate.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/stergere-date"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
            >
              Ștergere date
            </Link>
            <a
              href="https://anpc.ro/ce-este-sal/"
              target="_blank"
              rel="noopener noreferrer"
              title="Soluționarea Alternativă a Litigiilor – ANPC"
            >
              <Image
                src="/250x50_icon_ANPC-SAL.webp"
                alt="ANPC – SAL"
                width={125}
                height={25}
                className="h-auto w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="https://consumer-redress.ec.europa.eu/index_ro"
              target="_blank"
              rel="noopener noreferrer"
              title="Platforma europeană SOL"
            >
              <Image
                src="/250x50_icon_ANPC-SOL.webp"
                alt="UE – Platformă SOL"
                width={125}
                height={25}
                className="h-auto w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}