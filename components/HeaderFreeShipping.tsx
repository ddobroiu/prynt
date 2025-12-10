"use client";

import { useCart } from "./CartContext";
import { Truck } from "lucide-react";
import { formatMoneyDisplay } from "@/lib/pricing";

const FREE_SHIPPING_THRESHOLD = 500;

export default function HeaderFreeShipping() {
  const { cartTotal } = useCart();
  
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Nu afișa nimic dacă nu e nimic în coș
  if (cartTotal === 0) return null;

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-indigo-950/30 border-2 border-slate-200 dark:border-indigo-800 rounded-lg shadow-sm">
      {remainingForFreeShipping > 0 ? (
        <>
          <Truck size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 dark:text-white whitespace-nowrap">
            +{formatMoneyDisplay(remainingForFreeShipping)} pentru livrare gratuită
          </span>
          <div className="relative h-1.5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shrink-0">
            <div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-700 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </>
      ) : (
        <>
          <Truck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
            🎉 Livrare Gratuită!
          </span>
        </>
      )}
    </div>
  );
}
