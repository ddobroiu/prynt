import { NextRequest } from 'next/server';
import { verifyAdminAction } from '../../../../lib/adminAction';
import { createShipment, printExtended, trackingUrlForAwb, type ShipmentSender } from '../../../../lib/dpdService';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Avoid top-level Resend init; may fail at build when env missing on platform

function htmlPage(title: string, body: string): Response {
  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title}</title></head><body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px;">${body}</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || '';
    const payload = verifyAdminAction(token);
    if (!payload) {
      return htmlPage('Link invalid', '<h1>Link invalid sau expirat</h1><p>Îți rugăm să soliciți un link nou.</p>');
    }

    if (payload.action === 'cancel_awb') {
      // No-op for now; just acknowledge
      return htmlPage('Comandă marcată', '<h1>Comanda a fost marcată ca respinsă</h1><p>Nu s-a emis AWB.</p>');
    }

    if (payload.action === 'confirm_awb') {
      // Build minimal shipment from payload
      const address = payload.address;
      const serviceId = Number(process.env.DPD_DEFAULT_SERVICE_ID || '');
      if (!serviceId) {
        return htmlPage('Configurare lipsă', '<h1>Lipsește DPD_DEFAULT_SERVICE_ID</h1><p>Setează variabila de mediu DPD_DEFAULT_SERVICE_ID pentru a putea emite AWB.</p>');
      }

      // Optional default sender from env
      const sender: ShipmentSender | undefined = ((): ShipmentSender | undefined => {
        const clientId = process.env.DPD_SENDER_CLIENT_ID ? Number(process.env.DPD_SENDER_CLIENT_ID) : undefined;
        const phone = process.env.DPD_SENDER_PHONE || undefined;
        const email = process.env.DPD_SENDER_EMAIL || undefined;
        const name = process.env.DPD_SENDER_NAME || undefined;
        const siteName = process.env.DPD_SENDER_SITE_NAME || undefined;
        const postCode = process.env.DPD_SENDER_POST_CODE || undefined;
        const addressNote = process.env.DPD_SENDER_ADDRESS_NOTE || undefined;
        const dropoffOfficeId = process.env.DPD_PICKUP_OFFICE_ID ? Number(process.env.DPD_PICKUP_OFFICE_ID) : undefined;
        if (!clientId && !siteName && !addressNote && !dropoffOfficeId) return undefined; // nothing configured
        return {
          clientId,
          clientName: name,
          email,
          phone1: phone ? { number: phone } : { number: '' },
          address: siteName || postCode || addressNote ? {
            countryId: 642,
            siteName: siteName,
            postCode: postCode,
            addressNote,
          } : undefined,
          dropoffOfficeId,
        } as ShipmentSender;
      })();

  const contentDesc = (payload.items || []).map((it) => `${it.name} x${it.qty}`).join(', ').slice(0, 200) || 'Materiale tipar';

      const shipment = {
        sender,
        recipient: {
          clientName: address.nume_prenume,
          contactName: address.nume_prenume,
          email: address.email,
          phone1: { number: address.telefon },
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
        },
        content: {
          parcelsCount: 1,
          totalWeight: 1,
          contents: contentDesc,
          package: 'Pachet',
        },
        payment: {
          courierServicePayer: 'SENDER',
        },
        ref1: 'Order Email Action',
      } as any;

      const created = await createShipment(shipment);
      if (created?.error || !created?.id) {
        const msg = created?.error?.message || 'Eroare creare expediție';
        return htmlPage('Eroare AWB', `<h1>Nu am putut crea AWB</h1><pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:6px;">${msg}</pre>`);
      }

      const shipmentId = created.id!;
      const parcels = created.parcels || [];
      const { base64 } = await printExtended({
        paperSize: 'A6',
        parcels: parcels.map((p) => ({ id: p.id })),
        format: 'pdf',
      });

      // Email client
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
        } else {
          console.warn('[admin-action] RESEND_API_KEY missing – skipping client email');
        }
      } catch (e) {
        // Continue; the AWB exists even if email fails
        console.warn('[admin-action] Email client failed:', (e as any)?.message || e);
      }

      const track = trackingUrlForAwb(shipmentId);
      return htmlPage(
        'AWB emis',
        `<h1>AWB emis și trimis clientului</h1>
         <p>AWB: <strong>${shipmentId}</strong></p>
         <p><a href="${track}">Deschide pagina de tracking</a></p>`
      );
    }

    return htmlPage('Acțiune necunoscută', '<h1>Acțiune necunoscută</h1>');
  } catch (e: any) {
    console.error('[API /dpd/admin-action] Error:', e?.message || e);
    return htmlPage('Eroare', '<h1>Eroare internă</h1>');
  }
}
