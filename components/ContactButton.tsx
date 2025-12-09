"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Mail, X } from "lucide-react";

export default function ContactButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
  // Butonul apare doar pe Homepage (sau poți scoate condiția dacă îl vrei peste tot)
  const isHome = pathname === "/";

  return (
    // Pe mobil: vizibil doar pe prima pagină (isHome); pe desktop: mereu vizibil (lg:block)
    <div className={`fixed bottom-6 right-6 z-50 ${isHome ? "block" : "hidden"} lg:block`}>
      {/* Meniul expandat */}
      {open && (
        <div className="mb-3 flex flex-col items-end gap-2 animate-fade-in">
          <a
            href="https://wa.me/40750473111"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white px-4 py-3 shadow-2xl transition transform hover:scale-105"
          >
            <MessageCircle size={20} />
            <span className="font-semibold">WhatsApp</span>
          </a>

          <a
            href="mailto:contact@prynt.ro"
            className="flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 shadow-2xl transition transform hover:scale-105"
          >
            <Mail size={20} />
            <span className="font-semibold">Email</span>
          </a>
        </div>
      )}

      {/* Butonul principal - MAI MARE ȘI MAI VIZIBIL */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 w-16 h-16 shadow-2xl transition-all transform hover:scale-110 active:scale-95"
        aria-label="Contact rapid"
      >
        {open ? (
            // Icoană X când e deschis
            <X size={32} strokeWidth={3} />
        ) : (
            <MessageCircle size={32} strokeWidth={2.5} />
        )}
        
        {/* Efect de puls continuu pentru vizibilitate */}
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full bg-indigo-400/30 animate-ping"></span>
            <span className="absolute inset-0 rounded-full bg-indigo-400/20 animate-pulse"></span>
          </>
        )}
      </button>
    </div>
  );
}