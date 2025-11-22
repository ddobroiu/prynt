import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminSession';
import { createShipment, printExtended, trackingUrlForAwb } from '@/lib/dpdService';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('admin_auth')?.value;
    const session = verifyAdminSession(token);
    if (!session) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return NextResponse.json({ ok: false, message: 'Order not found' }, { status: 404 });

    const address = order.address as any;
    const serviceId = Number(process.env.DPD_DEFAULT_SERVICE_ID || 0) || undefined;
    if (!serviceId) return NextResponse.json({ ok: false, message: 'DPD serviceId not configured' }, { status: 500 });

    // Build shipment
    const contentDesc = (order.items || []).map((it: any) => `${it.name} x${it.qty}`).join(', ').slice(0, 70) || 'Materiale tipar';
    const isRamburs = (order.paymentType || 'Ramburs') === 'Ramburs';
    const codAmount = isRamburs ? Math.max(0, Number(order.total || 0)) : 0;

    const shipment: any = {
      recipient: {
        clientName: address?.nume_prenume || address?.nume || order.user?.name || 'Client',
        contactName: address?.nume_prenume || address?.nume || order.user?.name || 'Client',
        email: address?.email || order.user?.email || undefined,
        phone1: { number: address?.telefon || order.user?.phone || undefined },
        privatePerson: true,
        address: { countryId: 642, siteName: address?.localitate, postCode: address?.postCode, addressNote: `${address?.strada_nr || ''}, ${address?.localitate || ''}, ${address?.judet || ''}` },
      },
      service: { serviceId, autoAdjustPickupDate: true },
      content: { parcelsCount: 1, totalWeight: 1, contents: contentDesc, package: 'Pachet' },
      payment: { courierServicePayer: 'SENDER' },
    };
    if (codAmount > 0) {
      shipment.service.additionalServices = { cod: { amount: codAmount, currencyCode: 'RON' } };
    }

    // Create shipment via DPD service
    const created = await createShipment(shipment);
    if ((created as any)?.error || !created?.id) {
      return NextResponse.json({ ok: false, message: (created as any)?.error?.message || 'Eroare creare expediție', raw: created }, { status: 400 });
    }

    const shipmentId = created.id!;
    const parcels = created.parcels || [];

    // Save AWB to order
    try {
      await prisma.order.update({ where: { id: order.id }, data: { awbNumber: shipmentId, awbCarrier: 'DPD' } });
      try {
        const { revalidatePath } = await import('next/cache');
        revalidatePath('/admin/orders');
        revalidatePath('/admin/users');
      } catch (re) {
        console.warn('[revalidate] emit-awb failed', (re as any)?.message || re);
      }
    } catch (e) {
      console.error('DB Error saving AWB', (e as any)?.message || e);
    }

    // Optional: print label PDF
    let base64: string | undefined;
    try {
      const r = await printExtended({ paperSize: 'A6', parcels: parcels.map((p: any) => ({ id: p.id })), format: 'pdf' });
      base64 = r.base64;
    } catch (e) {
      console.warn('[emit-awb] print label failed', (e as any)?.message || e);
    }

    // Email client with AWB and label
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const resend = apiKey ? new Resend(apiKey) : null;
      const trackingUrl = trackingUrlForAwb(shipmentId);
      if (resend && (address?.email || order.user?.email)) {
        const subject = `AWB DPD ${shipmentId}`;
        const html = `<p>Bună ${address?.nume_prenume || order.user?.name || ''},</p><p>Am emis AWB-ul: <strong>${shipmentId}</strong>.</p><p>Urmărește livrarea: <a href="${trackingUrl}">${trackingUrl}</a></p>`;
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'contact@prynt.ro',
          to: address?.email || order.user?.email,
          subject,
          html,
          attachments: base64 ? [{ filename: `DPD_${shipmentId}.pdf`, content: Buffer.from(base64, 'base64') }] : undefined,
        } as any);
      }
    } catch (e) {
      console.warn('[emit-awb] email failed', (e as any)?.message || e);
    }

    const trackingUrl = trackingUrlForAwb(shipmentId);
    return NextResponse.json({ ok: true, shipmentId, trackingUrl, hasLabel: !!base64 });
  } catch (e: any) {
    console.error('[API /admin/orders/[id]/emit-awb] Error:', e?.message || e);
    return NextResponse.json({ ok: false, message: 'Eroare internă' }, { status: 500 });
  }
}
