import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import RequestPasswordReset from "@/components/RequestPasswordReset";

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
        <p className="text-muted">Nu ești autentificat(ă). <a className="text-indigo-400 underline" href="/login">Mergi la login</a>.</p>
      </div>
    );
  }

  // Load latest orders (preview)
  const userId = (session.user as any).id as string;
  const recent = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: { select: { id: true } } },
  });
  const orders = recent.map((o: any) => ({
    id: o.id,
    orderNo: o.orderNo,
    createdAt: o.createdAt,
    total: Number(o.total),
    paymentType: o.paymentType,
    itemsCount: o.items.length,
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-6">
      <h1 className="text-2xl font-bold">Bun venit, {session.user.name || session.user.email}</h1>
      {showWelcome && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300 text-sm">
          Cont creat cu succes. Te-ai autentificat automat.
        </div>
      )}
      <div className="rounded-md border border-[--border] p-4">
        <div className="text-sm text-muted">Email</div>
        <div className="font-medium">{session.user.email}</div>
      </div>

      {/* Istoric comenzi (ultimele 5) */}
      <div className="rounded-md border border-[--border]">
        <div className="flex items-center justify-between p-4">
          <div className="font-semibold">Istoric comenzi</div>
          <a href="/account/orders" className="text-sm text-indigo-400 underline">Vezi toate</a>
        </div>
        {orders.length === 0 ? (
          <div className="p-4 text-sm text-muted">Nu ai comenzi încă.</div>
        ) : (
          <ul className="divide-y divide-white/10">
            {orders.map((o: any) => (
              <li key={o.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">Comanda #{o.orderNo}</div>
                  <div className="text-xs text-muted">{new Date(o.createdAt).toLocaleString("ro-RO")}</div>
                  <div className="text-xs text-muted">{o.itemsCount} produse • {o.paymentType}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(o.total)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SignOutButton />
      <ChangePasswordForm />
      <RequestPasswordReset email={String(session.user.email || "")} />
    </div>
  );
}
