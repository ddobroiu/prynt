"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingCart, 
  Users, 
  LogOut, 
  ArrowLeft,
  Menu,
  X,
  FileText,
  MessageSquare // <--- Am adăugat importul aici
} from "lucide-react";

const menuItems = [
  { href: "/admin/orders", label: "Comenzi", icon: ShoppingCart, disabled: false },
  { href: "/admin/users", label: "Clienți", icon: Users, disabled: false },
  { href: "/admin/invoices", label: "Facturi", icon: FileText, disabled: false },
  // <--- Am adăugat elementul nou aici
  { href: "/admin/chats", label: "Conversații AI", icon: MessageSquare, disabled: false }, 
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-xl text-white lg:hidden shadow-xl min-w-11 min-h-11 flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
        aria-label={isOpen ? "Închide meniul" : "Deschide meniul"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 h-full w-[280px] sm:w-72 bg-[#09090b]/95 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300 ease-out lg:translate-x-0 safe-area-inset-left ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4 sm:p-6 pb-safe">
          {/* Logo Area */}
          <div className="mb-10 px-2 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg">P</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">
                Prynt<span className="text-indigo-400">.Admin</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase mt-1">
                Control Panel
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.label}
                  href={item.disabled ? "#" : item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-12 touch-manipulation ${
                    item.disabled 
                      ? "opacity-40 cursor-not-allowed text-zinc-500 hover:bg-transparent"
                      : isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                        : "text-zinc-400 hover:text-white hover:bg-white/5 active:bg-white/10"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-zinc-500 group-hover:text-indigo-400 transition-colors"} />
                  {item.label}
                  {item.disabled && (
                    <span className="ml-auto text-[9px] font-bold uppercase bg-white/5 px-1.5 py-0.5 rounded text-zinc-600">
                      WIP
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5 space-y-2">
            <Link 
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group min-h-12 touch-manipulation active:bg-white/10"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Înapoi la Site
            </Link>
            
            {/* Sign Out */}
            <div className="w-full px-4 py-1">
               <form action="/api/auth/signout" method="POST">
                  <button 
                    type="submit"
                    className="w-full flex items-center gap-3 text-sm font-medium text-red-400 hover:text-red-300 transition-colors text-left min-h-10 touch-manipulation"
                  >
                    <LogOut size={18} />
                    Delogare
                  </button>
               </form>
            </div>
          </div>
          
          {/* User Info Mini */}
          <div className="mt-6 flex items-center gap-3 px-2">
             <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400">
               AD
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-xs font-medium text-white truncate">Administrator</p>
               <p className="text-[10px] text-zinc-500 truncate">admin@prynt.ro</p>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
}