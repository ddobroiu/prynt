'use client';

import { useState } from "react";
import AddressesManager from "@/components/AddressesManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import RequestPasswordReset from "@/components/RequestPasswordReset";
import SignOutButton from "@/components/SignOutButton";
import OrderDetails from "@/components/OrderDetails";
import UserDetailsForm from "@/components/UserDetailsForm";
import UserGraphicsManager from "@/components/UserGraphicsManager";

// Tipuri de date primite ca props
type Order = {
  id: string;
  orderNo: number;
  createdAt: string;
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
  expires: string;
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
      activeTab === label ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);

const resolveStatusMeta = (status?: string | null) => {
  if (status === "fulfilled") {
    return { label: "Finalizată", badge: "bg-emerald-100 text-emerald-800 border border-emerald-200" };
  }
  if (status === "canceled") {
    return { label: "Anulată", badge: "bg-rose-100 text-rose-800 border border-rose-200" };
  }
  return { label: "În lucru", badge: "bg-amber-100 text-amber-800 border border-amber-200" };
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

const tabs = ["Comenzi", "Grafica Mea", "Adrese", "Detalii Cont", "Securitate"];

export default function AccountClientPage({ orders, billing, session }: AccountClientPageProps) {
  const [activeTab, setActiveTab] = useState("Comenzi");

  // Funcție placeholder pentru "Comandă din nou"
  const handleReorder = (orderId: string) => {
    alert(`Funcționalitatea "Comandă din nou" pentru comanda ${orderId} nu este încă implementată.`);
    // Aici ar veni logica de adăugare în coș a produselor din comandă
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center md:justify-start space-x-2 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <TabButton key={tab} label={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
        ))}
      </div>

      <div className="panel rounded-3xl p-6">
        {activeTab === "Comenzi" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Comenzile Mele</h2>
            {orders.length === 0 ? (
              <p className="text-muted">Nu ai plasat nicio comandă încă.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((o) => (
                  <OrderRow key={o.id} order={o} onReorder={handleReorder} />
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === "Grafica Mea" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Grafica Mea</h2>
            <UserGraphicsManager />
          </section>
        )}

        {activeTab === "Adrese" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Adresele Mele</h2>
            <AddressesManager />
          </section>
        )}

        {activeTab === "Detalii Cont" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Detalii Cont</h2>
            <UserDetailsForm session={session} />
          </section>
        )}

        {activeTab === "Securitate" && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold">Setări Securitate</h2>
            <ChangePasswordForm />
            <RequestPasswordReset email={String(session.user.email || "")} />
            <SignOutButton />
          </section>
        )}
      </div>
    </div>
  );
}

// Componentă nouă pentru un rând de comandă, cu detalii ascunse
function OrderRow({ order, onReorder }: { order: Order; onReorder: (orderId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const statusMeta = resolveStatusMeta(order.status);
  const awbUrl = getAwbTrackingUrl(order.awbNumber, order.awbCarrier);

  return (
    <li className="card p-4 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800">Comanda #{order.orderNo}</div>
          <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString("ro-RO")}</div>
        </div>
        <div className="shrink-0">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusMeta.badge}`}>
            {statusMeta.label}
          </span>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold text-gray-800">{(order.total || 0).toFixed(2)} RON</div>
          <div className="text-xs text-gray-500">{order.paymentType}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsOpen(!isOpen)} className="btn-outline text-xs">
            {isOpen ? "Ascunde detalii" : "Vezi detalii"}
          </button>
          {order.status === "fulfilled" && (
            <button onClick={() => onReorder(order.id)} className="btn-primary text-xs">
              Comandă din nou
            </button>
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <OrderDetails order={order} />
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            {awbUrl && (
              <a href={awbUrl} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 hover:underline">
                Urmărește AWB: {order.awbNumber}
              </a>
            )}
            {order.invoiceLink && (
              <a href={order.invoiceLink} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 hover:underline">
                Descarcă Factura
              </a>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
