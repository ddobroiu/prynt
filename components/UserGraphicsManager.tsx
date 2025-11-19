"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      // Upload
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Eroare la upload");
      const uploadData = await uploadRes.json();

      // Save DB
      const saveRes = await fetch("/api/account/graphics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId, orderItemId: itemId,
          fileUrl: uploadData.url, fileName: file.name,
          publicId: uploadData.public_id, fileSize: file.size, fileType: file.type,
        }),
      });
      
      if (!saveRes.ok) throw new Error("Eroare la salvare");
      const savedGraphic = await saveRes.json();

      setGraphics((prev) => [...prev, savedGraphic]);
      router.refresh();
    } catch (error) {
      alert("Eroare la încărcare.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ștergi fișierul?")) return;
    await fetch(`/api/account/graphics?id=${id}`, { method: "DELETE" });
    setGraphics((prev) => prev.filter((g) => g.id !== id));
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const itemFiles = graphics.filter((g) => g.orderItemId === item.id);
        return (
          <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-black/30 border border-white/10">
            <div className="flex-1">
              <h3 className="font-bold text-white">{item.name}</h3>
              <p className="text-slate-400 text-sm">{item.qty} buc</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {itemFiles.map((f: any) => (
                  <div key={f.id} className="flex items-center gap-2 bg-indigo-500/20 px-2 py-1 rounded text-xs text-indigo-300">
                    <a href={f.fileUrl} target="_blank" className="hover:underline">{f.fileName}</a>
                    <button onClick={() => handleDelete(f.id)} className="text-red-400 hover:text-red-300">✕</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0">
                <label className={`flex items-center justify-center px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white text-sm font-bold transition ${uploadingId === item.id ? 'opacity-50' : ''}`}>
                    {uploadingId === item.id ? 'Se încarcă...' : 'Încarcă Grafică'}
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, item.id)} disabled={!!uploadingId} />
                </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}