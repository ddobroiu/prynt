'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  MessageSquare
} from 'lucide-react';
import SignOutButton from './SignOutButton';

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/orders",
    icon: LayoutDashboard
  },
  {
    title: "Comenzi",
    href: "/admin/orders",
    icon: ShoppingCart
  },
  {
    title: "Utilizatori",
    href: "/admin/users",
    icon: Users
  },
  {
    title: "Facturi",
    href: "/admin/invoices",
    icon: FileText
  },
  {
    title: "Conversații AI",
    href: "/admin/chats",
    icon: MessageSquare // Iconiță nouă pentru Chat
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r h-screen sticky top-0">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-slate-900">Prynt Admin</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-slate-900 text-white" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <SignOutButton />
      </div>
    </div>
  );
}