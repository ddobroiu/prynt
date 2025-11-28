import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import UserGraphicsManager from "@/components/UserGraphicsManager";

function fmtRON(n: number) {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(n);
}

function getStatusConfig(status: string) {
  const configs: Record<string, { label: string; color: string; icon: JSX.Element }> = {
    active: {
      label: 'În procesare',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    processing: {
      label: 'În lucru',
      color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    shipped: {
      label: 'Expediată',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      )
    },
    fulfilled: {
      label: 'Finalizată',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    paid: {
      label: 'Plătită',
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    canceled: {
      label: 'Anulată',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  return configs[status] || configs.active;
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
  const shippingAddress = address;
  const orderTotal = order.items.reduce((sum, item) => sum + Number(item.price), 0);
  const statusConfig = getStatusConfig(order.status);
  
  // Serializăm items pentru a converti Decimal în number
  const serializedItems = order.items.map(item => ({
    ...item,
    price: Number(item.price),
    unit: item.unit ? Number(item.unit) : null,
    total: item.total ? Number(item.total) : null,
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link
            href="/account?tab=orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Înapoi la comenzi
          </Link>
          
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Comanda #{order.orderNo || order.id.slice(0, 8)}
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Plasată pe {new Date(order.createdAt).toLocaleDateString('ro-RO', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color} font-medium text-sm`}>
              {statusConfig.icon}
              {statusConfig.label}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Produse comandate
                </h2>
              </div>
              
              <div className="p-6">
                <UserGraphicsManager items={serializedItems} />
              </div>
            </div>

            {/* Shipping Info */}
            {shippingAddress && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-cyan-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Adresa de livrare
                  </h2>
                </div>
                
                <div className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white">{shippingAddress.nume_prenume || shippingAddress.name || 'N/A'}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{shippingAddress.telefon || shippingAddress.phone || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-zinc-900 dark:text-white">
                        {shippingAddress.strada_nr || `${shippingAddress.strada || ''} ${shippingAddress.numar ? `Nr. ${shippingAddress.numar}` : ''}`.trim() || shippingAddress.address || 'N/A'}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {[shippingAddress.localitate || shippingAddress.city, shippingAddress.judet || shippingAddress.county, shippingAddress.postCode || shippingAddress.postalCode]
                          .filter(Boolean)
                          .join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AWB Tracking */}
            {order.awb && (
              <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-purple-200 dark:border-purple-800 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Nr. AWB</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{order.awb}</p>
                    </div>
                    <a
                      href={`https://www.cargus.ro/tracking`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      Urmărește
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Sumar plată
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Produse ({order.items.length})</span>
                    <span className="font-medium text-zinc-900 dark:text-white">{fmtRON(orderTotal)}</span>
                  </div>
                  
                  {order.deliveryPrice && Number(order.deliveryPrice) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Livrare</span>
                      <span className="font-medium text-zinc-900 dark:text-white">{fmtRON(Number(order.deliveryPrice))}</span>
                    </div>
                  )}
                  
                  {order.discount && Number(order.discount) > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Discount</span>
                      <span className="font-medium text-green-600 dark:text-green-400">-{fmtRON(Number(order.discount))}</span>
                    </div>
                  )}
                </div>
                
                <div className="h-px bg-zinc-200 dark:bg-zinc-700"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-zinc-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {fmtRON(Number(order.total))}
                  </span>
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Metodă de plată</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white capitalize">
                        {order.paymentMethod === 'card' ? 'Card bancar' : 'Ramburs'}
                      </p>
                    </div>
                  </div>
                  
                  {order.paymentStatus && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Status plată</p>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white capitalize">
                          {order.paymentStatus === 'paid' ? 'Plătită' : 'În așteptare'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}