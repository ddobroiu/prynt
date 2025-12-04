"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Sparkles } from "lucide-react";

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
        setMessage(data?.message || "Te-ai abonat cu succes!");
        (form.querySelector('input[name="email"]') as HTMLInputElement).value = "";
      } else {
        setStatus("error");
        setMessage(data?.message || "A apărut o eroare.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Eroare conexiune.");
    }

    if (status === 'success') {
        setTimeout(() => { setStatus("idle"); setMessage(""); }, 5000);
    }
  };

  const linkClass = "text-slate-700 hover:text-indigo-600 transition-colors text-sm flex items-center gap-2";

  return (
    <footer className="bg-white border-t border-slate-200 pt-8 sm:pt-12 lg:pt-16 xl:pt-24 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 mb-8 lg:mb-16">
          
          {/* 1. Brand & Socials */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img 
                src="/logo.jpg" 
                alt="Prynt.ro" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-700 text-sm leading-relaxed max-w-sm">
              {siteConfig.description} Platforma completă de tipar digital unde configurezi, vizualizezi prețul și comanzi instant.
            </p>
            <div className="flex items-center gap-3">
              {siteConfig.socialLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.title}
                  className="p-2.5 bg-slate-50 rounded-full text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  <link.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Navigation Columns (FĂRĂ ACORDEON - VIZIBILE DIRECT) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Produse */}
            <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 sm:mb-4">Produse</h3>
                <ul className="space-y-2 sm:space-y-3">
                    <li>
                        <Link href="/configuratoare" className="flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-700 text-sm bg-indigo-50 px-3 py-2 rounded-lg w-fit touch-manipulation">
                            <Sparkles size={14} />
                            Toate Configuratoarele
                        </Link>
                    </li>
                    <li><Link href="/shop" className={`${linkClass} touch-manipulation`}>SHOP</Link></li>
                    <li><Link href="/contact" className={`${linkClass} touch-manipulation`}>Cere Ofertă Personalizată</Link></li>
                </ul>
            </div>

            {/* Suport */}
            <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 sm:mb-4">Suport Clienti</h3>
                <ul className="space-y-2 sm:space-y-3">
                    <li><Link href="/urmareste-comanda" className={`${linkClass} font-medium text-slate-900 touch-manipulation`}>Urmărește Comanda</Link></li>
                    <li><Link href="/livrare" className={`${linkClass} touch-manipulation`}>Informații Livrare</Link></li>
                    <li><Link href="/termeni" className={`${linkClass} touch-manipulation`}>Termeni și Condiții</Link></li>
                    <li><Link href="/confidentialitate" className={`${linkClass} touch-manipulation`}>Politica de Confidențialitate</Link></li>
                    <li><Link href="/politica-cookies" className={`${linkClass} touch-manipulation`}>Politica Cookies</Link></li>
                </ul>
            </div>

            {/* Contact */}
            <div className="sm:col-span-2 lg:col-span-1">
                 <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 sm:mb-4">Contact</h3>
                 <ul className="space-y-2 sm:space-y-3">
                     <li className="flex items-start gap-3 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                        <span>București, Sector 1<br/>Calea Griviței</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-indigo-500 shrink-0" />
                        <a href="tel:+40750473111" className={`${linkClass} touch-manipulation`}>0750 473 111</a>
                     </li>
                     <li className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                        <a href="mailto:contact@prynt.ro" className={`${linkClass} touch-manipulation`}>contact@prynt.ro</a>
                     </li>
                 </ul>
            </div>

          </div>

          {/* 3. Newsletter */}
          <div className="lg:col-span-3">
            <div className="bg-slate-50 rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">Abonează-te la Newsletter</h3>
                <p className="text-xs text-slate-500 mb-3 sm:mb-4">
                  Primești oferte exclusive și reduceri. Nu facem spam.
                </p>
                <form className="flex flex-col gap-2 sm:gap-3" onSubmit={handleNewsletterSubmit}>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Adresa ta de email"
                    required
                    className="bg-white border-slate-200 focus:border-indigo-300 h-11 sm:h-10 text-sm touch-manipulation"
                    disabled={status === "loading"}
                  />
                  <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 h-11 sm:h-10 text-sm font-bold transition-colors touch-manipulation" disabled={status === "loading"}>
                    {status === "loading" ? "Se trimite..." : "Mă Abonez"}
                  </Button>
                </form>
                
                <div className="mt-3 min-h-5">
                    {status !== "idle" && (
                        <p className={`text-xs font-medium ${status === "success" ? "text-emerald-600" : "text-red-500"}`}>
                          {message}
                        </p>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col items-center md:items-start gap-1 sm:gap-2">
            <p className="text-xs text-slate-600 text-center md:text-left">
              &copy; {new Date().getFullYear()} {siteConfig.name}. Toate drepturile rezervate.
            </p>
            <p className="text-xs text-slate-600 text-center md:text-left">
              Site realizat de{" "}
              <a 
                href="https://www.e-web.ro/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-500 hover:text-indigo-600 transition-colors underline touch-manipulation"
              >
                E-Web.ro
              </a>
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <Link href="/stergere-date" className="text-xs text-slate-700 hover:text-indigo-600 transition-colors touch-manipulation font-medium">
              Ștergere date
            </Link>
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" title="Soluționarea Alternativă a Litigiilor" className="touch-manipulation">
              <Image src="/250x50_icon_ANPC-SAL.webp" alt="ANPC SAL" width={100} height={20} className="h-5 sm:h-6 w-auto object-contain" />
            </a>
            <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" title="Platforma SOL" className="touch-manipulation">
              <Image src="/250x50_icon_ANPC-SOL.webp" alt="ANPC SOL" width={100} height={20} className="h-5 sm:h-6 w-auto object-contain" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}