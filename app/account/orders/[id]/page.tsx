import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import OrderItemRow from "@/components/OrderItemRow"; // Importăm componenta creată

export const dynamic = "force-dynamic";

// Definim tipul Params corect pentru Next.js 15+ (unde params este o promisiune)
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage(props: PageProps) {
  // Așteptăm params
  const { id } = await props.params;
  
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Căutăm comanda cu toate relațiile necesare
  const order = await prisma.order.findUnique({
    where: { id: id },
    include: {
      items: true,
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Verificăm dacă userul are dreptul să vadă comanda
  if (order.user?.email !== session.user.email) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold text-red-500">Acces interzis</h1>
        <p>Această comandă nu îți aparține.</p>
        <Link href="/account" className="text-indigo-600 hover:underline mt-4 inline-block">
          Înapoi la cont
        </Link>
      </div>
    );
  }

  // Helper pentru formatare dată
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Parsăm adresa și facturarea (ele sunt Json în DB)
  const shippingAddress = order.address as any;
  const billingDetails = order.billing as any;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Header Pagina */}
      <div className="mb-8">
        <Link href="/account?tab=orders" className="text-sm text-gray-500 hover:text-indigo-600 mb-4 inline-block">
          ← Înapoi la comenzi
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Comanda #{order.orderNo}
            </h1>
            <p className="text-gray-500 mt-1">
              Plasată pe {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${
              order.status === 'fulfilled' ? 'bg-green-100 text-green-700 border-green-200' :
              order.status === 'canceled' ? 'bg-red-100 text-red-700 border-red-200' :
              'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
              {order.status === 'active' ? 'În Procesare' : 
               order.status === 'fulfilled' ? 'Finalizată' : 
               order.status === 'canceled' ? 'Anulată' : order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coloana Principală - Produse */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6">Produse Comandate</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <OrderItemRow
                  key={item.id}
                  item={{
                    id: item.id,
                    name: item.name,
                    qty: item.qty,
                    price: Number(item.unit),
                    total: Number(item.total),
                    artworkUrl: item.artworkUrl,
                  }}
                />
              ))}
            </div>

            {/* Totaluri */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Subtotal</span>
                <span>{Number(order.total) - Number(order.shippingFee)} RON</span>
              </div>
              <div className="flex justify-between py-2 text-gray-600">
                <span>Livrare</span>
                <span>{Number(order.shippingFee)} RON</span>
              </div>
              <div className="flex justify-between py-4 text-xl font-bold text-gray-900 dark:text-white border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>{Number(order.total)} RON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coloana Secundară - Informații */}
        <div className="space-y-6">
          {/* Detalii Livrare */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Adresă Livrare</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{shippingAddress?.nume_prenume || shippingAddress?.name}</p>
              <p>{shippingAddress?.strada_nr}</p>
              <p>{shippingAddress?.localitate}, {shippingAddress?.judet}</p>
              <p>{shippingAddress?.telefon}</p>
              <p>{shippingAddress?.email}</p>
            </div>
          </div>

          {/* Detalii Facturare */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Date Facturare</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {billingDetails?.tip_factura === 'persoana_juridica' ? (
                 <>
                   <p className="font-medium text-gray-900">{billingDetails?.name}</p>
                   <p>CUI: {billingDetails?.cui}</p>
                   <p>Reg. Com: {billingDetails?.reg_com}</p>
                   <p>{billingDetails?.adresa}</p>
                 </>
              ) : (
                 <p>Aceleași cu adresa de livrare (Persoană Fizică)</p>
              )}
            </div>
          </div>

          {/* AWB și Factură PDF */}
          {(order.awbNumber || order.invoiceLink) && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 p-6">
               <h3 className="font-semibold mb-4 text-indigo-900 dark:text-indigo-200">Documente</h3>
               <div className="space-y-3">
                 {order.awbNumber && (
                   <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-600">AWB:</span>
                     <span className="font-mono font-bold">{order.awbNumber}</span>
                   </div>
                 )}
                 {order.invoiceLink && (
                   <a 
                     href={order.invoiceLink} 
                     target="_blank" 
                     className="block w-full text-center px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                   >
                     📄 Descarcă Factura
                   </a>
                 )}
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}