"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ChevronDown } from "lucide-react";

// Componenta Helper pentru Acordeon pe Mobil / Lista pe Desktop
const FooterColumn = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 lg:border-none last:border-none">
            {/* Mobile Header */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center justify-between w-full py-4 lg:hidden text-left"
            >
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">{title}</h3>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop Header */}
            <h3 className="hidden lg:block font-semibold text-gray-900 dark:text-gray-50 mb-4">{title}</h3>

            {/* Content Wrapper */}
            <div className={`
                overflow-hidden transition-all duration-300 ease-in-out lg:block lg:opacity-100 lg:h-auto
                ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0 lg:opacity-100'}
            `}>
                <ul className="space-y-3">
                    {children}
                </ul>
            </div>
        </div>
    );
};

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

    if (status === 'success') {
        setTimeout(() => {
            setStatus("idle");
            setMessage("");
        }, 5000);
    }
  };

  const linkClass = "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors text-sm py-1 block lg:py-0";

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
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
                  className="p-2 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Footer Nav - Acum cu Acordeon pe Mobil */}
          <div className="lg:col-span-5 grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            
            <FooterColumn title="Produse">
                <li><Link href="/banner" className={linkClass}>Bannere</Link></li>
                <li><Link href="/autocolante" className={linkClass}>Autocolante</Link></li>
                <li><Link href="/afise" className={linkClass}>Afișe</Link></li>
                <li><Link href="/tapet" className={linkClass}>Tapet</Link></li>
                <li><Link href="/canvas" className={linkClass}>Canvas</Link></li>
                <li><Link href="/shop" className={linkClass}>Toate produsele</Link></li>
            </FooterColumn>

            <FooterColumn title="Suport">
                <li><Link href="/urmareste-comanda" className={`${linkClass} font-medium text-indigo-600 dark:text-indigo-400`}>Urmărește Comanda</Link></li>
                <li><Link href="/contact" className={linkClass}>Contact</Link></li>
                <li><Link href="/termeni" className={linkClass}>Termeni și Condiții</Link></li>
                <li><Link href="/confidentialitate" className={linkClass}>Confidențialitate</Link></li>
                <li><Link href="/politica-cookies" className={linkClass}>Cookies</Link></li>
                <li><Link href="/anpc" className={linkClass}>ANPC</Link></li>
            </FooterColumn>

            <FooterColumn title="Contact">
                 <li className="flex items-start gap-3 py-1 lg:py-0">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">București, Sector 1</span>
                 </li>
                 <li className="flex items-center gap-3 py-1 lg:py-0">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <a href="tel:+40700000000" className={linkClass}>0700 000 000</a>
                 </li>
                 <li className="flex items-center gap-3 py-1 lg:py-0">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <a href="mailto:contact@prynt.ro" className={linkClass}>contact@prynt.ro</a>
                 </li>
            </FooterColumn>

          </div>

          {/* 3. Newsletter */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">Newsletter</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Abonează-te pentru oferte exclusive.
            </p>
            <form className="mt-4 flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="email@exemplu.ro"
                required
                className="bg-white dark:bg-gray-900 h-11"
                aria-label="Adresa de email"
                disabled={status === "loading"}
              />
              <Button type="submit" variant="default" className="w-full h-11" disabled={status === "loading"}>
                {status === "loading" ? "Se trimite..." : "Mă Abonez"}
              </Button>
            </form>
            
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

      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-center md:text-left text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Toate drepturile rezervate.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/stergere-date"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
            >
              Ștergere date
            </Link>
            <div className="flex items-center gap-4">
                <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer" title="SAL">
                  <Image src="/250x50_icon_ANPC-SAL.webp" alt="ANPC – SAL" width={100} height={20} className="h-6 w-auto object-contain opacity-80 hover:opacity-100" />
                </a>
                <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" title="SOL">
                  <Image src="/250x50_icon_ANPC-SOL.webp" alt="UE – Platformă SOL" width={100} height={20} className="h-6 w-auto object-contain opacity-80 hover:opacity-100" />
                </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}