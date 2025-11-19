"use client";

import { useState } from "react";
import { MapPin, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AddressData {
  nume_prenume?: string;
  telefon?: string;
  strada?: string;
  numar?: string;
  bloc?: string;
  scara?: string;
  etaj?: string;
  apartament?: string;
  localitate?: string;
  judet?: string;
  cod_postal?: string;
}

export default function AdminAddressEditor({ orderId, initialAddress, onUpdate }: { orderId: string, initialAddress: any, onUpdate?: () => void }) {
  const [address, setAddress] = useState<AddressData>(initialAddress || {});
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof AddressData, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const saveAddress = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/update-address`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address })
      });

      if (!res.ok) throw new Error("Eroare la salvare");
      
      setIsOpen(false);
      if (onUpdate) onUpdate();
      alert("Adresa a fost actualizată!");
    } catch (error) {
      console.error(error);
      alert("Nu s-a putut actualiza adresa.");
    } finally {
      setLoading(false);
    }
  };

  // Formatare vizuală compactă pentru tabel
  const compactView = (
    <div className="flex flex-col gap-0.5 text-xs group cursor-pointer" onClick={() => setIsOpen(true)}>
      <div className="font-semibold text-white flex items-center gap-2">
        {address.nume_prenume || "Nume lipsă"}
        <Edit2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
      </div>
      <div className="text-zinc-400">
        {address.strada} {address.numar ? `Nr. ${address.numar}` : ""}
      </div>
      <div className="text-zinc-400">
        {address.localitate}, {address.judet}
      </div>
      <div className="text-indigo-400 font-mono mt-0.5">{address.telefon}</div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {compactView}
      </DialogTrigger>
      <DialogContent className="bg-[#09090b] border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin size={18} className="text-indigo-500" />
            Editează Adresa Livrare
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block">Nume Destinatar</label>
              <Input value={address.nume_prenume || ""} onChange={e => handleChange("nume_prenume", e.target.value)} className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Telefon</label>
              <Input value={address.telefon || ""} onChange={e => handleChange("telefon", e.target.value)} className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Județ</label>
              <Input value={address.judet || ""} onChange={e => handleChange("judet", e.target.value)} className="bg-white/5 border-white/10" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block">Localitate</label>
              <Input value={address.localitate || ""} onChange={e => handleChange("localitate", e.target.value)} className="bg-white/5 border-white/10" />
            </div>
             <div className="col-span-2">
              <label className="text-xs text-zinc-500 mb-1 block">Stradă</label>
              <Input value={address.strada || ""} onChange={e => handleChange("strada", e.target.value)} className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Număr</label>
              <Input value={address.numar || ""} onChange={e => handleChange("numar", e.target.value)} className="bg-white/5 border-white/10" />
            </div>
             <div>
              <label className="text-xs text-zinc-500 mb-1 block">Bloc/Scara/Ap</label>
              <Input 
                placeholder="Bl. A, Sc. 1, Ap. 10"
                value={[address.bloc, address.scara, address.apartament].filter(Boolean).join(", ")} 
                onChange={e => {
                   // Simplificare: stocăm tot în bloc pentru editare rapidă, sau poți separa
                   handleChange("bloc", e.target.value) 
                }} 
                className="bg-white/5 border-white/10" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="border-white/10 hover:bg-white/5 text-zinc-300">
            Anulează
          </Button>
          <Button onClick={saveAddress} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            {loading ? "Se salvează..." : "Salvează Modificările"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}