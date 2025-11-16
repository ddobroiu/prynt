import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountClientPage from "./AccountClientPage";

// Forțează randare dinamică ca să nu fie folosită o versiune cache care ar pierde sesiunea
export const dynamic = 'force-dynamic';

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const session = await getAuthSession();
  // Citește query param welcome=1 pentru banner succes
  const showWelcome =
    (typeof searchParams?.welcome === "string" && searchParams?.welcome === "1") ||
    (Array.isArray(searchParams?.welcome) && searchParams?.welcome?.includes("1"));
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold mb-4">Cont</h1>
        <p className="text-muted">Nu ești autentificat(ă). Este posibil ca sesiunea să nu fie încă încărcată sau cookie-ul să fi expirat. <a className="text-indigo-600 underline" href="/login">Mergi la login</a>.</p>
      </div>
    );
  }

  // Stats & orders (consolidated view)
  const userId = (session.user as any).id as string;
  const orderRecords = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });
  const orders = orderRecords.map((o) => {
    const items = (o.items || []).map((it: any) => ({
      name: it.name,
      qty: it.qty,
      unit: Number(it.unit),
      total: Number(it.total),
    }));

    const address: { localitate?: string; judet?: string } =
      typeof o.address === "object" && o.address !== null && !Array.isArray(o.address)
        ? (o.address as { localitate?: string; judet?: string })
        : {};

    return {
      id: o.id,
      orderNo: Number(o.orderNo),
      createdAt: o.createdAt.toISOString(),
      status: o.status,
      canceledAt: o.canceledAt || null,
      total: Number(o.total),
      paymentType: o.paymentType,
      items,
      itemsCount: items.length,
      awbNumber: o.awbNumber,
      awbCarrier: o.awbCarrier,
      invoiceLink: o.invoiceLink,
      address,
      billing: o.billing,
      shippingFee: Number(o.shippingFee ?? 0),
    };
  });

  // Load last billing info from latest order
  const lastBillingOrder = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { billing: true },
  });
  const billing = (lastBillingOrder?.billing as any) || null;

  return (
    <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Contul Meu</h1>
          {showWelcome && (
            <div className="mt-4 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
              Bun venit! Contul tău a fost creat cu succes.
            </div>
          )}
        </header>
        
        <AccountClientPage orders={orders} billing={billing} session={session as any} />
      </div>
  );
}