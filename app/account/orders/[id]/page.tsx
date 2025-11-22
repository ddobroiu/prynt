import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import UserGraphicsManager from "@/components/UserGraphicsManager";

function fmtRON(n: number) {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(n);
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  // FIX: Am scos 'address: true' din include, deoarece este un câmp JSON, nu o relație.
  const order = await prisma.order.findUnique({
    where: { id },
    include: { 
      items: true, // Păstrăm items pentru că este o relație (OrderItem[]) și avem nevoie de ele pentru grafică
    },
  });

  if (!order) notFound();


  // Castăm address la 'any' pentru a accesa proprietățile JSON fără erori de TS
  const address = order.address as any; 

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/account/orders" className="inline-flex items-center text-sm text-zinc-500 hover:text-indigo-600 mb-4">
          <ArrowLeft size={16} className="mr-1" /> Înapoi la comenzi
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Comanda #{order.orderNo || order.id.slice(0,8)}
        </h1>
        <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800">
                {new Date(order.createdAt).toLocaleDateString("ro-RO")}
            </span>
            {/* normalize status label and color */}
            {(() => {
              const s = order.status;
              const label = s === 'active' ? 'În lucru' : s === 'fulfilled' ? 'Finalizată' : (s === 'paid' || s === 'payd') ? 'Plătit' : s === 'canceled' ? 'Anulată' : 'În lucru';
              const colorClass = s === 'fulfilled' || s === 'paid' || s === 'payd' ? 'bg-emerald-100 text-emerald-700' : s === 'canceled' ? 'bg-red-100 text-red-700' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
              return (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${colorClass}`}>
                  {label}
                </span>
              );
            })()}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Coloana Principală */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BLOCUL PENTRU GRAFICĂ (Aici folosim componenta nouă care merge pe produs) */}
          <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5">
             <UserGraphicsManager items={order.items} /> 
          </div>

          {/* Detalii Livrare */}
          <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5">
             <h3 className="font-semibold flex items-center gap-2 mb-3 text-sm uppercase tracking-wide text-zinc-500">
                <MapPin size={16} /> Detalii Livrare
             </h3>
             {address ? (
               <div className="text-sm space-y-1 text-zinc-700 dark:text-zinc-300">
                 <p className="font-bold text-zinc-900 dark:text-white">{address.nume_prenume || address.name}</p>
                 <p>{address.strada}, Nr. {address.numar}</p>
                 <p>{address.localitate}, {address.judet}</p>
                 <p>{address.telefon || address.phone}</p>
               </div>
             ) : (
               <p className="text-sm text-zinc-500">Fără adresă salvată.</p>
             )}

             {/* AWB vizibil dacă există */}
             {order.awbNumber && (
               <div className="mt-4 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800 flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                   <span className="font-semibold">AWB:</span>
                   <span className="font-mono text-indigo-700">{order.awbNumber}</span>
                   {order.awbCarrier && <span className="ml-2 text-xs text-zinc-500">({order.awbCarrier})</span>}
                 </div>
                 <a
                   href={`https://tracking.dpd.ro/?shipmentNumber=${encodeURIComponent(order.awbNumber)}&language=ro`}
                   target="_blank"
                   className="inline-block mt-2 text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-500 transition-colors"
                 >
                   Urmărește livrarea
                 </a>
               </div>
             )}
          </div>
        </div>

        {/* Coloana Dreapta: Sumar */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5 sticky top-24">
             <h3 className="font-semibold flex items-center gap-2 mb-4 text-sm uppercase tracking-wide text-zinc-500">
                <CreditCard size={16} /> Sumar Plată
             </h3>
             <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-zinc-500">Metodă</span>
                    <span className="font-medium capitalize">{order.paymentType === 'Card' || order.paymentType === 'card' ? 'Card' : 'Ramburs'}</span>
                </div>
                <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 my-2" />
                <div className="flex justify-between items-end">
                    <span className="text-zinc-900 dark:text-white font-bold text-lg">Total</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">{fmtRON(Number(order.total))}</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}