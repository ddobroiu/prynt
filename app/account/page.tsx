import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountClientPage from "./AccountClientPage";

export const dynamic = 'force-dynamic';

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getAuthSession();
  
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Cont</h1>
        <p className="text-muted">Nu ești autentificat(ă). <a className="text-indigo-600 underline" href="/login">Mergi la login</a>.</p>
      </div>
    );
  }

  const userId = (session.user as any).id as string;
  
  // Luăm comenzile din baza de date
  const orderRecords = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });

  // Convertim datele
  const orders = orderRecords.map((o) => {
    const items = (o.items || []).map((it: any) => ({
      name: it.name,
      qty: it.qty,
      unit: Number(it.unit),
      total: Number(it.total),
    }));

    const address: any = typeof o.address === "object" ? o.address : {};

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
      // Verificare robustă pentru AWB și Factură
      awbNumber: o.awbNumber !== undefined && o.awbNumber !== null ? String(o.awbNumber) : null,
      awbCarrier: o.awbCarrier || null,
      invoiceLink: o.invoiceLink || null,
      address,
      billing: o.billing,
      shippingFee: Number(o.shippingFee ?? 0),
    };
  });

  const lastBillingOrder = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { billing: true },
  });
  const billing = (lastBillingOrder?.billing as any) || null;

  return (
    <div className="container mx-auto px-4 py-8">
       <AccountClientPage orders={orders} billing={billing} session={session as any} />
    </div>
  );
}