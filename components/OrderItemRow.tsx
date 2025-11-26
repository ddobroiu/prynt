"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderItemProps = {
  item: {
    id: string;
    name: string;
    qty: number;
    price: number;
    total: number;
    artworkUrl: string | null;
  };
};

export default function OrderItemRow({ item }: OrderItemProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formatare preț
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
    }).format(amount);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Upload pe Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Try to parse JSON; if the server returned HTML/text, surface it for debugging
      let uploadData: any;
      try {
        uploadData = await uploadRes.json();
      } catch (jsonErr) {
        const text = await uploadRes.text();
        throw new Error(text || uploadRes.statusText || 'Eroare la încărcarea fișierului.');
      }
      if (!uploadRes.ok) throw new Error(uploadData?.error || 'Eroare la încărcarea fișierului.');
      const artworkUrl = uploadData.url;

      // 2. Salvare link în Baza de Date
      const saveRes = await fetch("/api/order/item/artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          artworkUrl: artworkUrl,
        }),
      });

      if (!saveRes.ok) throw new Error("Nu s-a putut salva link-ul graficii.");

      // Refresh la pagină pentru a vedea modificările
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError("Eroare: " + (err.message || "Necunoscută"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700 gap-4">
      {/* Detalii Produs */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
        <p className="text-sm text-gray-500">
          {item.qty} x {formatMoney(item.price)}
        </p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Preț Total Linie */}
      <div className="font-bold text-gray-900 dark:text-white sm:text-right min-w-[100px]">
        {formatMoney(item.total)}
      </div>

      {/* Zona de Acțiune (Upload / Vizualizare) */}
      <div className="sm:min-w-[200px] flex justify-end">
        {item.artworkUrl ? (
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
              ✓ Grafică încărcată
            </span>
            <a
              href={item.artworkUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:underline"
            >
              Vezi fișierul
            </a>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              id={`upload-${item.id}`}
              className="hidden"
              accept="image/*,application/pdf,.ai,.psd,.zip"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <label
              htmlFor={`upload-${item.id}`}
              className={`cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-md ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200"
              }`}
            >
              {uploading ? "Se încarcă..." : "⬆ Încarcă Grafica"}
            </label>
            <p className="text-[10px] text-gray-400 mt-1 text-center">
              PDF, JPG, AI (Max 50MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}