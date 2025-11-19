"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, FileText, Loader2 } from "lucide-react";

interface Props {
  orderId: string;
  items: any[];
  initialGraphics: any[];
}

export default function UserGraphicsManager({ orderId, items, initialGraphics }: Props) {
  const [graphics, setGraphics] = useState(initialGraphics);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(itemId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload fișier fizic
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const uploadData = await uploadRes.json();

      // 2. Salvare în baza de date
      const saveRes = await fetch("/api/account/graphics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          orderItemId: itemId,
          fileUrl: uploadData.url,
          fileName: file.name,
          publicId: uploadData.public_id,
          fileSize: file.size,
          fileType: file.type,
        }),
      });

      if (!saveRes.ok) throw new Error("Save failed");
      const savedGraphic = await saveRes.json();

      setGraphics((prev) => [...prev, savedGraphic]);
      router.refresh();
    } catch (error) {
      alert("A apărut o eroare la încărcare. Încearcă din nou.");
      console.error(error);
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ștergi acest fișier?")) return;
    try {
      await fetch(`/api/account/graphics?id=${id}`, { method: "DELETE" });
      setGraphics((prev) => prev.filter((g) => g.id !== id));
      router.refresh();
    } catch (e) {
      alert("Eroare la ștergere.");
    }
  };

  if (!items || items.length === 0) {
    return <div className="text-white p-4">Nu există produse în această comandă.</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const itemFiles = graphics.filter((g) => g.orderItemId === item.id);

        return (
          <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            
            {/* Info Produs */}
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">{item.name}</h3>
              <p className="text-slate-400 text-sm">Cantitate: {item.qty} buc</p>
              
              {/* Lista Fișiere */}
              <div className="mt-3 flex flex-wrap gap-2">
                {itemFiles.length > 0 ? (
                  itemFiles.map((file: any) => (
                    <div key={file.id} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-sm text-indigo-300">
                      <FileText size={14} />
                      <a href={file.fileUrl} target="_blank" className="hover:underline truncate max-w-[150px]">{file.fileName}</a>
                      <button onClick={() => handleDelete(file.id)} className="ml-2 text-rose-400 hover:text-rose-300">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                    Lipsă grafică
                  </span>
                )}
              </div>
            </div>

            {/* Zona Upload */}
            <div className="flex flex-col justify-center shrink-0 min-w-[200px]">
                <label className={`
                    flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed cursor-pointer transition-all
                    ${uploadingId === item.id 
                        ? 'bg-slate-800 border-slate-600 text-slate-400 cursor-wait' 
                        : 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20 hover:border-indigo-500'
                    }
                `}>
                    {uploadingId === item.id ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span className="text-sm font-medium">Se încarcă...</span>
                        </>
                    ) : (
                        <>
                            <Upload size={18} />
                            <span className="text-sm font-medium">Alege fișier</span>
                        </>
                    )}
                    <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.ai,.psd,.tiff,.jpg,.png"
                        disabled={uploadingId === item.id}
                        onChange={(e) => handleFileUpload(e, item.id)}
                    />
                </label>
                <div className="text-[10px] text-slate-500 text-center mt-1">
                    PDF, AI, TIFF, JPG (Max 50MB)
                </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}