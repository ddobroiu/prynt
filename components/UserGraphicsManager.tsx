"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, Trash2, Loader } from "lucide-react";

type UserGraphic = {
  id: string;
  originalName: string;
  storagePath: string; // This will be the secure_url from Cloudinary
  size: number;
  mimeType: string;
  createdAt: string;
};

export default function UserGraphicsManager() {
  const [graphics, setGraphics] = useState<UserGraphic[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGraphics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/graphics");
      if (!res.ok) throw new Error("A apărut o eroare la încărcarea graficelor.");
      const data = await res.json();
      setGraphics(data.graphics);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraphics();
  }, [fetchGraphics]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        // Step 1: Upload to Cloudinary via our existing API
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Încărcarea fișierului a eșuat.");
        }

        const uploadData = await uploadRes.json();
        
        // Step 2: Save metadata to our database
        const saveRes = await fetch("/api/account/graphics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                originalName: file.name,
                storagePath: uploadData.url, // secure_url from Cloudinary
                publicId: uploadData.public_id, // public_id for future deletions
                size: file.size,
                mimeType: file.type,
            }),
        });

        if (!saveRes.ok) {
            throw new Error("A apărut o eroare la salvarea fișierului.");
        }

        // Refresh the list
        await fetchGraphics();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    },
    [fetchGraphics]
  );

  const handleDelete = async (graphicId: string) => {
    if (!confirm("Ești sigur că vrei să ștergi această grafică? Acțiunea este ireversibilă.")) {
      return;
    }

    try {
      const res = await fetch(`/api/account/graphics/${graphicId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "A apărut o eroare la ștergerea fișierului.");
      }
      
      // Refresh list on success
      setGraphics(prev => prev.filter(g => g.id !== graphicId));

    } catch (err: any) {
      setError(err.message);
    }
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
        'image/*': ['.jpeg', '.png', '.jpg'],
        'application/pdf': ['.pdf'],
        'application/postscript': ['.ai', '.eps'],
        'image/vnd.adobe.photoshop': ['.psd'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? "border-indigo-600 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
            {uploading ? (
                <>
                    <Loader className="animate-spin w-8 h-8 text-indigo-600" />
                    <p className="mt-2 text-sm text-gray-600">Se încarcă...</p>
                </>
            ) : isDragActive ? (
                <p className="text-lg font-semibold text-indigo-700">Eliberează fișierul aici</p>
            ) : (
                <p className="text-gray-500">
                Trage un fișier aici, sau <span className="font-semibold text-indigo-600">apasă pentru a selecta</span>
                </p>
            )}
            <p className="text-xs text-gray-400 mt-2">Suportă: PDF, AI, PSD, JPG, PNG</p>
        </div>
      </div>
      
      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

      <div>
        <h3 className="text-lg font-semibold mb-4">Grafica Ta</h3>
        {loading ? (
          <p className="text-gray-500">Se încarcă...</p>
        ) : graphics.length === 0 ? (
          <p className="text-gray-500">Nu ai încărcat nicio grafică.</p>
        ) : (
          <ul className="space-y-3">
            {graphics.map((graphic) => (
              <li key={graphic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileIcon className="w-6 h-6 text-gray-500" />
                  <div>
                    <a href={graphic.storagePath} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-700 hover:underline">
                      {graphic.originalName}
                    </a>
                    <div className="text-xs text-gray-500">
                      {(graphic.size / 1024 / 1024).toFixed(2)} MB - {new Date(graphic.createdAt).toLocaleDateString("ro-RO")}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(graphic.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
