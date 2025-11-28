"use client";

import React, { useState } from "react";
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Package, 
  MapPin, 
  ShieldCheck,
  User
} from "lucide-react";

// Definim tipurile exact cum vin din page.tsx (serializate)
interface Order {
  id: string;
  total: number; // Acum este sigur number
  status: string;
  createdAt: string;
}

interface Address {
  localitate: string;
  judet: string;
  strada_nr: string;
  isDefault: boolean;
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  emailVerified: string | null;
  orders: Order[];
  addresses: Address[];
}

interface UsersDashboardProps {
  users: UserData[];
}

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 0
  }).format(amount);
};

export default function UsersDashboard({ users = [] }: UsersDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrare
  const filteredUsers = users.filter((user) => {
    const s = searchTerm.toLowerCase();
    const name = (user.name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = (user.phone || "").toLowerCase();

    return name.includes(s) || email.includes(s) || phone.includes(s);
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bara de Căutare */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
        <div className="relative group w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Caută după nume, email sau telefon..."
            className="pl-10 pr-4 min-h-11 sm:min-h-10 sm:py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full transition-all bg-gray-50 focus:bg-white touch-manipulation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center text-xs sm:text-sm text-gray-500 sm:ml-auto">
            {filteredUsers.length} rezultate
        </div>
      </div>

      {/* Lista de Clienți */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-gray-200 border-dashed">
            <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mb-3 flex items-center justify-center bg-gray-50 rounded-full">
                <User size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Niciun client găsit</h3>
            <p className="text-gray-500 text-sm">Încearcă alți termeni de căutare.</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            // Calcule per user
            const ordersCount = user.orders.length;
            
            // Aici este calculul corectat. Pentru că `o.total` este deja number, adunarea funcționează direct.
            const totalSpent = user.orders
                .filter((o) => o.status !== 'canceled')
                .reduce((sum, o) => sum + (o.total || 0), 0);

            const defaultAddress = user.addresses?.[0];

            return (
              <div 
                key={user.id} 
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-5"
              >
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 items-start lg:items-center justify-between">
                  
                  {/* Info Principal */}
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 font-bold text-base sm:text-lg border border-indigo-100">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate flex items-center gap-2">
                        {user.name || "Fără Nume"}
                        {user.emailVerified && <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" aria-label="Email Verificat" role="img" />}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                            <div className="flex items-center gap-1.5">
                                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                                <span>{user.phone}</span>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Statistici User */}
                  <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-6 w-full lg:w-auto border-t lg:border-t-0 border-gray-100 pt-3 sm:pt-4 lg:pt-0">
                    <div className="flex flex-col">
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase">Comenzi</span>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 shrink-0" />
                            <span className="font-bold text-sm sm:text-base text-gray-900">{ordersCount}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase">Total Cheltuit</span>
                        <span className="font-bold text-sm sm:text-base text-emerald-600 mt-0.5">{formatMoney(totalSpent)}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase">Înregistrat</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 text-xs sm:text-sm text-gray-600">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="text-[11px] sm:text-sm">{formatDate(user.createdAt)}</span>
                        </div>
                    </div>
                  </div>

                  {/* Adresa (Dacă există) */}
                  <div className="hidden xl:block w-64 text-sm text-gray-500 border-l border-gray-100 pl-6">
                    {defaultAddress ? (
                        <div className="flex gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="line-clamp-1 text-gray-900 font-medium">{defaultAddress.localitate}, {defaultAddress.judet}</p>
                                <p className="line-clamp-1 text-xs">{defaultAddress.strada_nr}</p>
                            </div>
                        </div>
                    ) : (
                        <span className="text-xs italic text-gray-400">Fără adresă salvată</span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}