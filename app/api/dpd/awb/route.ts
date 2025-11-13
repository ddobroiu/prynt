import { NextRequest, NextResponse } from 'next/server';
import { createShipment, printExtended, decodeBase64PdfToBuffer, trackingUrlForAwb, type CreateShipmentRequest, type ShipmentSender } from '../../../../lib/dpdService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/dpd/awb
 * Body: {
 *   shipment: CreateShipmentRequest (DPD shapes: recipient, service, content, payment, ref1/ref2, note)
 *   print?: { paperSize?: 'A6'|'A4'|'A4_4xA6', format?: 'pdf'|'zpl' }
 * }
 *
 * Returns: { success, shipmentId, parcels, labelBase64?, labelFileName? }
 *
 * NOTE: DPD requires a valid serviceId and address (siteName+postCode or siteId etc.).
 */
export async function POST(req: NextRequest) {
  try {
    const { shipment, print } = (await req.json()) as {
      shipment?: CreateShipmentRequest;
      print?: { paperSize?: 'A6' | 'A4' | 'A4_4xA6'; format?: 'pdf' | 'zpl' };
    };

    if (!shipment?.recipient || !shipment?.service || !shipment?.content || !shipment?.payment) {
      return NextResponse.json(
        { success: false, message: 'Parametri lipsă: recipient, service, content, payment' },
        { status: 400 }
      );
    }

    // Create shipment
    // Merge optional default sender from env if not present
    if (!shipment.sender) {
      const clientId = process.env.DPD_SENDER_CLIENT_ID ? Number(process.env.DPD_SENDER_CLIENT_ID) : undefined;
      const phone = process.env.DPD_SENDER_PHONE || undefined;
      const email = process.env.DPD_SENDER_EMAIL || undefined;
      const name = process.env.DPD_SENDER_NAME || undefined;
      const siteName = process.env.DPD_SENDER_SITE_NAME || undefined;
      const postCode = process.env.DPD_SENDER_POST_CODE || undefined;
      const addressNote = process.env.DPD_SENDER_ADDRESS_NOTE || undefined;
      const dropoffOfficeId = process.env.DPD_PICKUP_OFFICE_ID ? Number(process.env.DPD_PICKUP_OFFICE_ID) : undefined;
      let sender: ShipmentSender | undefined;
      if (clientId) {
        sender = { clientId, dropoffOfficeId } as ShipmentSender;
      } else if (siteName || postCode || addressNote || name || phone || email || dropoffOfficeId) {
        sender = {
          clientName: name,
          email,
          phone1: phone ? { number: phone } : undefined as any,
          address: siteName || postCode || addressNote ? { countryId: 642, siteName, postCode, addressNote } : undefined,
          dropoffOfficeId,
        } as ShipmentSender;
      }
      if (sender) (shipment as any).sender = sender;
    }

    const resp = await createShipment(shipment);
    if (resp?.error || !resp?.id) {
      return NextResponse.json(
        { success: false, message: resp?.error?.message || 'Eroare creare expediție', error: resp?.error, raw: resp },
        { status: 400 }
      );
    }

    const shipmentId = resp.id!;
    const parcels = resp.parcels || [];

    // Optional print label via extended endpoint (base64 PDF)
    let labelBase64: string | undefined;
    let labelFileName: string | undefined;
    if (print?.format !== 'zpl') {
      const { base64 } = await printExtended({
        paperSize: print?.paperSize || 'A6',
        parcels: parcels.map((p) => ({ id: p.id })),
        format: 'pdf',
      });
      if (base64) {
        labelBase64 = base64;
        labelFileName = `DPD_${shipmentId}.pdf`;
      }
    }

    const trackingUrl = trackingUrlForAwb(shipmentId);
    return NextResponse.json({ success: true, shipmentId, parcels, labelBase64, labelFileName, trackingUrl });
  } catch (e: any) {
    console.error('[API /dpd/awb] Error:', e?.message || e);
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}
