"use client";

import React, { useState } from "react";
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Package, 
  MapPin, 
  MoreVertical,
  ShieldCheck,
  User
} from "lucide-react";

interface UsersDashboardProps {
  users: any[];
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMoney = (amount: any) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 0
  }).format(Number(amount));
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
    <div className="space-y-6">
      {/* Bara de Căutare */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative group w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Caută după nume, email sau telefon..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full transition-all bg-gray-50 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center text-sm text-gray-500 ml-auto">
            {filteredUsers.length} rezultate
        </div>
      </div>

      {/* Lista de Clienți */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
            <div className="mx-auto h-12 w-12 text-gray-300 mb-3 flex items-center justify-center bg-gray-50 rounded-full">
                <User size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Niciun client găsit</h3>
            <p className="text-gray-500 text-sm">Încearcă alți termeni de căutare.</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            // Calcule per user
            const ordersCount = user.orders.length;
            const totalSpent = user.orders
                .filter((o: any) => o.status !== 'canceled')
                .reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
            
            const lastOrderDate = user.orders.length > 0 
                ? new Date(Math.max(...user.orders.map((o:any) => new Date(o.createdAt).getTime())))
                : null;

            const defaultAddress = user.addresses?.[0];

            return (
              <div 
                key={user.id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                  
                  {/* Info Principal */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 font-bold text-lg border border-indigo-100">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-base truncate flex items-center gap-2">
                        {user.name || "Fără Nume"}
                        {user.emailVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" title="Email Verificat" />}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate">{user.email}</span>
                        </div>
                        {user.phone && (
                            <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{user.phone}</span>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Statistici User */}
                  <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-start border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium uppercase">Comenzi</span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Package className="w-4 h-4 text-indigo-500" />
                            <span className="font-bold text-gray-900">{ordersCount}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium uppercase">Total Cheltuit</span>
                        <span className="font-bold text-emerald-600 mt-0.5">{formatMoney(totalSpent)}</span>
                    </div>

                    <div className="flex flex-col text-right lg:text-left">
                        <span className="text-xs text-gray-400 font-medium uppercase">Înregistrat</span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-sm text-gray-600">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(user.createdAt)}
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

                  {/* Acțiuni (Placeholder pentru viitor) */}
                  {/* <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button> 
                  */}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}