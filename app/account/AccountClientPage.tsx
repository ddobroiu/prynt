'use client';

import { useState } from "react";
import AddressesManager from "@/components/AddressesManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import RequestPasswordReset from "@/components/RequestPasswordReset";
import SignOutButton from "@/components/SignOutButton";
import OrderDetails from "@/components/OrderDetails";

// Tipuri de date primite ca props
type Order = {
  id: string;
  orderNo: string;
  createdAt: Date;
  status: string | null;
  total: number;
  paymentType: string | null;
  items: { name: string }[];
  itemsCount: number;
  awbNumber: string | null;
  awbCarrier: string | null;
  invoiceLink: string | null;
  address: {
    localitate?: string;
    judet?: string;
  };
};

type BillingInfo = any; // Folosim any pentru flexibilitate cu structura dinamică

type Session = {
  user: {
    email?: string | null;
  };
};

type AccountClientPageProps = {
  orders: Order[];
  billing: BillingInfo;
  session: Session;
};

const TabButton = ({ label, activeTab, setActiveTab }: { label: string; activeTab: string; setActiveTab: (label: string) => void }) => (
  <button
    onClick={() => setActiveTab(label)}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === label ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-white/10"
    }`}
  >
    {label}
  </button>
);

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
  if (carrierLower.includes("dpd")) return `https://tracking.dpd.ro/?shipmentNumber=${awbClean}`;
  if (carrierLower.includes("fan")) return `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
  if (carrierLower.includes("sameday")) return `https://sameday.ro/awb-tracking/?awb=${awbClean}`;
  return null;
};

export default function AccountClientPage({ orders, billing, session }: AccountClientPageProps) {
  const [activeTab, setActiveTab] = useState("Comenzi");
  const tabs = ["Comenzi", "Adrese", "Facturare", "Setări"];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center md:justify-start space-x-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <TabButton key={tab} label={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
        ))}
      </div>

      <div className="panel rounded-3xl border border-white/10 bg-white/5 p-6">
        {activeTab === "Comenzi" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Comenzile Mele</h2>
            {orders.length === 0 ? (
              <p className="text-muted">Nu ai plasat nicio comandă încă.</p>
            ) : (
              <ul className="space-y-6">
                {orders.map((o) => {
                  const statusMeta = resolveStatusMeta(o.status);
                  const awbUrl = getAwbTrackingUrl(o.awbNumber, o.awbCarrier);
                  const previewItems = o.items.slice(0, 4).map((it) => it.name);

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

        {activeTab === "Adrese" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Adresele Mele</h2>
            <AddressesManager />
          </section>
        )}

        {activeTab === "Facturare" && (
          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Date Facturare</h2>
              {!billing ? (
                <p className="text-sm text-muted">Nu există date de facturare încă.</p>
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
            </div>
            <div>
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
            </div>
          </section>
        )}

        {activeTab === "Setări" && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Setări Cont</h2>
            <ChangePasswordForm />
            <RequestPasswordReset email={String(session.user.email || "")} />
            <SignOutButton />
          </section>
        )}
      </div>
    </div>
  );
}