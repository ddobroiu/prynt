"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserData {
  id?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

interface UserDetailsFormProps {
  user: UserData;
}

export default function UserDetailsForm({ user }: UserDetailsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  // Actualizăm formularul dacă datele userului se schimbă (ex: la reîncărcarea sesiunii)
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/account/details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Eroare la actualizare');

      setMessage({ type: 'success', text: 'Datele au fost actualizate cu succes!' });
      router.refresh(); // Reîmprospătează datele server-side
    } catch (error) {
      setMessage({ type: 'error', text: 'Nu s-a putut salva. Încearcă din nou.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      
      {/* Email - Read Only */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input 
          value={user?.email || ""} 
          disabled 
          className="bg-gray-100 text-gray-500 cursor-not-allowed" 
        />
        <p className="text-xs text-gray-400">Adresa de email nu poate fi schimbată.</p>
      </div>

      {/* Nume */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">Nume Complet</label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Ion Popescu"
        />
      </div>

      {/* Telefon */}
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Telefon</label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="07xx xxx xxx"
        />
      </div>

      {/* Mesaje Erorare/Succes */}
      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
        {loading ? "Se salvează..." : "Salvează Modificările"}
      </Button>
    </form>
  );
}