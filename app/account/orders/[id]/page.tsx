import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import UserGraphicsManager from "@/components/UserGraphicsManager";

export const dynamic = "force-dynamic";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderGraphicsPage({ params }: OrderPageProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Await params in Next.js 15+
  const { id } = await params;

  // Căutăm comanda și includem user-ul pentru securitate (să fie a lui)
  const order = await prisma.order.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      items: true, // Avem nevoie de itemi pentru a atașa grafica per produs
    },
  });

  if (!order) {
    notFound();
  }

  // Căutăm grafica deja încărcată pentru această comandă
  // Presupunem că există tabela UserGraphic cu relația orderId
  const existingGraphics = await prisma.userGraphic.findMany({
    where: {
      orderId: order.id,
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/account?tab=orders"
            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mb-4 transition-colors"
          >
            ← Înapoi la comenzi
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Gestionare Grafică
          </h1>
          <p className="mt-2 text-slate-400">
            Comanda #{order.orderNo} • {new Date(order.createdAt).toLocaleDateString("ro-RO")}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4 text-sm text-indigo-200">
            <p className="font-semibold mb-1">Instrucțiuni:</p>
            <ul className="list-disc list-inside space-y-1 opacity-90">
              <li>Încarcă fișierele grafice corespunzătoare pentru fiecare produs din listă.</li>
              <li>Sunt acceptate formatele: PDF, AI, TIFF, JPG, PNG.</li>
              <li>După încărcare, statusul se va actualiza automat.</li>
            </ul>
          </div>

          {/* Componenta Client care gestionează logica */}
          <UserGraphicsManager 
            order={order} 
            initialGraphics={existingGraphics} 
          />
        </div>
      </div>
    </div>
  );
}