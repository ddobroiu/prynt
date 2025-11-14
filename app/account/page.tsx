import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import RequestPasswordReset from "@/components/RequestPasswordReset";
import AddressesManager from "@/components/AddressesManager";

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
        <p className="text-muted">Nu ești autentificat(ă). Este posibil ca sesiunea să nu fie încă încărcată sau cookie-ul să fi expirat. <a className="text-indigo-400 underline" href="/login">Mergi la login</a>.</p>
      </div>
    );
  }

  // Stats & latest orders
  const userId = (session.user as any).id as string;
  const ordersAll = await prisma.order.findMany({ where: { userId }, select: { id: true, total: true } });
  const totalOrders = ordersAll.length;
  const totalSpent = ordersAll.reduce((acc, o) => acc + Number(o.total || 0), 0);
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

  // Adresele sunt gestionate de componenta client `AddressesManager`

  // Load last billing info from latest order
  const lastBillingOrder = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { billing: true },
  });
  const billing = (lastBillingOrder?.billing as any) || null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Salut, {session.user.name || session.user.email}</h1>
        <p className="text-sm text-muted">Panou de control al contului tău.</p>
      </div>
      {showWelcome && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300 text-sm">
          Cont creat cu succes. Te-ai autentificat automat.
        </div>
      )}
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wide text-muted">Comenzi</div>
          <div className="text-3xl font-bold">{totalOrders}</div>
          <div className="text-[11px] text-muted">Total plasate</div>
        </div>
        <div className="panel p-5 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wide text-muted">Total cheltuit</div>
          <div className="text-3xl font-bold">{new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(totalSpent)}</div>
          <div className="text-[11px] text-muted">Include transport</div>
        </div>
        <div className="panel p-5 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wide text-muted">Email</div>
          <div className="text-sm font-medium truncate" title={String(session.user.email)}>{session.user.email}</div>
          <div className="text-[11px] text-muted">Autentificat</div>
        </div>
      </div>

      {/* Istoric comenzi (ultimele 5) */}
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="font-semibold flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Ultimele comenzi
          </div>
          <a href="/account/orders" className="text-sm text-indigo-400 underline">Vezi toate</a>
        </div>
        {orders.length === 0 ? (
          <div className="p-4 text-sm text-muted">Nu ai comenzi încă.</div>
        ) : (
          <ul className="divide-y divide-white/10">
            {orders.map((o: any) => (
              <li key={o.id} className="p-4 flex items-center justify-between hover:bg-surface/40 transition">
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

      {/* Adrese: manager complet add/edit/delete */}
      <AddressesManager />

      {/* Date facturare (ultimele folosite) */}
      <div className="panel p-4 space-y-1">
        <div className="font-semibold">Facturare</div>
        {!billing ? (
          <div className="text-sm text-muted">Nu există date de facturare încă.</div>
        ) : (
          <div className="text-sm space-y-0.5">
            {(() => {
              const tip = billing?.tip_factura || billing?.type || 'persoana_fizica';
              if (tip === 'firma' || tip === 'juridica' || tip === 'company') {
                return (
                  <>
                    <div className="text-muted text-xs">Companie</div>
                    <div className="font-medium">{billing?.denumire_companie || billing?.name || '-'}</div>
                    <div>CUI: {billing?.cui || billing?.cif || '-'}</div>
                    <div>{billing?.strada_nr || '-'}, {billing?.localitate || '-'}, {billing?.judet || '-'}{billing?.postCode ? `, ${billing?.postCode}` : ''}</div>
                  </>
                );
              }
              return (
                <>
                  <div className="text-muted text-xs">Persoană fizică</div>
                  {billing?.name && <div className="font-medium">{billing?.name}</div>}
                  <div>{billing?.strada_nr || '-'}, {billing?.localitate || '-'}, {billing?.judet || '-'}{billing?.postCode ? `, ${billing?.postCode}` : ''}</div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChangePasswordForm />
        <RequestPasswordReset email={String(session.user.email || "")} />
      </div>
      <div>
        <SignOutButton />
      </div>
    </div>
  );
}
