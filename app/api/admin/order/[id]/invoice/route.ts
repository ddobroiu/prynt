import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdminSession } from '../../../../../../lib/adminSession';
import { prisma } from '../../../../../../lib/prisma';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { getOblioAccessToken, createOblioInvoice } from '../../../../../../lib/orderService';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DATA_DIR = path.join(process.cwd(), '.data');
const INVOICES_PATH = path.join(DATA_DIR, 'invoices.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(INVOICES_PATH)) fs.writeFileSync(INVOICES_PATH, '{}');
}

async function fileSave(id: string, data: any) {
  ensureDir();
  try {
    const raw = await fs.promises.readFile(INVOICES_PATH, 'utf8').catch(() => '{}');
    let map: Record<string, any> = {};
    try { map = JSON.parse(raw || '{}'); } catch { map = {}; }
    map[id] = { ...(map[id] || {}), ...data };
    await fs.promises.writeFile(INVOICES_PATH, JSON.stringify(map, null, 2), 'utf8');
  } catch {}
}

export async function POST(req: Request, ctx: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_auth')?.value;
    const session = verifyAdminSession(token);
    if (!session) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });

    const id = ctx?.params?.id as string;
    if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const { invoiceLink, generate, billing } = body as any;

    if (process.env.DATABASE_URL) {
      // Load order
      const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
      if (!order) return NextResponse.json({ ok: false, message: 'Order not found' }, { status: 404 });

      let linkToSave: string | null = null;
      const orderAddress = typeof order.address === 'object' ? (order.address as any) : {};
      const orderBillingBase = typeof order.billing === 'object' ? (order.billing as any) : {};

      if (generate) {
        // Try to create invoice via Oblio using provided billing or order.billing
        try {
          const tokenOblio = await getOblioAccessToken();
          const orderBilling = billing || (typeof order.billing === 'object' ? (order.billing as any) : {}) || {};
          const orderAddress = typeof order.address === 'object' ? (order.address as any) : {};
          const orderItems = (order.items as any[]) || [];
          const products = orderItems.map((it: any) => ({
            name: it.name || 'Produs',
            price: Number(it.unit || it.unitAmount || it.price || 0) || Number(it.unit) || 0,
            measuringUnitName: 'buc',
            vatName: 'S',
            quantity: Number(it.qty || it.quantity || 1) || 1,
          }));

          // Determinare nume client: Denumire Companie -> Nume Factura -> Nume Livrare -> Client
          const clientName = orderBilling.denumire_companie || orderBilling.name || orderBilling.cui || orderAddress?.nume_prenume || orderAddress?.name || 'Client';

          const client: any = {
            name: clientName,
            address: orderBilling.strada_nr || orderAddress?.strada_nr || '',
            email: orderBilling.email || orderAddress?.email,
            phone: orderBilling.telefon || orderBilling.phone || orderAddress?.telefon,
          };

          // Adaugare CIF/CUI daca exista
          if (orderBilling.cui) {
            let cui = String(orderBilling.cui).trim().toUpperCase();
            if (!cui.startsWith('RO')) cui = `RO${cui}`;
            client.cif = cui;
          }
          
          // Adaugare Reg Com daca exista
          if (orderBilling.reg_com) {
            client.rc = orderBilling.reg_com;
          }

          const payload = {
            cif: process.env.OBLIO_CIF_FIRMA,
            client,
            issueDate: new Date().toISOString().slice(0, 10),
            seriesName: process.env.OBLIO_SERIE_FACTURA,
            products,
          };

          const resp = await createOblioInvoice(payload, tokenOblio);
          const link = (resp && (resp.data?.link || resp.link || resp.data?.url || resp.url)) as string | undefined;
          if (link) {
            linkToSave = link;
          } else {
            console.warn('[admin/invoice] Oblio response without link', resp);
          }
        } catch (e: any) {
          console.error('[admin/invoice] Oblio error:', e?.message || e);
          return NextResponse.json({ ok: false, message: 'Eroare la emitere factura: ' + (e?.message || e) }, { status: 500 });
        }
      }

      if (invoiceLink || linkToSave) {
        const final = invoiceLink || linkToSave || null;
        await prisma.order.update({ where: { id }, data: { invoiceLink: final, billing: billing ? billing : order.billing } });
        // notify client via simple email (if key present)
        try {
          if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const billingToNotify = billing || orderBillingBase || {};
            const to = (billingToNotify && billingToNotify.email) || orderAddress?.email;
            if (to) {
              await resend.emails.send({
                from: process.env.EMAIL_FROM || 'contact@prynt.ro',
                to,
                subject: 'Factura comanda Prynt',
                html: `<p>Am adăugat factura pentru comanda ta. Poți descărca factura aici: <a href="${final}">Descarcă factura</a></p>`,
              });
            }
          }
        } catch (e: any) {
          console.warn('[admin/invoice] Email notify failed:', e?.message || e);
        }

        return NextResponse.json({ ok: true, invoiceLink: (invoiceLink || linkToSave) });
      }

      // If generate not requested and no invoiceLink provided
      return NextResponse.json({ ok: false, message: 'Nicio acțiune realizată' }, { status: 400 });
    } else {
      // File fallback
      if (invoiceLink) {
        await fileSave(id, { invoiceLink, billing: billing || null });
        return NextResponse.json({ ok: true, invoiceLink });
      }
      if (generate) {
        return NextResponse.json({ ok: false, message: 'Emitere Oblio necesită DB și credențiale' }, { status: 500 });
      }
      return NextResponse.json({ ok: false, message: 'Nicio acțiune' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Error' }, { status: 500 });
  }
}