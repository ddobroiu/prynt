"use client";
import { useState } from "react";
import { MessageCircle, Mail } from "lucide-react"; // librărie de iconițe modernă

export default function ContactButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Meniul expandat */}
      {open && (
        <div className="mb-3 flex flex-col items-end gap-2 animate-fade-in">
          <a
            href="https://wa.me/40750473111"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-green-500 hover:bg-green-600 text-white px-4 py-2 shadow-lg transition"
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </a>

          <a
            href="mailto:contact@prynt.ro"
            className="flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 shadow-lg transition"
          >
            <Mail size={18} />
            <span>Email</span>
          </a>
        </div>
      )}

      {/* Butonul principal */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 w-14 h-14 shadow-xl transition"
        aria-label="Contact rapid"
      >
        <MessageCircle size={28} />
        {/* Mic efect de puls */}
        <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></span>
      </button>
    </div>
  );
}
