import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminSession';
import { prisma } from '@/lib/prisma';
import { printExtended } from '@/lib/dpdService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('admin_auth')?.value;
    const session = verifyAdminSession(token);
    if (!session) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ ok: false, message: 'Order not found' }, { status: 404 });

    const awb = order.awbNumber;
    if (!awb) return NextResponse.json({ ok: false, message: 'AWB missing on order' }, { status: 400 });

    // If we have a saved label in DB, return it directly
    if ((order as any).awbLabelBase64) {
      const base64 = (order as any).awbLabelBase64 as string;
      const fileName = (order as any).awbLabelFileName || `DPD_${awb}.pdf`;
      const pdfBuffer = Buffer.from(base64, 'base64');
      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': String(pdfBuffer.length),
          'Content-Disposition': `attachment; filename=${fileName}`,
        },
      });
    }

    // Fallback: try to print label by providing externalCarrierParcelNumber = AWB
    try {
      const r = await printExtended({ paperSize: 'A6', parcels: [{ externalCarrierParcelNumber: String(awb) }], format: 'pdf' });
      if (r?.error) {
        console.warn('[download-awb] printExtended returned error', r.error);
        return NextResponse.json({ ok: false, message: 'Unable to generate label' }, { status: 500 });
      }
      if (!r?.base64) {
        return NextResponse.json({ ok: false, message: 'Label not available' }, { status: 404 });
      }

      const pdfBuffer = Buffer.from(r.base64, 'base64');
      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': String(pdfBuffer.length),
          'Content-Disposition': `attachment; filename=DPD_${awb}.pdf`,
        },
      });
    } catch (e: any) {
      console.error('[download-awb] printExtended failed', e?.message || e);
      return NextResponse.json({ ok: false, message: 'Eroare la generare etichetă' }, { status: 500 });
    }
  } catch (e: any) {
    console.error('[API download-awb] Error:', e?.message || e);
    return NextResponse.json({ ok: false, message: 'Eroare internă' }, { status: 500 });
  }
}
