import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import UserGraphicsManager from "@/components/UserGraphicsManager";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Funcție helper pentru link-ul de tracking AWB
function getAwbTrackingUrl(awb: string | null, carrier: string | null) {
  if (!awb || !carrier) return null;
  const awbClean = encodeURIComponent(awb);
  const carrierLower = carrier.toLowerCase();
  if (carrierLower.includes('dpd')) return `https://tracking.dpd.ro/awb?awb=${awbClean}`;
  if (carrierLower.includes('fan')) return `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
  if (carrierLower.includes('sameday')) return `https://sameday.ro/awb-tracking/?awb=${awbClean}`;
  return null;
}

export default async function OrderDetailPage(props: PageProps) {
  const { id } = await props.params;
  const session = await getAuthSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  if (order.userId !== session.user.id) {
    return <div className="text-white p-10">Acces interzis</div>;
  }

  // Curățăm datele pentru a evita erori de serializare
  const cleanItems = order.items.map((item) => ({
    id: item.id,
    name: item.name,
    qty: item.qty,
    unit: Number(item.unit),
    total: Number(item.total),
  }));

  // Luăm grafica existentă
  const graphics = await prisma.userGraphic.findMany({
    where: { orderId: id },
  });
  
  const cleanGraphics = graphics.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    fileSize: Number(g.fileSize),
  }));

  // Pregătim datele pentru afișare
  const shippingAddress = order.address as any;
  const billingDetails = order.billing as any;
  const awbUrl = getAwbTrackingUrl(order.awbNumber, order.awbCarrier);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Navigare */}
        <div className="mb-8">
          <Link href="/account?tab=orders" className="text-indigo-400 text-sm hover:underline mb-2 inline-block">
            ← Înapoi la comenzi
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
               <h1 className="text-3xl font-bold text-white">Comanda #{order.orderNo}</h1>
               <p className="text-slate-400 text-sm">Plasată pe {new Date(order.createdAt).toLocaleDateString('ro-RO')}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold border w-fit ${
                order.status === 'fulfilled' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                order.status === 'canceled' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }`}>
              {order.status === 'active' ? 'În Procesare' : 
               order.status === 'fulfilled' ? 'Finalizată' : 
               order.status === 'canceled' ? 'Anulată' : order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLOANA STÂNGA (2/3): LISTA PRODUSE & UPLOAD */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Gestionare Grafică & Produse</h2>
              <p className="text-sm text-slate-400 mb-6 bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                ℹ️ Încarcă fișierele grafice pentru fiecare produs în parte. Formate acceptate: PDF, AI, TIFF, JPG.
              </p>
              
              <UserGraphicsManager 
                orderId={order.id} 
                items={cleanItems} 
                initialGraphics={cleanGraphics} 
              />
            </div>
          </div>

          {/* COLOANA DREAPTA (1/3): INFO AWB, FACTURĂ, ADRESE */}
          <div className="space-y-6">
            
            {/* SECTIUNEA AWB SI FACTURA (Acum este vizibilă din nou) */}
            {(order.awbNumber || order.invoiceLink) && (
                <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-6">
                   <h3 className="font-semibold text-indigo-200 mb-4">Documente & Livrare</h3>
                   <div className="space-y-4">
                     
                     {/* AWB */}
                     {order.awbNumber && (
                       <div>
                         <div className="text-xs text-indigo-300 uppercase font-semibold tracking-wider mb-1">AWB {order.awbCarrier}</div>
                         <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded border border-indigo-500/20">
                           <span className="font-mono font-bold text-white">{order.awbNumber}</span>
                           {awbUrl && (
                             <a 
                               href={awbUrl} 
                               target="_blank" 
                               rel="noreferrer"
                               className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded ml-auto transition-colors"
                             >
                               Urmărește
                             </a>
                           )}
                         </div>
                       </div>
                     )}

                     {/* Factura */}
                     {order.invoiceLink && (
                       <div>
                         <div className="text-xs text-indigo-300 uppercase font-semibold tracking-wider mb-1">Factură Fiscală</div>
                         <a 
                           href={order.invoiceLink} 
                           target="_blank"
                           className="flex items-center justify-center w-full gap-2 bg-white text-indigo-900 font-bold text-sm py-2.5 rounded-lg hover:bg-slate-200 transition-colors"
                         >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                           Descarcă Factura
                         </a>
                       </div>
                     )}
                   </div>
                </div>
            )}

            {/* ADRESA LIVRARE */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-slate-200">Adresă Livrare</h3>
              <div className="text-sm text-slate-400 space-y-1">
                <p className="font-medium text-white">{shippingAddress?.nume_prenume || shippingAddress?.name}</p>
                <p>{shippingAddress?.strada_nr}</p>
                <p>{shippingAddress?.localitate}, {shippingAddress?.judet}</p>
                <p>{shippingAddress?.telefon}</p>
                <p>{shippingAddress?.email}</p>
              </div>
            </div>

            {/* DATE FACTURARE */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-slate-200">Date Facturare</h3>
              <div className="text-sm text-slate-400 space-y-1">
                {billingDetails?.tip_factura === 'persoana_juridica' ? (
                   <>
                     <p className="font-medium text-white">{billingDetails?.name}</p>
                     <p>CUI: {billingDetails?.cui}</p>
                     <p>Reg. Com: {billingDetails?.reg_com}</p>
                     <p>{billingDetails?.adresa}</p>
                   </>
                ) : (
                   <p>Aceleași cu adresa de livrare (PF)</p>
                )}
              </div>
            </div>
            
            {/* TOTALURI */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{(Number(order.total) - Number(order.shippingFee)).toFixed(2)} RON</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Livrare</span>
                        <span>{Number(order.shippingFee).toFixed(2)} RON</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-3 mt-2 text-lg font-bold text-white">
                        <span>Total</span>
                        <span>{Number(order.total).toFixed(2)} RON</span>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}