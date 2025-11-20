"use client";

import { useState } from "react";
import { MapPin, Edit2, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminAddressEditor({ orderId, initialAddress, onUpdate }: { orderId: string, initialAddress: any, onUpdate?: () => void }) {
  const [address, setAddress] = useState(initialAddress || {});
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setAddress((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveAddress = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/orders/${orderId}/update-address`, {
        method: "PATCH",
        body: JSON.stringify({ address })
      });
      setIsOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      alert("Eroare la salvare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-semibold text-white text-xs">
                    <User size={12} className="text-zinc-500" />
                    {address.nume_prenume || "Nume lipsă"}
                </div>
                <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity" />
            </div>
            
            <div className="text-[11px] text-zinc-400 leading-relaxed pl-4 border-l border-zinc-800 ml-0.5">
                <div>{address.strada} {address.numar ? `Nr. ${address.numar}` : ""}</div>
                <div>{address.localitate}, {address.judet}</div>
                {address.cod_postal && <div>{address.cod_postal}</div>}
            </div>
            
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-indigo-300 font-mono pl-0.5">
                <Phone size={10} />
                {address.telefon}
            </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-[#09090b] border-white/10 text-white">
        <DialogHeader><DialogTitle>Editează Adresa</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-4">
           <Input placeholder="Nume Prenume" value={address.nume_prenume || ""} onChange={e => handleChange("nume_prenume", e.target.value)} className="bg-zinc-900 border-white/10" />
           <Input placeholder="Telefon" value={address.telefon || ""} onChange={e => handleChange("telefon", e.target.value)} className="bg-zinc-900 border-white/10" />
           <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Județ" value={address.judet || ""} onChange={e => handleChange("judet", e.target.value)} className="bg-zinc-900 border-white/10" />
              <Input placeholder="Localitate" value={address.localitate || ""} onChange={e => handleChange("localitate", e.target.value)} className="bg-zinc-900 border-white/10" />
           </div>
           <Input placeholder="Stradă" value={address.strada || ""} onChange={e => handleChange("strada", e.target.value)} className="bg-zinc-900 border-white/10" />
           <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Număr" value={address.numar || ""} onChange={e => handleChange("numar", e.target.value)} className="bg-zinc-900 border-white/10" />
              <Input placeholder="Bloc/Ap" value={address.bloc || ""} onChange={e => handleChange("bloc", e.target.value)} className="bg-zinc-900 border-white/10" />
           </div>
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="border-white/10 text-zinc-400">Anulează</Button>
            <Button onClick={saveAddress} className="bg-indigo-600 text-white hover:bg-indigo-500">Salvează</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}