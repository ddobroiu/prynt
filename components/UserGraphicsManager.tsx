"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  name: string;
  qty: number;
  width?: number;
  height?: number;
};

type UserGraphic = {
  id: string;
  fileUrl: string;
  fileName?: string;
  orderItemId?: string | null;
};

type Order = {
  id: string;
  items: any[];
};

interface UserGraphicsManagerProps {
  order: Order;
  initialGraphics: any[];
}

export default function UserGraphicsManager({
  order,
  initialGraphics,
}: UserGraphicsManagerProps) {
  const [graphics, setGraphics] = useState<UserGraphic[]>(initialGraphics);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUploadSuccess = async (result: any, itemId: string) => {
    // Rezultatul de la Cloudinary
    const info = result.info;
    
    if (!info) return;

    const payload = {
      orderId: order.id,
      orderItemId: itemId,
      fileUrl: info.secure_url,
      fileName: info.original_filename + "." + info.format,
      publicId: info.public_id,
      fileSize: info.bytes,
      fileType: info.format,
    };

    try {
      setLoading(true);
      // Salvăm în baza de date
      const res = await fetch("/api/account/graphics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Eroare la salvarea în baza de date");

      const savedGraphic = await res.json();

      // Actualizăm starea locală
      setGraphics((prev) => [...prev, savedGraphic]);
      router.refresh(); // Reîmprospătăm datele server-side
    } catch (error) {
      console.error("Upload error:", error);
      alert("A apărut o eroare la salvarea graficii.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (graphicId: string) => {
    if (!confirm("Sigur vrei să ștergi acest fișier?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/account/graphics?id=${graphicId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Eroare la ștergere");

      setGraphics((prev) => prev.filter((g) => g.id !== graphicId));
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Nu s-a putut șterge fișierul.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {order.items.map((item: OrderItem) => {
        // Găsim grafica asociată acestui item (dacă există)
        const itemGraphics = graphics.filter((g) => g.orderItemId === item.id);

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.07]"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg text-white">{item.name}</h3>
                <div className="text-sm text-slate-400 mt-1">
                  Cantitate: {item.qty} buc 
                  {item.width && item.height ? ` • Dimensiuni: ${item.width}x${item.height} cm` : ""}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {/* Butonul de Upload Cloudinary */}
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "prynt_uploads"}
                  options={{
                    sources: ["local", "url", "google_drive"],
                    multiple: false,
                    maxFiles: 1,
                    language: "ro",
                    text: {
                        ro: {
                            menu: {
                                files: "Fișierele mele",
                            },
                            local: {
                                browse: "Răsfoiește",
                                dd_title_single: "Trage fișierul aici",
                            }
                        }
                    }
                  }}
                  onSuccess={(result) => handleUploadSuccess(result, item.id)}
                >
                  {({ open }) => {
                    return (
                      <button
                        onClick={() => open()}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        {itemGraphics.length > 0 ? "Adaugă alt fișier" : "Încarcă Grafică"}
                      </button>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </div>

            {/* Lista fișierelor încărcate pentru acest produs */}
            {itemGraphics.length > 0 ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Fișiere atașate:</p>
                {itemGraphics.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                       <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-indigo-500/20 text-indigo-400">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                           <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 3.414L15.586 7A2 2 0 0116 8.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                         </svg>
                       </div>
                       <div className="truncate">
                         <a 
                           href={g.fileUrl} 
                           target="_blank" 
                           rel="noreferrer" 
                           className="block truncate text-sm font-medium text-indigo-300 hover:underline hover:text-indigo-200"
                         >
                           {g.fileName || "Fișier fără nume"}
                         </a>
                       </div>
                    </div>
                    <button
                      onClick={() => handleDelete(g.id)}
                      disabled={loading}
                      className="ml-2 text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Șterge fișier"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-500/80 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                   <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                 </svg>
                 <span>Nu a fost încărcată nicio grafică pentru acest produs.</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}