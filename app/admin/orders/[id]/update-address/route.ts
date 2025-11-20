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
    // Verificăm întâi dacă comanda are o adresă specifică salvată în tabela Order
    // Dacă nu, actualizăm billing-ul sau shipping-ul asociat (depinde de structura ta)
    // Aici presupunem că `address` este un JSON field sau o relație.
    // Pentru simplitate și robustețe, actualizăm câmpul `address` din Order (dacă e Json) 
    // SAU relația Address dacă există.
    
    // Varianta 1: Dacă `address` e Json în Order:
    /*
    await prisma.order.update({
      where: { id },
      data: { address: address }
    });
    */

    // Varianta 2 (Recomandată): Actualizăm relația ShippingAddress dacă există, sau Json-ul
    // Vom face un update "smart" care încearcă să salveze datele.
    
    // Verificăm comanda curentă
    const order = await prisma.order.findUnique({
        where: { id },
        include: { address: true } // Dacă ai relație
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (order.addressId) {
        // Actualizăm tabela Address relaționată
        await prisma.address.update({
            where: { id: order.addressId },
            data: {
                nume_prenume: address.nume_prenume,
                telefon: address.telefon,
                strada: address.strada,
                numar: address.numar,
                bloc: address.bloc,
                scara: address.scara,
                etaj: address.etaj,
                apartament: address.apartament,
                localitate: address.localitate,
                judet: address.judet,
                cod_postal: address.cod_postal
            }
        });
    } else {
        // Dacă nu are ID de adresă (e salvată ca JSON sau snapshot), actualizăm JSON-ul din order
        // Notă: Adaptează 'address' la numele coloanei tale din Prisma (ex: shippingAddressSnapshot)
        await prisma.order.update({
            where: { id },
            data: {
                // Presupunând că ai un câmp JSON sau similar pentru snapshot
                // Dacă nu ai, trebuie creat un Address nou și legat.
                // Aici salvăm în 'billing' dacă 'address' nu există, sau invers.
                // Adaptare generică:
                updatedAt: new Date(),
                // @ts-ignore - ignorăm eroarea de tip dacă structura diferă ușor
                addressSnapshot: address 
            }
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[UPDATE_ADDRESS]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}