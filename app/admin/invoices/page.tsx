import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/lib/adminSession';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InvoicesDashboard from './InvoicesDashboard';
import { FileText, Receipt } from 'lucide-react';

export const dynamic = 'force-dynamic';

function fmtRON(n: number) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 2 }).format(n);
}

export default async function InvoicesPage() {
  // 1. Verificare Auth
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    redirect("/admin/login");
  }

  // 2. Preluare Facturi (Comenzi cu factură emisă)
  // NOTĂ: Ajustează 'where' dacă logica ta de facturare e diferită (ex: tabel separat Invoice)
  const ordersWithInvoices = await prisma.order.findMany({
    where: {
      // Presupunem că o comandă are factură dacă are o serie setată
      // Sau poți folosi: status: { in: ['completed', 'shipped'] }
      invoiceSeries: { not: null }, 
    },
    orderBy: { createdAt: 'desc' }, // Cele mai recente primele
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  // 3. Procesare Date pentru UI
  const invoices = ordersWithInvoices.map(order => ({
    id: order.id,
    // Date identificare factură
    series: order.invoiceSeries || 'F', 
    number: order.invoiceNumber || '-', 
    date: order.createdAt.toISOString(), // Sau data facturării dacă există câmp separat
    
    // Client
    clientName: order.user?.name || "Client Fără Nume",
    clientEmail: order.user?.email || "Fără Email",
    
    // Valoare
    total: Number(order.total),
    status: order.status,
    
    // Link descărcare (presupunem că ruta există deja)
    downloadUrl: `/api/admin/order/${order.id}/invoice` 
  }));

  // Statistici rapide
  const stats = {
    count: invoices.length,
    totalValue: invoices.reduce((acc, inv) => acc + inv.total, 0)
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2 p-4 md:p-8 bg-gray-50/50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Facturi</h1>
          <p className="text-gray-500 mt-1">Gestionează și descarcă facturile fiscale emise.</p>
        </div>
      </div>

      {/* Statistici Sumare */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Facturi Emise</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{stats.count}</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FileText size={20} />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Valoare Totală Facturată</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{fmtRON(stats.totalValue)}</h3>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Receipt size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Component */}
      <InvoicesDashboard invoices={invoices} />
    </div>
  );
}