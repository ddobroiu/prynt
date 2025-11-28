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

  const linkClass = "text-slate-500 hover:text-indigo-600 transition-colors text-sm flex items-center gap-2";

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 lg:pt-24 pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* 1. Brand & Socials */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-2xl font-extrabold tracking-tighter text-slate-900 group-hover:text-indigo-600 transition-colors">
                Prynt<span className="text-indigo-600">.ro</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
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
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* Produse */}
            <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Produse</h3>
                <ul className="space-y-3">
                    <li>
                        <Link href="/configuratoare" className="flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-700 text-sm bg-indigo-50 px-3 py-2 rounded-lg w-fit">
                            <Sparkles size={14} />
                            Toate Configuratoarele
                        </Link>
                    </li>
                    <li><Link href="/shop" className={linkClass}>SHOP</Link></li>
                    <li><Link href="/contact" className={linkClass}>Cere Ofertă Personalizată</Link></li>
                </ul>
            </div>

            {/* Suport */}
            <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Suport Clienti</h3>
                <ul className="space-y-3">
                    <li><Link href="/urmareste-comanda" className={`${linkClass} font-medium text-slate-900`}>Urmărește Comanda</Link></li>
                    <li><Link href="/livrare" className={linkClass}>Informații Livrare</Link></li>
                    <li><Link href="/termeni" className={linkClass}>Termeni și Condiții</Link></li>
                    <li><Link href="/confidentialitate" className={linkClass}>Politica de Confidențialitate</Link></li>
                    <li><Link href="/politica-cookies" className={linkClass}>Politica Cookies</Link></li>
                </ul>
            </div>

            {/* Contact */}
            <div>
                 <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Contact</h3>
                 <ul className="space-y-3">
                     <li className="flex items-start gap-3 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                        <span>București, Sector 1<br/>Calea Griviței</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-indigo-500 shrink-0" />
                        <a href="tel:+40750473111" className={linkClass}>0750 473 111</a>
                     </li>
                     <li className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                        <a href="mailto:contact@prynt.ro" className={linkClass}>contact@prynt.ro</a>
                     </li>
                 </ul>
            </div>

          </div>

          {/* 3. Newsletter */}
          <div className="lg:col-span-3">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Abonează-te la Newsletter</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Primești oferte exclusive și reduceri. Nu facem spam.
                </p>
                <form className="flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Adresa ta de email"
                    required
                    className="bg-white border-slate-200 focus:border-indigo-300 h-10 text-sm"
                    disabled={status === "loading"}
                  />
                  <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 h-10 text-sm font-bold transition-colors" disabled={status === "loading"}>
                    {status === "loading" ? "Se trimite..." : "Mă Abonez"}
                  </Button>
                </form>
                
                <div className="mt-3 min-h-[1.25rem]">
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
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-xs text-slate-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} {siteConfig.name}. Toate drepturile rezervate.
            </p>
            <p className="text-xs text-slate-400 text-center md:text-left">
              Site realizat de{" "}
              <a 
                href="https://www.e-web.ro/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-500 hover:text-indigo-600 transition-colors underline"
              >
                E-Web.ro
              </a>
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <Link href="/stergere-date" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors">
              Ștergere date
            </Link>
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" title="Soluționarea Alternativă a Litigiilor">
              <Image src="/250x50_icon_ANPC-SAL.webp" alt="ANPC SAL" width={100} height={20} className="h-6 w-auto object-contain" />
            </a>
            <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" title="Platforma SOL">
              <Image src="/250x50_icon_ANPC-SOL.webp" alt="ANPC SOL" width={100} height={20} className="h-6 w-auto object-contain" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}