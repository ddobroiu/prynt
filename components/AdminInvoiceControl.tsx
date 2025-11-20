"use client";

import { useState } from "react";
import { FileText, Upload, Eye, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminInvoiceControl({ id, invoiceLink }: { id: string; invoiceLink?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      // Presupunem endpoint-ul standard pentru upload factură
      const res = await fetch(`/api/admin/order/${id}/upload-invoice`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      // Refresh rapid sau reload
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Eroare la încărcare factură.");
    } finally {
      setUploading(false);
      setIsOpen(false);
    }
  };

  if (invoiceLink) {
    return (
      <div className="flex gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 w-full bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[10px]"
        >
          <a href={invoiceLink} target="_blank" rel="noopener noreferrer">
            <Eye size={12} className="mr-1" /> Vezi Factura
          </a>
        </Button>
        {/* Buton mic pentru re-upload dacă e nevoie de corecție */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
             <button className="p-1 text-zinc-500 hover:text-white bg-zinc-800/50 rounded border border-white/5" title="Modifică factura">
               <Upload size={10} />
             </button>
          </DialogTrigger>
          <DialogContent className="bg-[#09090b] border-white/10 text-white">
             <DialogHeader><DialogTitle>Înlocuiește Factura</DialogTitle></DialogHeader>
             <div className="py-4">
                <label className="block mb-2 text-sm text-zinc-400">Selectează noul fișier PDF</label>
                <Input type="file" accept=".pdf" onChange={handleUpload} disabled={uploading} className="bg-zinc-900 border-white/10" />
                {uploading && <p className="text-xs text-indigo-400 mt-2 animate-pulse">Se încarcă...</p>}
             </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative">
        <input 
          type="file" 
          id={`invoice-${id}`} 
          className="hidden" 
          accept=".pdf"
          onChange={handleUpload}
          disabled={uploading}
        />
        <label 
          htmlFor={`invoice-${id}`} 
          className={`flex items-center justify-center w-full h-7 rounded border text-[10px] font-medium cursor-pointer transition-all
            ${uploading 
              ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-wait' 
              : 'bg-indigo-600/10 border-indigo-600/30 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500'
            }`}
        >
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <><Upload size={12} className="mr-1" /> Încarcă</>}
        </label>
      </div>
    </div>
  );
}