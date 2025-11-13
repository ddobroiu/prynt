import { NextRequest, NextResponse } from 'next/server';
import { createShipment, printExtended, decodeBase64PdfToBuffer, type CreateShipmentRequest } from '../../../../lib/dpdService';

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

    return NextResponse.json({ success: true, shipmentId, parcels, labelBase64, labelFileName });
  } catch (e: any) {
    console.error('[API /dpd/awb] Error:', e?.message || e);
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}
