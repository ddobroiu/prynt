import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import UserGraphicsManager from "@/components/UserGraphicsManager";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage(props: PageProps) {
  const { id } = await props.params;
  const session = await getAuthSession();

  if (!session?.user?.email) redirect("/login");

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order || order.userId !== session.user.id) return notFound();

  // Curățăm datele
  const cleanItems = order.items.map(item => ({
    id: item.id, name: item.name, qty: item.qty, unit: Number(item.unit), total: Number(item.total)
  }));

  // Luăm grafica existentă
  const graphics = await prisma.userGraphic.findMany({ where: { orderId: id } });
  const cleanGraphics = graphics.map(g => ({
    ...g, createdAt: g.createdAt.toISOString(), updatedAt: g.updatedAt.toISOString(), fileSize: Number(g.fileSize)
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/account?tab=orders" className="text-indigo-400 text-sm hover:underline mb-4 inline-block">← Înapoi</Link>
        <h1 className="text-2xl font-bold mb-2">Gestionare Grafică - Comanda #{order.orderNo}</h1>
        <p className="text-slate-400 mb-6">Încarcă fișierele pentru fiecare produs din lista de mai jos.</p>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <UserGraphicsManager orderId={order.id} items={cleanItems} initialGraphics={cleanGraphics} />
        </div>
      </div>
    </div>
  );
}