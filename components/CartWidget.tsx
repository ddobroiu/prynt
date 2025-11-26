// components/CartWidget.tsx
"use client";

import React, { useState } from "react";
import { useCart } from "./CartContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ShoppingCart, Trash2, Truck, Gift, ArrowRight, Plus, Minus, FileDown, ChevronLeft, FileText, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatMoneyDisplay } from "@/lib/pricing";

// CONSTANTE
const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_COST = 19.99; // Standard shipping fee when below threshold

export default function CartWidget() {
  const { items, removeItem, updateQuantity, cartTotal, cartCount } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Calcul livrare gratuită & costuri
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  
  // --- FUNCȚIE GENERARE PDF ---
  async function exportOfferPdfServer() {
    if (items.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
      
      const normalizedItems = items.map((it) => ({
        id: it.id,
        name: it.title || 'Produs',
        quantity: it.quantity,
        unitAmount: it.price,
        totalAmount: it.price * it.quantity,
        artworkUrl: it.metadata?.artworkUrl || null,
        metadata: it.metadata || {},
      }));

      const res = await fetch('/api/pdf/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: normalizedItems, shipping: shippingCost }),
      });

      if (!res.ok) throw new Error('Generarea PDF a eșuat');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toLocaleDateString('ro-RO');
      a.href = url;
      a.download = `oferta-prynt-${date}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.message || 'Nu s-a putut genera PDF-ul.');
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors group">
          <ShoppingCart className="h-6 w-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in">
              {cartCount}
            </span>
          )}
        </button>
      </DialogTrigger>
      
      {/* DIALOG CONTENT - STILURI MOBILE vs. PC */}
      <DialogContent className={`
        // COMMON STYLES
        bg-white p-0 shadow-2xl duration-300 flex flex-col gap-0 focus:outline-none z-[100] [&>button:last-child]:hidden
        
        // MOBILE (Default: Modal Centrat, Lățime restrânsă)
        fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] 
        w-[90vw] max-w-sm max-h-[95vh] h-auto overflow-y-auto rounded-xl border border-slate-200 
        data-[state=open]:animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 
        data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-10

        // PC (md: Override: Sidebar - Full-height, Complet)
        md:!fixed md:!right-0 md:!left-auto md:!top-0 md:!translate-x-0 md:!translate-y-0
        md:!h-screen md:!max-w-md md:!w-full 
        md:!rounded-none md:!border-l md:border-t-0 
        md:data-[state=open]:!slide-in-from-right md:data-[state=closed]:!slide-out-to-right
        md:overflow-hidden // DECIZIV: Asigură că întregul container (DialogContent) nu are scroll pe PC
      `}>
        
        {/* HEADER EXTINS */}
        <div className="bg-white shrink-0 sticky top-0 z-20 border-b border-slate-100 shadow-sm">
            {/* Titlu + BUTON X VIZIBIL */}
            <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    Coșul Tău <span className="text-slate-400 text-sm font-medium font-sans">({cartCount})</span>
                </DialogTitle>
                
                {/* Buton Închidere Custom & Vizibil */}
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-all duration-200 border border-transparent hover:border-red-100 group"
                  aria-label="Închide coșul"
                >
                  <X size={24} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* ZONA BUTON PDF */}
            {items.length > 0 && (
                <div className="px-6 pb-5">
                    <button 
                        onClick={exportOfferPdfServer}
                        disabled={isGeneratingPdf}
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 border border-indigo-100 hover:border-indigo-200 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group active:scale-95 shadow-sm"
                    >
                        {isGeneratingPdf ? (
                            <span className="animate-pulse flex items-center gap-2">Se generează...</span>
                        ) : (
                            <>
                                <div className="bg-white p-1 rounded-md shadow-sm">
                                   <FileText size={16} className="text-indigo-600" /> 
                                </div>
                                Descarcă Ofertă PDF
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>

        {/* FREE SHIPPING BAR - Stil Modernizat */}
        <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 shrink-0">
            {remainingForFreeShipping > 0 ? (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-600">
                           <Truck size={14} /> 
                        </div>
                        Livrare Gratuită
                      </span>
                      <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-1 rounded-lg">
                        încă <span className="text-slate-900">{formatMoneyDisplay(remainingForFreeShipping)}</span>
                      </span>
                    </div>
                    
                    <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden inner-shadow">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                            style={{ width: `${progressPercent}%` }}
                        >
                           {/* Shine Effect */}
                           <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                       Adaugă produse de 500 RON pentru transport 0.
                    </p>
                </div>
            ) : (
                <div className="flex items-center gap-4 text-emerald-800 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                    <div className="p-2.5 bg-white rounded-full shadow-sm ring-4 ring-emerald-100">
                        <Gift className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-sm font-extrabold">Felicitări!</p>
                        <p className="text-xs font-medium opacity-90">Beneficiezi de Livrare Gratuită.</p>
                    </div>
                </div>
            )}
        </div>

        {/* LISTA PRODUSE - DEVINE ZONA SCROLLABILA PE PC */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center">
                 <ShoppingCart className="h-10 w-10 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-900">Coșul este gol</p>
                <p className="text-slate-500 text-sm">Nu ai adăugat încă niciun produs.</p>
              </div>
              <Button onClick={() => setIsOpen(false)} variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-indigo-600">
                Continuă Cumpărăturile
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                
                {/* IMAGINE PRODUS */}
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm group-hover:shadow-md transition-shadow">
                   {item.metadata?.artworkUrl ? (
                       <Image 
                         src={item.metadata.artworkUrl} 
                         alt={item.title || "Produs"} 
                         fill 
                         className="object-cover hover:scale-105 transition-transform duration-500" 
                       />
                   ) : (
                       <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                          <div className="font-bold text-xs opacity-40">FOTO</div>
                       </div>
                   )}
                </div>

                {/* DETALII PRODUS */}
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug hover:text-indigo-600 transition-colors cursor-pointer">
                          <Link href={`/${item.slug || 'shop'}`} onClick={() => setIsOpen(false)}>
                            {item.title}
                          </Link>
                        </h3>
                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 -mr-2">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {item.width && item.height ? `${item.width} x ${item.height} cm` : ''}
                    </p>
                    
                    {/* Metadata Chips */}
                    <div className="flex flex-wrap gap-1 mt-2">
                       {item.metadata?.Material && <span className="text-[10px] px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-500">{item.metadata.Material}</span>}
                    </div>
                  </div>
                  
                  {/* CONTROALE CANTITATE & PREȚ */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white shadow-sm h-8">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        className="px-2.5 h-full hover:bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-l-lg transition-colors disabled:opacity-30" 
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className="px-2.5 h-full hover:bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-r-lg transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-bold text-sm text-slate-900">{formatMoneyDisplay(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER - FIXAT LA BAZA ECRANULUI PE PC */}
        {items.length > 0 && (
            <div className="border-t border-slate-100 p-6 bg-white shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                
                {/* TOTALURI */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between items-center text-sm text-slate-500">
                      <p>Subtotal produse</p>
                      <p className="font-medium text-slate-700">{formatMoneyDisplay(cartTotal)}</p>
                  </div>
                  <div className="h-px bg-slate-100 w-full my-1"></div>
                  <div className="flex justify-between items-center">
                      <p className="text-base font-bold text-slate-900">Total estimat</p>
                      <p className="text-xl font-extrabold text-indigo-700">{formatMoneyDisplay(cartTotal)}</p>
                  </div>
                </div>
                
                {/* BUTOANE ACȚIUNE */}
                <div className="grid gap-3">
                  <Button asChild className="w-full h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 rounded-xl transition-all hover:scale-[1.01]">
                      <Link href="/checkout" onClick={() => setIsOpen(false)}>
                        Finalizează Comanda <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                  </Button>
                  
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={16} /> Continuă Cumpărăturile
                  </button>
                </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}