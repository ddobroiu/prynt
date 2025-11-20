"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Definim interfața compatibilă cu modelul Prisma (OrderItem)
interface OrderItem {
  id: string;
  name: string; // Actualizat din productName pentru a corespunde cu DB
  qty: number;  // Actualizat din quantity pentru a corespunde cu DB
  artworkUrl?: string | null;
  // Alte câmpuri opționale care pot veni din DB dar nu le folosim aici (ex: price, total) sunt acceptate implicit
}

interface UserGraphicsManagerProps {
  items: OrderItem[]; // Primim lista de produse
}

export default function UserGraphicsManager({ items }: UserGraphicsManagerProps) {
  const router = useRouter();
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validare simplă 50MB
    if (file.size > 50 * 1024 * 1024) {
      alert("Fișierul este prea mare. Limita este de 50MB.");
      return;
    }

    setUploadingId(itemId);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "order_item_artwork"); // IMPORTANT: Tipul corect pentru API
    formData.append("publicId", itemId); // Trimitem ID-ul produsului (OrderItem), nu al comenzii

    // ...existing code...

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const apiResponse = await res.json();
      console.log("Răspuns API upload:", apiResponse);
      if (!res.ok) throw new Error(apiResponse?.error || "Eroare upload");

      router.refresh(); // Reîmprospătăm pagina pentru a vedea noul status
    } catch (error) {
      console.error(error);
      alert(`Eroare la încărcare. ID produs: ${itemId}. Mesaj: ${error}`);
    } finally {
      setUploadingId(null);
    }
  };

  // Sortează produsele după id (sau după createdAt dacă există)
  const sortedItems = [...items].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
           Fișiere Grafice
           <span className="text-xs font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
             {items.length} articole
           </span>
        </h3>
        <Button variant="ghost" size="sm" onClick={() => router.refresh()} className="h-8">
          <RefreshCw size={14} className="mr-1.5" /> Actualizează
        </Button>
      </div>

      <div className="grid gap-4">
        {sortedItems.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
          >
            {/* Detalii Produs */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="shrink-0 inline-flex items-center justify-center h-6 min-w-6 px-1.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  {item.qty}x
                </span>
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                  {item.name || "Produs Personalizat"}
                </span>
                {/* ID-ul produsului nu se mai afișează pentru client */}
              </div>
              
              {/* Status */}
              <div className="flex items-center gap-2 mt-2">
                {item.artworkUrl ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/20">
                    <CheckCircle size={12} />
                    Fișier recepționat
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 px-2.5 py-1 rounded-md border border-amber-100 dark:border-amber-900/20">
                    <AlertCircle size={12} />
                    Așteaptă încărcarea
                  </div>
                )}
              </div>
            </div>

            {/* Zona Butoane */}
            <div className="shrink-0 w-full md:w-auto">
               <div className="relative">
                  <input
                    type="file"
                    id={`upload-${item.id}`}
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, item.id)}
                    disabled={uploadingId === item.id}
                    accept="image/*,.pdf,.ai,.psd,.zip,.rar,.tiff"
                  />
                  
                  {item.artworkUrl ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto border-zinc-200 dark:border-zinc-700">
                            <a href={item.artworkUrl} target="_blank" rel="noopener noreferrer">
                                <FileText size={14} className="mr-2 text-indigo-500" /> Vezi Fișierul
                            </a>
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto text-zinc-500 hover:text-zinc-900">
                            <label htmlFor={`upload-${item.id}`} className="cursor-pointer">
                                {uploadingId === item.id ? <Loader2 className="animate-spin" size={14}/> : "Înlocuiește"}
                            </label>
                        </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                        <Button size="sm" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                        <label htmlFor={`upload-${item.id}`} className="cursor-pointer flex items-center justify-center gap-2">
                            {uploadingId === item.id ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Se încarcă...
                            </>
                            ) : (
                            <>
                                <Upload size={16} /> Încarcă Grafica
                            </>
                            )}
                        </label>
                        </Button>
                        <p className="text-[10px] text-zinc-400 text-center">
                            PDF, AI, TIFF, ZIP (max 50MB)
                        </p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}