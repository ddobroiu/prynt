"use client";

import { useCart } from "./CartContext";

function formatMoneyDisplay(amount: number): string {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export default function FreeShippingIndicator() {
  const { cartTotal } = useCart();
  
  const freeShippingThreshold = 500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const isFreeShipping = cartTotal >= freeShippingThreshold;

  return (
    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl shadow-sm">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <div className="flex flex-col">
          {isFreeShipping ? (
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              🎉 Livrare GRATUITĂ!
            </span>
          ) : (
            <>
              <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                +{formatMoneyDisplay(remainingForFreeShipping)} RON → livrare gratuită
              </span>
              <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
