// components/CartWidget.tsx
"use client";

import React, { useState } from "react";
import { useCart } from "./CartContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  ShoppingCart,
  Trash2,
  Truck,
  Gift,
  ArrowRight,
  Plus,
  Minus,
  FileText,
  X,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { formatMoneyDisplay } from "@/lib/pricing";

const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_COST = 19.99;

export default function CartWidget() {
  const { items, removeItem, updateQuantity, cartTotal, cartCount } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - cartTotal
  );
  const progressPercent = Math.min(
    100,
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  async function exportOfferPdfServer() {
    if (items.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      const shippingCost =
        cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;

      const normalizedItems = items.map((it) => ({
        id: it.id,
        name:
          it.title ||
          (it as any).name ||
          (it as any).productName ||
          it.slug ||
          it.metadata?.title ||
          "Produs",
        quantity: it.quantity,
        unitAmount: it.price,
        totalAmount: it.price * it.quantity,
        artworkUrl: it.metadata?.artworkUrl || null,
        metadata: it.metadata || {},
      }));

      const res = await fetch("/api/pdf/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: normalizedItems, shipping: shippingCost }),
      });

      if (!res.ok) throw new Error("Generarea PDF a eșuat");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toLocaleDateString("ro-RO");
      a.href = url;
      a.download = `oferta-prynt-${date}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.message || "Nu s-a putut genera PDF-ul.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="relative flex items-center gap-2 px-3 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-all"
          aria-label="Deschide coșul de cumpărături"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-slate-950 dark:text-zinc-300"
          >
            <path
              d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.2 16.5H17M17 16.5C15.9 16.5 15 17.4 15 18.5C15 19.6 15.9 20.5 17 20.5C18.1 20.5 19 19.6 19 18.5C19 17.4 18.1 16.5 17 16.5ZM9 18.5C9 19.6 8.1 20.5 7 20.5C5.9 20.5 5 19.6 5 18.5C5 17.4 5.9 16.5 7 16.5C8.1 16.5 9 17.4 9 18.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-slate-950 dark:text-zinc-300 text-sm font-medium">
            Coș
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[11px] font-semibold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent
        aria-describedby="cart-description"
        className="fixed inset-y-0 right-0 left-auto h-full w-full sm:max-w-[450px] max-w-none flex flex-col p-0 gap-0 rounded-none border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right duration-300 m-0 translate-x-0 translate-y-0 [&>button]:hidden"
      >
        <p id="cart-description" className="sr-only">
          Coșul tău de cumpărături cu produsele adăugate
        </p>

        {/* HEADER */}
        <div className="shrink-0 z-20 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="px-4 py-3 flex items-center justify-between">
            <DialogTitle className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Coșul Tău{" "}
              <span className="text-slate-700 dark:text-slate-400 text-sm font-medium font-sans">
                ({cartCount})
              </span>
            </DialogTitle>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all duration-200"
              aria-label="Închide coșul"
            >
              <X size={20} />
            </button>
          </div>

          {items.length > 0 && (
            <div className="px-4 pb-3">
              <button
                onClick={exportOfferPdfServer}
                disabled={isGeneratingPdf}
                className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/50 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-slate-700"
              >
                {isGeneratingPdf ? (
                  <span className="animate-pulse">Se generează...</span>
                ) : (
                  <>
                    <FileText size={14} />
                    Descarcă Ofertă PDF
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* BARĂ LIVRARE GRATUITĂ */}
        {items.length > 0 && (
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            {remainingForFreeShipping > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-300 flex items-center gap-1.5">
                    <Truck size={12} className="text-indigo-600" />
                    Livrare Gratuită
                  </span>
                  <span className="text-[10px] text-slate-800 dark:text-slate-400 font-semibold">
                    încă{" "}
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {formatMoneyDisplay(remainingForFreeShipping)}
                    </span>
                  </span>
                </div>

                <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold justify-center">
                <Gift size={14} />
                Beneficiezi de Livrare Gratuită!
              </div>
            )}
          </div>
        )}

        {/* LISTĂ PRODUSE */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-4 bg-white dark:bg-slate-900 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-slate-500 dark:text-slate-500" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  Coșul este gol
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Nu ai adăugat încă niciun produs.
                </p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Continuă Cumpărăturile
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const anyItem: any = item as any;
              const productTitle =
                item.title ||
                anyItem.name ||
                anyItem.productName ||
                item.slug ||
                item.metadata?.title ||
                "Produs";

              return (
                <div
                  key={item.id}
                  className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  {/* IMAGINE PRODUS */}
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                    {(() => {
                      // Prioritate: artwork încărcat de client
                      const artworkSrc =
                        anyItem.artworkUrl ||
                        item.metadata?.artworkUrl ||
                        item.metadata?.artworkLink ||
                        item.metadata?.artwork;

                      // Fallback: imaginea principală a produsului
                      const productSrc =
                        anyItem.image ||
                        anyItem.src ||
                        anyItem.imageUrl ||
                        anyItem.thumbnail ||
                        item.metadata?.image ||
                        item.metadata?.productImage;

                      const imgSrc = artworkSrc || productSrc;

                      if (!imgSrc) {
                        return (
                          <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-800">
                            <span className="text-[10px] font-bold">NO IMG</span>
                          </div>
                        );
                      }

                      return (
                        <img
                          src={imgSrc}
                          alt={productTitle}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const el = e.currentTarget as HTMLImageElement;
                            el.onerror = null;
                            el.style.display = "none";
                          }}
                        />
                      );
                    })()}
                  </div>

                  {/* DETALII PRODUS */}
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3
                          className="font-bold text-[15px] sm:text-base text-slate-900 dark:text-white leading-snug flex-1 min-w-0"
                          style={{
                            overflow: "visible",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            display: "block",
                          }}
                        >
                          <Link
                            href={`/${item.slug || "shop"}`}
                            onClick={() => setIsOpen(false)}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            {productTitle}
                          </Link>
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-700 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {item.width && item.height && (
                          <span className="text-[10px] text-slate-900 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {item.width}x{item.height}cm
                          </span>
                        )}
                        {item.metadata?.Material && (
                          <span className="text-[10px] text-slate-900 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                            {item.metadata.Material}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CANTITATE & PREȚ */}
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 h-7">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 h-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-l-md transition-colors disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 h-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-r-md transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-bold text-sm text-indigo-700 dark:text-indigo-400">
                        {formatMoneyDisplay(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 p-4 pb-safe bg-white dark:bg-slate-900 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs text-slate-700 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Total Estimat
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  (TVA inclus)
                </p>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatMoneyDisplay(cartTotal)}
              </p>
            </div>

            <div className="grid gap-3">
              <Button className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none rounded-xl transition-all" asChild>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  Finalizează Comanda <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm font-semibold text-slate-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center justify-center gap-1"
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
