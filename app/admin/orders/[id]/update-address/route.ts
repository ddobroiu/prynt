import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminSession';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verificăm securitatea (doar adminul poate modifica)
  const cookieStore = req.cookies;
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: 'Date lipsă' }, { status: 400 });
    }

    // 2. Actualizăm adresa în baza de date
    
    // Verificăm întâi dacă comanda există
    const order = await prisma.order.findUnique({
        where: { id }
        // NU folosim include: { address: true } deoarece address este un câmp JSON în schema ta, 
        // deci vine automat cu obiectul order.
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Deoarece în schema.prisma 'address' este un câmp de tip Json pe modelul Order,
    // facem update direct pe modelul Order.
    
    await prisma.order.update({
        where: { id },
        data: {
            // Actualizăm câmpul JSON direct
            address: address
        }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[UPDATE_ADDRESS]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}