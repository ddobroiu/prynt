import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import UserGraphicsManager from "@/components/UserGraphicsManager";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getAwbTrackingUrl(awb: string | null, carrier: string | null) {
  if (!awb || awb === "0") return null; // Nu generăm link pentru AWB 0
  const awbClean = encodeURIComponent(awb);
  const carrierLower = (carrier || "").toLowerCase();
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

  // Citim comanda direct din bază, cu toate câmpurile
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  if (order.userId !== session.user.id) {
    return <div className="text-white p-10">Acces interzis</div>;
  }

  // Pregătim datele produselor
  const cleanItems = order.items.map((item) => ({
    id: item.id,
    name: item.name,
    qty: item.qty,
    unit: Number(item.unit),
    total: Number(item.total),
  }));

  // Grafica
  const graphics = await prisma.userGraphic.findMany({
    where: { orderId: id },
  });
  
  const cleanGraphics = graphics.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    fileSize: Number(g.fileSize),
  }));

  const shippingAddress = order.address as any;
  const billingDetails = order.billing as any;
  
  // Verificăm AWB-ul. Dacă e "0" sau null, îl tratăm corespunzător.
  const awbDisplay = order.awbNumber && order.awbNumber !== "0" ? order.awbNumber : null;
  const awbUrl = getAwbTrackingUrl(order.awbNumber, order.awbCarrier);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <Link href="/account?tab=orders" className="text-indigo-400 text-sm hover:underline mb-2 inline-block">
            ← Înapoi la comenzi
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
               <h1 className="text-3xl font-bold text-white">Comanda #{order.orderNo}</h1>
               <p className="text-slate-400 text-sm">Data: {new Date(order.createdAt).toLocaleDateString('ro-RO')}</p>
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
          
          {/* STÂNGA: Upload Grafică */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Gestionare Grafică</h2>
              <p className="text-sm text-slate-400 mb-6 bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/30">
                ℹ️ Încarcă fișierele grafice (PDF, AI, TIFF, JPG) pentru fiecare produs.
              </p>
              
              <UserGraphicsManager 
                orderId={order.id} 
                items={cleanItems} 
                initialGraphics={cleanGraphics} 
              />
            </div>
          </div>

          {/* DREAPTA: DOCUMENTE (AWB & Factură) */}
          <div className="space-y-6">
            
            {/* CARD DOCUMENTE - Îl afișăm mereu dacă există ORICE urmă de document */}
            <div className="bg-indigo-900/20 border border-indigo-500/40 rounded-2xl p-6 shadow-lg shadow-indigo-900/20">
                <h3 className="font-bold text-indigo-100 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Documente
                </h3>
                <div className="space-y-4">
                  
                  {/* AWB */}
                  {order.awbNumber ? (
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-indigo-500/20">
                      <div className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider mb-1">
                        AWB {order.awbCarrier || "Curier"}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-lg">
                          {order.awbNumber === "0" ? "În generare..." : order.awbNumber}
                        </span>
                        {awbUrl && (
                          <a 
                            href={awbUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                          >
                            Urmărește
                          </a>
                        )}
                      </div>
                      {order.awbNumber === "0" && (
                        <p className="text-xs text-amber-500 mt-2">
                          * AWB-ul a fost solicitat dar încă nu are număr alocat (apare 0).
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 italic">Niciun AWB emis.</div>
                  )}

                  {/* FACTURA */}
                  {order.invoiceLink ? (
                    <a 
                      href={order.invoiceLink} 
                      target="_blank"
                      className="flex items-center justify-center w-full gap-2 bg-white text-indigo-950 font-bold text-sm py-3 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      📄 Descarcă Factura
                    </a>
                  ) : (
                    <div className="text-sm text-slate-500 italic border-t border-white/10 pt-2 mt-2">
                      Factura nu a fost încă încărcată.
                    </div>
                  )}
                </div>
            </div>

            {/* ADRESE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-slate-200 border-b border-slate-800 pb-2">Detalii Livrare</h3>
              
              <div className="space-y-4">
                  <div>
                      <div className="text-xs text-slate-500 uppercase mb-1">Adresă Livrare</div>
                      <div className="text-sm text-slate-300 font-medium bg-black/20 p-3 rounded-lg">
                        <p className="text-white mb-1">{shippingAddress?.nume_prenume || shippingAddress?.name}</p>
                        <p>{shippingAddress?.strada_nr}</p>
                        <p>{shippingAddress?.localitate}, {shippingAddress?.judet}</p>
                        <p className="mt-2 text-indigo-300">{shippingAddress?.telefon}</p>
                      </div>
                  </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}