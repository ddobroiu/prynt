"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

interface ReorderButtonProps {
  orderId: string;
  className?: string;
  variant?: "primary" | "secondary";
}

export default function ReorderButton({ orderId, className = "", variant = "secondary" }: ReorderButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { addItem } = useCart();

  const handleReorder = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (response.ok && data.items) {
        // Adăugăm fiecare item în coș folosind CartContext
        let addedCount = 0;
        data.items.forEach((item: any) => {
          const metadata = item.metadata || {};
          
          addItem({
            id: `${item.productSlug || item.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            productId: item.productSlug,
            slug: item.productSlug || metadata.productSlug,
            title: item.name,
            width: metadata.width || metadata.w,
            height: metadata.height || metadata.h,
            price: item.price, // Folosim prețul unitar direct din API
            quantity: item.qty || 1,
            currency: "RON",
            metadata: {
              ...metadata,
              artworkUrl: item.artworkUrl,
              category: item.category,
              Material: metadata.Material || metadata.material,
            }
          });
          addedCount++;
        });

        // Afișăm mesaj de succes
        setMessage(`${addedCount} ${addedCount === 1 ? 'produs adăugat' : 'produse adăugate'} în coș!`);
        
        // Redirecționăm la checkout după 1.5 secunde
        setTimeout(() => {
          router.push("/checkout");
        }, 1500);
      } else {
        setMessage(data.error || "Eroare la adăugarea produselor");
      }
    } catch (error) {
      console.error("Reorder error:", error);
      setMessage("Eroare la procesarea comenzii");
    } finally {
      setLoading(false);
    }
  };

  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200";
  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600"
  };

  return (
    <div className="relative">
      <button
        onClick={handleReorder}
        disabled={loading}
        className={`${baseStyles} ${variantStyles[variant]} ${className} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Se procesează...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Comandă din nou
          </>
        )}
      </button>
      
      {message && (
        <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-lg text-xs font-medium text-center ${
          message.includes("Eroare") || message.includes("eroare")
            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
