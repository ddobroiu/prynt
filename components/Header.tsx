// components/Header.tsx
"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "./CartProvider"; // CRITICAL: Importăm useCart

// --- Iconițe ---
type IconProps = React.SVGProps<SVGSVGElement>;

function CartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

// ... (BurgerIcon, CloseIcon sunt presupuse a fi definite sau eliminate) ...
const BurgerIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);
const CloseIcon = (props: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);


const LINKS = [
  { href: "/banner", label: "Banner" },
  { href: "/flayer", label: "Flayer" },
  { href: "/canvas", label: "Canvas" },
  { href: "/autocolante", label: "Autocolante" },
  { href: "/materiale-rigide", label: "Materiale rigide" },
];

// --- COMPONENTA DINAMICĂ DE COȘ ---
// Afișează numărul de articole și așteaptă isLoaded
function CartButtonWithCount({ isMobile = false }: { isMobile?: boolean }) {
    const cart = useCart();
    const cartCount = cart.count; 
    const isLoaded = cart.isLoaded; // CRITICAL: Așteaptă să se încarce datele!
    
    const baseClass = isMobile 
        ? "w-full px-5 py-3 rounded-xl bg-indigo-600/90 text-white font-extrabold text-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/40"
        : "px-5 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/30";

    return (
        <a href="/checkout" className={baseClass}>
            <CartIcon />
            {isLoaded ? ( // Așteaptă isLoaded = true
                <>
                    Coșul meu 
                    {cartCount > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs font-bold text-white">
                            {cartCount}
                        </span>
                    )}
                </>
            ) : (
                <>Coșul meu</> // Afișează fără număr în timpul încărcării
            )}
        </a>
    );
}
// -----------------------------------------------------------------


export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []); // Pentru a folosi createPortal (client-side)

  // Meniul mobil afișat cu createPortal pentru a fi în afara fluxului normal
  const mobileMenuPortal = mounted && open ? createPortal(
      <div 
        className="fixed inset-0 z-[110] bg-gray-950/95 backdrop-blur-sm p-8 flex flex-col items-center justify-center transition-opacity"
        onClick={() => setOpen(false)} // Închide la click oriunde
      >
        <button 
          onClick={(e) => { e.stopPropagation(); setOpen(false); }}
          className="absolute top-4 right-4 text-white hover:text-indigo-400 p-2 transition"
        >
          <CloseIcon width={32} height={32} />
        </button>
        <nav className="flex flex-col items-center gap-6 text-2xl text-white">
          {LINKS.map((l) => (
            <a 
              key={l.href} 
              href={l.href} 
              className="font-bold hover:text-indigo-400 transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        
        {/* Butonul de coș în meniul mobil */}
        <div className="w-full max-w-xs pt-8">
            <CartButtonWithCount isMobile={true} /> 
        </div>
      </div>,
      document.body
    ) : null;

  return (
    <header className="sticky top-0 z-[100] bg-gray-950/85 backdrop-blur-md border-b border-indigo-700/50">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <a href="/" className="flex items-center">
          <img src="/logo.png" alt="Prynt.ro" width={64} height={64} style={{ objectFit: 'contain' }} />
        </a>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-base text-white/80">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="font-medium hover:text-indigo-400 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* COȘ DESKTOP: APELĂM COMPONENTA DINAMICĂ */}
        <div className="hidden md:flex">
          <CartButtonWithCount />
        </div>

        {/* BUTON MENIU MOBIL */}
        <button
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-indigo-700/50 text-white hover:border-indigo-400 transition-colors"
          onClick={() => setOpen(true)}
        >
          <BurgerIcon width={24} height={24} />
        </button>

      </div>
      {mobileMenuPortal}
    </header>
  );
}