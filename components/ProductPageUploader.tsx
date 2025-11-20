"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle, X } from "lucide-react";

interface ProductPageUploaderProps {
  onUploadComplete: (url: string) => void;
}

export default function ProductPageUploader({ onUploadComplete }: ProductPageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validare simplă (opțional)
    if (file.size > 50 * 1024 * 1024) { // 50MB limită
        setError("Fișierul este prea mare (max 50MB).");
        return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "cart_upload"); // IMPORTANT: Asta activează logica fără auth din API

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Eroare la upload");

      const data = await res.json();
      
      // Trimitem URL-ul către componenta părinte (care îl va pune în coș)
      onUploadComplete(data.url);
      setFileName(file.name);
      
    } catch (err) {
      console.error(err);
      setError("Nu s-a putut încărca fișierul. Încearcă din nou.");
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
      setFileName(null);
      onUploadComplete(""); // Ștergem URL-ul din părinte
  };

  return (
    <div className="mt-4 mb-2">
      <label className="block text-sm font-medium text-zinc-700 mb-1">
        Încarcă Grafica (Opțional)
      </label>
      
      {!fileName ? (
        <div className="relative">
            <input 
                type="file" 
                id="product-upload" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={uploading}
                accept="image/*,.pdf,.ai,.psd,.zip,.rar"
            />
            <label 
                htmlFor="product-upload" 
                className={`flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all
                    ${uploading ? "bg-zinc-100 border-zinc-300" : "border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50"}`}
            >
                {uploading ? <Loader2 className="animate-spin text-indigo-600" /> : <Upload className="text-indigo-600" />}
                <span className="text-sm font-medium text-zinc-600">
                    {uploading ? "Se încarcă..." : "Alege fișierul (PDF, AI, TIF)"}
                </span>
            </label>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2 overflow-hidden">
                <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-emerald-700 truncate font-medium">{fileName}</span>
            </div>
            <button onClick={clearFile} className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors">
                <X size={16} />
            </button>
        </div>
      )}
    </div>
  );
}