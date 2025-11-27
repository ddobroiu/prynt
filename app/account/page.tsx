import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountClientPage from "./AccountClientPage";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getAuthSession();
  
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contul meu</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Pentru a accesa istoricul comenzilor, te rugăm să te autentifici.</p>
        <Link href="/login" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Mergi la autentificare
        </Link>
      </div>
    );
  }

  const userId = (session.user as any).id as string;
  const userEmail = session.user.email;

  console.log(`[AccountPage] Checking orders for UserID: ${userId} | Email: ${userEmail}`);

  // Construim condiția de căutare
  const whereCondition: any = {
    OR: [
      { userId: userId }, // Caută după ID-ul userului conectat
    ]
  };

  // Dacă avem email, căutăm și în JSON-ul de facturare (pentru comenzi guest sau vechi)
  if (userEmail) {
    whereCondition.OR.push({
      billing: {
        path: ['email'],
        equals: userEmail
      }
    });
  }

  try {
    const orderRecords = await prisma.order.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 50,
    });

    console.log(`[AccountPage] Found ${orderRecords.length} orders.`);

    // Convertim datele pentru a fi sigure de trimis la Client
    const orders = orderRecords.map((o) => {
      const items = (o.items || []).map((it: any) => ({
        name: it.name,
        qty: it.qty,
        unit: Number(it.unit),
        total: Number(it.total),
      }));

      const address: any = typeof o.address === "object" ? o.address : {};
      // Asigurăm compatibilitatea cu JSON-ul de billing
      const billingData: any = typeof o.billing === "object" ? o.billing : {};

      return {
        id: o.id,
        orderNo: Number(o.orderNo),
        createdAt: o.createdAt.toISOString(),
        status: o.status,
        canceledAt: o.canceledAt ? o.canceledAt.toISOString() : null,
        total: Number(o.total),
        paymentType: o.paymentType,
        items,
        itemsCount: items.length,
        awbNumber: o.awbNumber ? String(o.awbNumber) : null,
        awbCarrier: o.awbCarrier || null,
        invoiceLink: o.invoiceLink || null,
        address,
        billing: billingData,
        shippingFee: Number(o.shippingFee ?? 0),
      };
    });

    // Încercăm să găsim ultima comandă pentru datele de facturare implicite
    const lastBillingOrder = await prisma.order.findFirst({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      select: { billing: true },
    });
    
    const billing = (lastBillingOrder?.billing as any) || null;

    return (
      <div className="container mx-auto px-4 py-8">
         <AccountClientPage orders={orders} billing={billing} session={session as any} />
      </div>
    );

  } catch (error) {
    console.error("Eroare la preluarea comenzilor:", error);
    // În caz de eroare critică (de ex. baza de date jos), nu crăpăm toată pagina
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                Nu s-au putut încărca comenzile momentan. Te rugăm să încerci mai târziu.
            </div>
        </div>
    );
  }
}