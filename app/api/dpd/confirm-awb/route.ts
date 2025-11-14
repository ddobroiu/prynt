import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createShipment, printExtended, trackingUrlForAwb, type CreateShipmentRequest } from '../../../../lib/dpdService';
import { prisma } from '../../../../lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Do NOT instantiate Resend at module load; Railway build may not have env set.

/**
 * POST /api/dpd/confirm-awb
 * Body: {
 *   shipment: CreateShipmentRequest,
 *   email: string,           // client email (for AWB mail)
 *   name?: string,           // client name (optional)
 * }
 * Behavior: creates shipment, prints label (PDF base64) and emails AWB to client.
 */
export async function POST(req: NextRequest) {
  try {
    const { shipment, email, name, orderId } = (await req.json()) as {
      shipment?: CreateShipmentRequest;
      email?: string;
      name?: string;
      orderId?: string;
    };

    if (!shipment?.recipient || !shipment?.service || !shipment?.content || !shipment?.payment) {
      return NextResponse.json(
        { ok: false, message: 'Parametri lipsă: recipient, service, content, payment' },
        { status: 400 }
      );
    }

    // Create shipment
    const created = await createShipment(shipment);
    if (created?.error || !created?.id) {
      return NextResponse.json(
        { ok: false, message: created?.error?.message || 'Eroare creare expediție', error: created?.error },
        { status: 400 }
      );
    }

  const shipmentId = created.id!;
    const parcels = created.parcels || [];
  const trackingUrl = trackingUrlForAwb(shipmentId);

    // Persist AWB to order if provided
    if (orderId) {
      try {
        await prisma.order.update({ where: { id: orderId }, data: { awbNumber: shipmentId, awbCarrier: 'DPD' } });
      } catch (e) {
        console.warn('[confirm-awb] Persist AWB failed:', (e as any)?.message || e);
      }
    }

    // Print label
    const { base64 } = await printExtended({
      paperSize: 'A6',
      parcels: parcels.map((p) => ({ id: p.id })),
      format: 'pdf',
    });

    // Send email to client (if provided)
    if (email) {
      try {
        const apiKey = process.env.RESEND_API_KEY;
        const resend = apiKey ? new Resend(apiKey) : null;
        if (!resend) throw new Error('RESEND_API_KEY lipsă');
        const subject = `AWB DPD ${shipmentId}`;
        const html = `<p>Bună${name ? ' ' + name : ''},</p>
<p>Expediția ta a fost confirmată. AWB: <strong>${shipmentId}</strong>.</p>
<p>Poți urmări statusul livrării aici: <a href="${trackingUrl}">${trackingUrl}</a> (introdu AWB-ul dacă este necesar).</p>
<p>Găsești atașat fișierul PDF al etichetei (A6) pentru livrare.</p>
<p>Îți mulțumim!</p>`;
        const attachments = base64
          ? [{ filename: `DPD_${shipmentId}.pdf`, content: Buffer.from(base64, 'base64') }]
          : undefined;
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'contact@prynt.ro',
          to: email,
          bcc: process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL] : undefined,
          subject,
          html,
          attachments,
        } as any);
      } catch (e) {
        console.warn('[DPD confirm-awb] Eroare trimitere email:', (e as any)?.message || e);
      }
    }

    return NextResponse.json({ ok: true, shipmentId, parcels, hasLabel: !!base64, trackingUrl });
  } catch (e: any) {
    console.error('[API /dpd/confirm-awb] Error:', e?.message || e);
    return NextResponse.json({ ok: false, message: 'Eroare internă' }, { status: 500 });
  }
}
