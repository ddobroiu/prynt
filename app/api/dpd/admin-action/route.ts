import { NextRequest } from 'next/server';
import { verifyAdminAction, signAdminAction } from '../../../../lib/adminAction';
import { createShipment, printExtended, trackingUrlForAwb, type ShipmentSender, validateShipment } from '../../../../lib/dpdService';
import { Resend } from 'resend';
import { prisma } from '../../../../lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Funcție sigură pentru conținut - tăiem la 70 caractere pentru a evita erorile DPD (max 100)
function safeContent(items: any[]): string {
  if (!items || !Array.isArray(items)) return 'Materiale tipar';
  const text = items.map((it) => `${it.name} x${it.qty}`).join(', ');
  if (text.length > 70) {
    return text.slice(0, 67) + '...';
  }
  return text || 'Materiale tipar';
}

function htmlPage(title: string, body: string): Response {
  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title}</title></head><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px;">${body}</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || '';
    const sidParam = searchParams.get('sid');
    const scidParam = searchParams.get('scid');
    const payload = verifyAdminAction(token);
    console.log('[admin-action] token-present:', !!token, 'action:', payload?.action, 'orderId:', payload?.orderId);
    if (!payload) {
      return htmlPage('Link invalid', '<h1>Link invalid sau expirat</h1><p>Îți rugăm să soliciți un link nou.</p>');
    }

    if (payload.action === 'edit') {
      const address = payload.address;
      const baseUrl = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prynt.ro';
      const currentServiceId = Number(payload.serviceId || sidParam || process.env.DPD_DEFAULT_SERVICE_ID || '') || '';
      const currentSenderId = Number(payload.senderClientId || scidParam || process.env.DPD_SENDER_CLIENT_ID || '') || '';
      const senderIdsEnv = (process.env.DPD_SENDER_CLIENT_IDS || '').trim();
      const senderIds = senderIdsEnv
        ? senderIdsEnv.split(',').map((x) => x.trim()).filter(Boolean)
        : [
            '44820819006:Sibiu',
            '44820819002:Bucuresti',
            '44820819000:Topliceni',
          ];
      const options = senderIds;
      const optsHtml = options
        .map((id) => {
          const [val, label] = id.includes(':') ? id.split(':', 2) : [id, `Sediu ${id}`];
          const sel = String(currentSenderId) === String(val) ? 'selected' : '';
          return `<option value="${val}" ${sel}>${label} (${val})</option>`;
        })
        .join('');

      const tokenEsc = encodeURIComponent(token);
      const body = `
        <h1>Editează datele pentru AWB</h1>
        <form method="post" style="margin-top:12px;max-width:720px;">
          <input type="hidden" name="token" value="${tokenEsc}" />
          <input type="hidden" name="intent" value="edit_submit" />
          <fieldset style="border:1px solid #eee;padding:12px;border-radius:8px;margin-bottom:12px;">
            <legend style="padding:0 6px;">Destinatar</legend>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <label>Nume<br/><input name="nume_prenume" value="${address.nume_prenume}" style="width:100%;padding:6px" /></label>
              <label>Email<br/><input name="email" value="${address.email}" style="width:100%;padding:6px" /></label>
              <label>Telefon<br/><input name="telefon" value="${address.telefon}" style="width:100%;padding:6px" /></label>
              <label>Cod poștal<br/><input name="postCode" value="${address.postCode || ''}" style="width:100%;padding:6px" /></label>
              <label>Județ<br/><input name="judet" value="${address.judet}" style="width:100%;padding:6px" /></label>
              <label>Localitate<br/><input name="localitate" value="${address.localitate}" style="width:100%;padding:6px" /></label>
            </div>
            <label style="display:block;margin-top:8px;">Stradă și număr<br/><input name="strada_nr" value="${address.strada_nr}" style="width:100%;padding:6px" /></label>
          </fieldset>

          <fieldset style="border:1px solid #eee;padding:12px;border-radius:8px;margin-bottom:12px;">
            <legend style="padding:0 6px;">Livrare și plată</legend>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:end;">
              <label>Tip plată
                <select name="paymentType" style="width:100%;padding:6px">
                  <option value="Ramburs" ${payload.paymentType !== 'Card' ? 'selected' : ''}>Ramburs</option>
                  <option value="Card" ${payload.paymentType === 'Card' ? 'selected' : ''}>Card</option>
                </select>
              </label>
              <label>Total comandă (RON) – pentru COD<br/><input name="totalAmount" type="number" step="0.01" value="${typeof payload.totalAmount === 'number' ? payload.totalAmount : ''}" style="width:100%;padding:6px" /></label>
              <label>Serviciu DPD (serviceId)<br/><input name="serviceId" type="number" step="1" value="${currentServiceId}" style="width:100%;padding:6px" /></label>
              <label>Expediere din sediu (senderClientId)<br/>
                <select name="senderClientId" style="width:100%;padding:6px">
                  <option value="">(implicit din .env)</option>
                  ${optsHtml}
                </select>
              </label>
            </div>
          </fieldset>

          <div style="display:flex;gap:8px;">
            <button type="submit" style="padding:10px 16px;background:#16a34a;color:#fff;border:0;border-radius:8px;">Salvează și trimite</button>
            <a href="${baseUrl}/api/dpd/admin-action?token=${tokenEsc}" style="padding:10px 16px;background:#64748b;color:#fff;border-radius:8px;text-decoration:none;">Anulează</a>
          </div>
        </form>
      `;
      return htmlPage('Editează AWB', body);
    }

    if (payload.action === 'validate') {
      console.log('[admin-action] validate payload:', { orderId: payload.orderId, items: (payload.items || []).length, paymentType: payload.paymentType, totalAmount: payload.totalAmount });
      const address = payload.address;
      const serviceId = Number(searchParams.get('sid') || process.env.DPD_DEFAULT_SERVICE_ID || '');
      if (!serviceId) {
        return htmlPage('Validare AWB', '<h1>Lipsește serviceId</h1><p>Adaugă ?sid=XXXX în URL sau configură DPD_DEFAULT_SERVICE_ID.</p>');
      }

      // APLICĂM FUNCȚIA SAFE CONTENT
      const contentDesc = safeContent(payload.items ?? []);
      
      const req: any = {
        recipient: {
          clientName: address.nume_prenume,
          contactName: address.nume_prenume,
          email: address.email,
          phone1: { number: address.telefon },
          privatePerson: true,
          address: { countryId: 642, siteName: address.localitate, postCode: address.postCode, addressNote: `${address.strada_nr}, ${address.localitate}, ${address.judet}` },
        },
        service: { serviceId, autoAdjustPickupDate: true },
        content: { parcelsCount: 1, totalWeight: 1, contents: contentDesc, package: 'Pachet' },
        payment: { courierServicePayer: 'SENDER' },
      };
      const v = await validateShipment(req);
      const baseUrl = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prynt.ro';
      
      // --- FIX CRITIC: Păstrăm orderId și items ---
        const tokenConfirm = signAdminAction({ 
          action: 'confirm_awb', 
          address, 
          paymentType: payload.paymentType, 
          totalAmount: payload.totalAmount,
          orderId: payload.orderId,
          items: payload.items 
      });
        console.log('[admin-action] generate confirm token for order:', payload.orderId);
      
      const confirmUrl = `${baseUrl}/api/dpd/admin-action?token=${encodeURIComponent(tokenConfirm)}&sid=${serviceId}`;
      if (v.valid) {
        return htmlPage('Validare AWB', `<h1>Date valide</h1><p>Poți emite AWB acum.</p><p><a href="${confirmUrl}" style="display:inline-block;padding:8px 12px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;">Emite AWB și trimite clientului</a></p>`);
      }
      return htmlPage('Validare AWB', `<h1>Validare eșuată</h1><pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:6px;">${(v.error && (v.error.message || JSON.stringify(v.error))) || 'Eroare necunoscută'}</pre>`);
    }

    if (payload.action === 'emit_awb' || payload.action === 'confirm_awb') {
      const address = payload.address;
      const serviceId = Number(payload.serviceId || sidParam || process.env.DPD_DEFAULT_SERVICE_ID || '');
      if (!serviceId) {
        const tokenEsc = encodeURIComponent(token);
        return htmlPage('Configurare lipsă', '<h1>Lipsește DPD_DEFAULT_SERVICE_ID</h1>'); 
      }

      const sender: ShipmentSender | undefined = ((): ShipmentSender | undefined => {
        const overrideClientId = scidParam ? Number(scidParam) : (payload as any).senderClientId;
        const clientId = (overrideClientId ? Number(overrideClientId) : undefined) ?? (process.env.DPD_SENDER_CLIENT_ID ? Number(process.env.DPD_SENDER_CLIENT_ID) : undefined);
        const dropoffOfficeId = process.env.DPD_PICKUP_OFFICE_ID ? Number(process.env.DPD_PICKUP_OFFICE_ID) : undefined;
        if (clientId) return { clientId, dropoffOfficeId } as ShipmentSender;
        return undefined; 
      })();

      // APLICĂM FUNCȚIA SAFE CONTENT
      const contentDesc = safeContent(payload.items ?? []);

      const isRamburs = (payload.paymentType || 'Ramburs') === 'Ramburs';
      const codAmount = isRamburs ? Math.max(0, Number(payload.totalAmount || 0)) : 0;

      const shipment = {
        sender,
        recipient: {
          clientName: address.nume_prenume,
          contactName: address.nume_prenume,
          email: address.email,
          phone1: { number: address.telefon },
          privatePerson: true,
          address: {
            countryId: 642,
            siteName: address.localitate,
            postCode: address.postCode,
            addressNote: `${address.strada_nr}, ${address.localitate}, ${address.judet}`,
          },
        },
        service: {
          serviceId,
          autoAdjustPickupDate: true,
          additionalServices: codAmount > 0 ? { cod: { amount: codAmount, currencyCode: 'RON' } } : undefined,
        },
        content: { parcelsCount: 1, totalWeight: 1, contents: contentDesc, package: 'Pachet' },
        payment: { courierServicePayer: 'SENDER' },
        ref1: 'Order Email Action',
      } as any;

      if (payload.action === 'confirm_awb') {
        const v = await validateShipment(shipment as any);
        if (!v.valid) {
           return htmlPage('Validare eșuată', `<h1>Eroare validare la confirmare</h1><p>${JSON.stringify(v.error)}</p>`);
        }
      }

      const created = await createShipment(shipment);
      if ((created as any)?.error || !created?.id) {
         return htmlPage('Eroare AWB', `<h1>Eroare creare</h1><p>${(created as any)?.error?.message}</p>`);
      }

      const shipmentId = created.id!;
      const parcels = (created.parcels || []) as any[];
      
      const { base64 } = await printExtended({
        paperSize: 'A6',
        parcels: parcels.map((p) => ({ id: p.id })),
        format: 'pdf',
      });

      // --- FIX CRITIC: SALVAREA ÎN BAZA DE DATE ---
      if (payload.orderId) {
        try {
          console.log('Saving AWB for order:', payload.orderId, shipmentId);
          await prisma.order.update({ 
              where: { id: payload.orderId }, 
              data: { awbNumber: shipmentId, awbCarrier: 'DPD' } 
          });
          try {
            // revalidate admin pages so AWB is visible immediately
            const { revalidatePath } = await import('next/cache');
            revalidatePath('/admin/orders');
            revalidatePath('/admin/users');
          } catch (re) {
            console.warn('[revalidate] admin-action failed', (re as any)?.message || re);
          }
        } catch (e) {
          console.error('DB Error Saving AWB', e);
        }
      } else {
          console.error('MISSING ORDER ID in confirm_awb payload. AWB generated but not linked.');
      }

      try {
        const apiKey = process.env.RESEND_API_KEY;
        const resend = apiKey ? new Resend(apiKey) : null;
        const trackingUrl = trackingUrlForAwb(shipmentId);
        const subject = `AWB DPD ${shipmentId}`;
        const html = `<p>Bună ${address.nume_prenume},</p>
<p>Expediția ta a fost confirmată. AWB: <strong>${shipmentId}</strong>.</p>
<p>Poți urmări statusul livrării aici: <a href="${trackingUrl}">${trackingUrl}</a>.</p>
<p>Eticheta PDF este atașată.</p>`;
        if (resend) {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'contact@prynt.ro',
            to: address.email,
            bcc: process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL] : undefined,
            subject,
            html,
            attachments: base64 ? [{ filename: `DPD_${shipmentId}.pdf`, content: Buffer.from(base64, 'base64') }] : undefined,
          } as any);
        }
      } catch (e) {
        console.warn('[admin-action] Email client failed:', (e as any)?.message || e);
      }

      const track = trackingUrlForAwb(shipmentId);
      const dataHref = base64 ? `data:application/pdf;base64,${base64}` : '';
      
      return htmlPage(
        'AWB emis',
        `<h1>AWB emis cu succes</h1>
         <p>AWB: <strong>${shipmentId}</strong></p>
         <p>Comanda a fost actualizată automat.</p>
         <p><a href="${track}" target="_blank">Tracking DPD</a></p>
         ${base64 ? `<p><a href="${dataHref}" download="DPD_${shipmentId}.pdf" style="background:#333;color:#fff;padding:10px;border-radius:5px;text-decoration:none">Descarcă PDF</a></p>` : ''}`
      );
    }

    return htmlPage('Acțiune necunoscută', '<h1>Acțiune necunoscută</h1>');
  } catch (e: any) {
    console.error('[API /dpd/admin-action] Error:', e?.message || e);
    return htmlPage('Eroare', '<h1>Eroare internă</h1>');
  }
}

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const token = String(form.get('token') || '');
        const intent = String(form.get('intent') || '');
        const payload = verifyAdminAction(token);
        if (!payload || intent !== 'edit_submit') {
          return htmlPage('Link invalid', '<h1>Link invalid sau acțiune nepermisă</h1>');
        }
    
        const address = {
          nume_prenume: String(form.get('nume_prenume') || payload.address.nume_prenume || ''),
          email: String(form.get('email') || payload.address.email || ''),
          telefon: String(form.get('telefon') || payload.address.telefon || ''),
          judet: String(form.get('judet') || payload.address.judet || ''),
          localitate: String(form.get('localitate') || payload.address.localitate || ''),
          strada_nr: String(form.get('strada_nr') || payload.address.strada_nr || ''),
          postCode: String(form.get('postCode') || payload.address.postCode || ''),
        };
        const paymentType = (String(form.get('paymentType') || payload.paymentType || 'Ramburs') === 'Card') ? 'Card' : 'Ramburs';
        const totalAmountRaw = Number(String(form.get('totalAmount') || ''));
        const totalAmount = Number.isFinite(totalAmountRaw) ? totalAmountRaw : payload.totalAmount;
        const serviceIdRaw = Number(String(form.get('serviceId') || ''));
        const serviceId = Number.isFinite(serviceIdRaw) ? serviceIdRaw : (payload as any).serviceId;
        const senderClientIdRaw = Number(String(form.get('senderClientId') || ''));
        const senderClientId = Number.isFinite(senderClientIdRaw) ? senderClientIdRaw : (payload as any).senderClientId;
    
        const updatedToken = signAdminAction({
          action: 'confirm_awb',
          address,
          paymentType,
          totalAmount,
          serviceId,
          senderClientId,
          orderId: payload.orderId, // Păstrăm orderId
          items: payload.items // Păstrăm items
        });
        const baseUrl = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prynt.ro';
        const url = `${baseUrl}/api/dpd/admin-action?token=${encodeURIComponent(updatedToken)}&sid=${serviceId}${senderClientId ? `&scid=${senderClientId}` : ''}`;
        return new Response(null, { status: 303, headers: { Location: url } });
      } catch (e: any) {
        console.error('[API /dpd/admin-action POST] Error:', e?.message || e);
        return htmlPage('Eroare', '<h1>Eroare internă</h1>');
      }
}