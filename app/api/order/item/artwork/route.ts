import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // 1. Verificăm sesiunea
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderItemId, artworkUrl } = body;

    if (!orderItemId || !artworkUrl) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 2. Căutăm OrderItem-ul și Comanda asociată
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: true, // Avem nevoie de comandă pentru a verifica userId
      },
    });

    if (!orderItem) {
      return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
    }

    // 3. Verificarea Permisiunilor (Aici era probabil problema)
    // Utilizatorul trebuie să fie proprietarul comenzii SAU un Admin
    
    // Găsim utilizatorul din baza de date pe baza emailului din sesiune (pentru siguranță)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isOwner = orderItem.order.userId === user.id;
    // Dacă ai un flag de admin în modelul User, îl poți folosi aici:
    // const isAdmin = user.role === 'ADMIN'; 
    // Momentan verificăm doar proprietarul:
    
    if (!isOwner) {
      console.error(`Access denied: User ${user.id} tried to modify order ${orderItem.order.id} owned by ${orderItem.order.userId}`);
      return NextResponse.json({ error: 'Acces interzis la această comandă.' }, { status: 403 });
    }

    // 4. Actualizăm URL-ul graficii
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        artworkUrl: artworkUrl,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating artwork:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}