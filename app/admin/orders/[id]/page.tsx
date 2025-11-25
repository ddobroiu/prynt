// app/admin/orders/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Save, CreditCard, MapPin } from "lucide-react";
import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/adminSession";
import EditOrderClient from "./EditOrderClient"; // Vom crea această componentă client mai jos
import AdminAwbControl from "@/components/AdminAwbControl";
import { getOrder } from '@/lib/orderStore';

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Verificare Auth
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth")?.value;
  if (!verifyAdminSession(token)) {
    redirect("/admin/login");
  }

  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editare Comandă #{order.orderNo}</h1>
              <p className="text-sm text-gray-500">ID: {order.id}</p>
            </div>
          </div>
          <div>
            {/* Status badge: map internal status to friendly label + color */}
            {(() => {
              const s = String(order.status || '');
              const label = s === 'active' ? 'În lucru' : s === 'fulfilled' ? 'Finalizată' : (s === 'paid' || s === 'payd') ? 'Plătit' : s === 'canceled' ? 'Anulată' : s;
              const cls = s === 'fulfilled' || s === 'paid' || s === 'payd' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : s === 'canceled' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100';
              return (
                <div className={`px-4 py-2 rounded-lg font-bold text-sm border ${cls}`}>
                  Status: {label}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coloana Stânga - Produse */}
          <div className="lg:col-span-2 space-y-6">
            <EditOrderClient order={order} />
          </div>

          {/* Coloana Dreapta - Info */}
          <div className="space-y-6">
            {/* Total */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <CreditCard className="w-4 h-4 text-gray-400" /> Sumar Financiar
               </h3>
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between text-gray-600">
                   <span>Transport</span>
                   <span>{Number(order.shippingFee).toFixed(2)} RON</span>
                 </div>
                 <div className="flex justify-between text-gray-900 font-bold text-lg pt-2 border-t border-gray-100">
                   <span>Total</span>
                   <span>{Number(order.total).toFixed(2)} RON</span>
                 </div>
               </div>
            </div>

            {/* Adresa (Read-only aici, editarea e in alt endpoint daca e nevoie) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Livrare
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-900">{(order.address as any).nume_prenume}</p>
                  <p>{(order.address as any).email}</p>
                  <p>{(order.address as any).telefon}</p>
                  <hr className="my-2 border-dashed" />
                  <p>{(order.address as any).localitate}, {(order.address as any).judet}</p>
                  <p>{(order.address as any).strada_nr}</p>
                </div>
                {/* AWB control - tracking + download */}
                <div className="mt-4">
                  <AdminAwbControl orderId={order.id} currentAwb={order.awbNumber} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}