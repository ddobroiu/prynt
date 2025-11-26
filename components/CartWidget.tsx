// components/CartWidget.tsx
"use client";

import React, { useState } from "react";
import { useCart } from "./CartContext";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ShoppingCart, Trash2, Truck, Gift, ArrowRight, Plus, Minus, FileText, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { formatMoneyDisplay } from "@/lib/pricing";

// CONSTANTE
const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_COST = 19.99; 

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
        <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
          <ShoppingCart className="h-6 w-6 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-in zoom-in">
              {cartCount}
            </span>
          )}
        </button>
      </DialogTrigger>
      
      {/* DIALOG CONTENT - STILURI ADAPTATE DARK MODE */}
      <DialogContent
        className={
          "p-0 shadow-2xl duration-300 flex flex-col gap-0 focus:outline-none z-50 [&>button:last-child]:hidden " +
          // CULORI EXPLICITE DARK MODE
          "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 " +
          // Mobile: centered modal
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm max-h-[95vh] h-auto overflow-y-auto rounded-xl " +
          // Desktop: sidebar
          "md:fixed md:inset-y-0 md:right-0 md:left-auto md:translate-x-0 md:translate-y-0 md:h-screen md:max-w-md md:w-full md:rounded-none md:border-l md:border-t-0 md:overflow-hidden"
        }
      >
        
        {/* HEADER */}
        <div className="shrink-0 sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <DialogTitle className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Coșul Tău <span className="text-slate-500 dark:text-slate-400 text-sm font-medium font-sans">({cartCount})</span>
            </DialogTitle>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all duration-200"
              aria-label="Închide coșul"
            >
              <X size={20} />
            </button>
          </div>

          {items.length > 0 && (
            <div className="px-4 pb-4">
              <button
                onClick={exportOfferPdfServer}
                disabled={isGeneratingPdf}
                className="w-full py-2 px-3 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-slate-700"
              >
                {isGeneratingPdf ? (
                  <span className="animate-pulse flex items-center gap-2">Se generează...</span>
                ) : (
                  <>
                    <div className="bg-indigo-50 dark:bg-indigo-900/50 p-1 rounded-md">
                      <FileText size={16} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    Descarcă Ofertă PDF
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* FREE SHIPPING BAR */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          {remainingForFreeShipping > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-full text-indigo-600 dark:text-indigo-400">
                    <Truck size={14} />
                  </div>
                  Livrare Gratuită
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  încă <span className="text-slate-900 dark:text-white">{formatMoneyDisplay(remainingForFreeShipping)}</span>
                </span>
              </div>

              <div className="relative h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-left text-slate-500 dark:text-slate-400 mt-2">
                Adaugă produse de 500 RON pentru transport 0.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-emerald-800 dark:text-emerald-300 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-full">
                <Gift className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-extrabold">Felicitări!</p>
                <p className="text-xs font-medium opacity-90">Beneficiezi de Livrare Gratuită.</p>
              </div>
            </div>
          )}
        </div>

        {/* LISTA PRODUSE */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white dark:bg-slate-900">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                 <ShoppingCart className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-900 dark:text-white">Coșul este gol</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Nu ai adăugat încă niciun produs.</p>
              </div>
              <Button onClick={() => setIsOpen(false)} variant="outline" className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300">
                Continuă Cumpărăturile
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                
                {/* IMAGINE PRODUS */}
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 shadow-sm">
                  {(() => {
                    const it: any = item as any;
                    const imgSrc =
                      it.artworkUrl || it.image || it.src || it.imageUrl || it.thumbnail ||
                      it.metadata?.artworkUrl || it.metadata?.artworkLink || it.metadata?.artwork || null;

                    if (!imgSrc) {
                      return (
                        <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-800">
                          <div className="font-bold text-xs opacity-40">FOTO</div>
                        </div>
                      );
                    }

                    return (
                      <img
                        src={imgSrc}
                        alt={item.title || "Produs"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.onerror = null;
                          el.style.display = 'none';
                        }}
                      />
                    );
                  })()}
                </div>

                {/* DETALII PRODUS */}
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                          <Link href={`/${item.slug || 'shop'}`} onClick={() => setIsOpen(false)}>
                            {item.title}
                          </Link>
                        </h3>
                        <button onClick={() => removeItem(item.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 -mr-2">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {item.width && item.height ? `${item.width} x ${item.height} cm` : ''}
                    </p>
                    
                    {/* Metadata Chips */}
                    <div className="flex flex-wrap gap-1 mt-2">
                       {item.metadata?.Material && (
                         <span className="text-[10px] px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400">
                           {item.metadata.Material}
                         </span>
                       )}
                    </div>
                  </div>
                  
                  {/* CONTROALE CANTITATE & PREȚ */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm h-8">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        className="px-2.5 h-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-l-lg transition-colors disabled:opacity-30" 
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className="px-2.5 h-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-r-lg transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{formatMoneyDisplay(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                
                {/* TOTALURI */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                      <p>Subtotal produse</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300">{formatMoneyDisplay(cartTotal)}</p>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 w-full my-1"></div>
                  <div className="flex justify-between items-center">
                      <p className="text-base font-bold text-slate-900 dark:text-white">Total estimat</p>
                      <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400">{formatMoneyDisplay(cartTotal)}</p>
                  </div>
                </div>
                
                {/* BUTOANE ACȚIUNE */}
                <div className="grid gap-3">
                  <Button asChild className="w-full h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none rounded-xl transition-all hover:scale-[1.01]">
                      <Link href="/checkout" onClick={() => setIsOpen(false)}>
                        Finalizează Comanda <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                  </Button>
                  
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2"
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