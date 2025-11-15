'use client';

import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AddressesManager from "@/components/AddressesManager";
import OrderDetails from "@/components/OrderDetails";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import RequestPasswordReset from "@/components/RequestPasswordReset";
import SignOutButton from "@/components/SignOutButton";
import { Order } from "@/lib/orderService"; // Assuming Order type is defined and exported

type AccountClientPageProps = {
  session: Session;
  orders: any[]; // Replace with a more specific type if available
  billing: any; // Replace with a more specific type if available
  showWelcome: boolean;
};

const resolveStatusMeta = (status?: string | null) => {
    if (status === "fulfilled") {
      return { label: "Finalizată", badge: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/40" };
    }
    if (status === "canceled") {
      return { label: "Anulată", badge: "bg-rose-500/10 text-rose-200 border border-rose-400/40" };
    }
    return { label: "În lucru", badge: "bg-amber-500/15 text-amber-100 border border-amber-400/40" };
};

const getAwbTrackingUrl = (awb?: string | null, carrier?: string | null) => {
    if (!awb || !carrier) return null;
    const carrierLower = carrier.toLowerCase();
    const awbClean = encodeURIComponent(awb);
    if (carrierLower.includes("dpd")) return `https://tracking.dpd.ro/awb?awb=${awbClean}`;
    if (carrierLower.includes("fan")) return `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
    if (carrierLower.includes("sameday")) return `https://sameday.ro/awb-tracking/?awb=${awbClean}`;
    return null;
};

export default function AccountClientPage({ session, orders, billing, showWelcome }: AccountClientPageProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';

  const tabs = [
    { id: 'orders', label: 'Comenzile Mele' },
    { id: 'addresses', label: 'Adresele Mele' },
    { id: 'billing', label: 'Facturare' },
    { id: 'settings', label: 'Setări Cont' },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Contul Meu</h1>
          {showWelcome && (
            <div className="mt-4 bg-green-500/10 border border-green-400/40 text-green-200 px-4 py-3 rounded-lg">
              Bun venit! Contul tău a fost creat cu succes.
            </div>
          )}
        </header>

        <div className="mb-8 border-b border-white/10">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    href={`?tab=${tab.id}`}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                            ? 'border-indigo-400 text-indigo-300'
                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    }`}
                >
                    {tab.label}
                </Link>
                ))}
            </nav>
        </div>

        <div>
            {activeTab === 'orders' && (
                <section id="orders" className="panel rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-semibold mb-4">Istoric Comenzi</h2>
                    {orders.length === 0 ? (
                        <p className="text-muted">Nu ai plasat nicio comandă încă.</p>
                    ) : (
                        <ul className="space-y-6">
                        {orders.map((o) => {
                            const statusMeta = resolveStatusMeta(o.status);
                            const awbUrl = getAwbTrackingUrl(o.awbNumber, o.awbCarrier);
                            const previewItems = o.items.slice(0, 4).map((it: any) => it.name);

                            return (
                            <li key={o.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <div className="font-semibold">Comanda #{o.orderNo}</div>
                                    <div className="text-xs text-muted">{new Date(o.createdAt).toLocaleString("ro-RO")}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{(o.total || 0).toFixed(2)} RON</div>
                                    <div className="text-xs text-muted">{o.paymentType}</div>
                                </div>
                                </div>
                                <div className="mt-3 space-y-2 text-xs text-muted">
                                {previewItems.length > 0 ? (
                                    <div className="text-white/70">
                                    {previewItems.join(" | ")}
                                    {o.itemsCount > previewItems.length ? ` +${o.itemsCount - previewItems.length} produse` : ""}
                                    </div>
                                ) : (
                                    <div>Detalii disponibile in sectiunea "Detalii".</div>
                                )}
                                <div>
                                    Livrare: {o.address?.localitate || "-"}, {o.address?.judet || "RO"}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${statusMeta.badge}`}>
                                    {statusMeta.label}
                                    </span>
                                    {o.awbNumber && (
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/80">
                                        <span>AWB: {o.awbNumber}</span>
                                        {awbUrl && (
                                        <a href={awbUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                                            Tracking
                                        </a>
                                        )}
                                    </span>
                                    )}
                                    {o.invoiceLink && (
                                    <a
                                        href={o.invoiceLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] text-indigo-300 underline"
                                    >
                                        Factura
                                    </a>
                                    )}
                                </div>
                                </div>
                                <div className="mt-3">
                                {/* @ts-ignore Server->Client import allowed */}
                                <OrderDetails order={o} />
                                </div>
                            </li>
                            );
                        })}
                        </ul>
                    )}
                </section>
            )}

            {activeTab === 'addresses' && (
                <section id="addresses" className="panel rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-xl font-semibold mb-4">Adresele Mele</h2>
                    <AddressesManager />
                </section>
            )}

            {activeTab === 'billing' && (
                <div className="space-y-8">
                    <section id="billing-data" className="panel rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-semibold mb-4">Date Facturare</h2>
                        {!billing ? (
                            <p className="text-sm text-muted">Nu există date de facturare încă. Ultimele date folosite vor apărea aici.</p>
                        ) : (
                            <div className="text-sm space-y-1 mt-2">
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
                    </section>
                    <section id="invoices" className="panel rounded-3xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-semibold mb-4">Facturi Emise</h2>
                        {orders.filter((o) => o.invoiceLink).length === 0 ? (
                            <p className="text-sm text-muted">Nu există facturi emise încă.</p>
                        ) : (
                            <ul className="space-y-2">
                            {orders
                                .filter((o) => o.invoiceLink)
                                .map((o) => (
                                <li key={o.id} className="flex items-center justify-between">
                                    <div>
                                    <div className="font-medium">Comanda #{o.orderNo}</div>
                                    <div className="text-xs text-muted">{new Date(o.createdAt).toLocaleString('ro-RO')}</div>
                                    </div>
                                    <a href={o.invoiceLink ?? ''} target="_blank" rel="noreferrer" className="text-indigo-400 underline">
                                    Descarcă
                                    </a>
                                </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            )}

            {activeTab === 'settings' && (
                <section id="settings" className="panel rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Setări Cont</h2>
                    <ChangePasswordForm />
                    <RequestPasswordReset email={String(session.user.email || "")} />
                    <SignOutButton />
                </section>
            )}
        </div>
      </div>
    </div>
  );
}
