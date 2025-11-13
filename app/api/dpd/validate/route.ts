import { NextRequest, NextResponse } from 'next/server';
import { validateShipment, type CreateShipmentRequest } from '../../../../lib/dpdService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { shipment } = (await req.json()) as { shipment?: CreateShipmentRequest };
    if (!shipment?.recipient || !shipment?.service || !shipment?.content || !shipment?.payment) {
      return NextResponse.json(
        { ok: false, message: 'Parametri lipsă: recipient, service, content, payment' },
        { status: 400 }
      );
    }
    const res = await validateShipment(shipment);
    return NextResponse.json({ ok: true, valid: res.valid, error: res.error || null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Eroare internă' }, { status: 500 });
  }
}
