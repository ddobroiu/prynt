import { NextRequest } from 'next/server';
import { verifyAdminAction, signAdminAction } from '../../../../lib/adminAction';
import { createShipment, printExtended, trackingUrlForAwb, type ShipmentSender, validateShipment } from '../../../../lib/dpdService';
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
    const sidParam = searchParams.get('sid');
    const scidParam = searchParams.get('scid');
    const payload = verifyAdminAction(token);
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
        : [];
      const options = senderIds.length > 0 ? senderIds : (process.env.DPD_SENDER_CLIENT_ID ? [String(process.env.DPD_SENDER_CLIENT_ID)] : []);
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

    if (payload.action === 'cancel_awb') {
      // No-op for now; just acknowledge
      return htmlPage('Comandă marcată', '<h1>Comanda a fost marcată ca respinsă</h1><p>Nu s-a emis AWB.</p>');
    }

    if (payload.action === 'validate') {
      const address = payload.address;
      const serviceId = Number(searchParams.get('sid') || process.env.DPD_DEFAULT_SERVICE_ID || '');
      if (!serviceId) {
        return htmlPage('Validare AWB', '<h1>Lipsește serviceId</h1><p>Adaugă ?sid=XXXX în URL sau configură DPD_DEFAULT_SERVICE_ID.</p>');
      }

      const contentDesc = (payload.items || []).map((it) => `${it.name} x${it.qty}`).join(', ').slice(0, 200) || 'Materiale tipar';
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
      const tokenConfirm = signAdminAction({ action: 'confirm_awb', address, paymentType: payload.paymentType, totalAmount: payload.totalAmount });
      const confirmUrl = `${baseUrl}/api/dpd/admin-action?token=${encodeURIComponent(tokenConfirm)}&sid=${serviceId}`;
      if (v.valid) {
        return htmlPage('Validare AWB', `<h1>Date valide</h1><p>Poți emite AWB acum.</p><p><a href="${confirmUrl}" style="display:inline-block;padding:8px 12px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;">Emite AWB și trimite clientului</a></p>`);
      }
      return htmlPage('Validare AWB', `<h1>Validare eșuată</h1><pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:6px;">${(v.error && (v.error.message || JSON.stringify(v.error))) || 'Eroare necunoscută'}</pre>`);
    }

    if (payload.action === 'emit_awb' || payload.action === 'confirm_awb') {
      // Build minimal shipment from payload
      const address = payload.address;
      const serviceId = Number(payload.serviceId || sidParam || process.env.DPD_DEFAULT_SERVICE_ID || '');
      if (!serviceId) {
        const tokenEsc = encodeURIComponent(token);
        return htmlPage(
          'Configurare lipsă',
          `<h1>Lipsește DPD_DEFAULT_SERVICE_ID</h1>
           <p>Poți încerca manual un serviceId cunoscut:</p>
           <form method="get" style="margin-top:12px;">
             <input type="hidden" name="token" value="${tokenEsc}" />
             <label>serviceId:</label>
             <input name="sid" type="number" min="1" step="1" style="margin:0 8px;padding:6px;" />
             <button type="submit" style="padding:6px 10px;">Încearcă</button>
           </form>`
        );
      }

      // Optional default sender from env
      const sender: ShipmentSender | undefined = ((): ShipmentSender | undefined => {
        const overrideClientId = scidParam ? Number(scidParam) : (payload as any).senderClientId;
        const clientId = (overrideClientId ? Number(overrideClientId) : undefined) ?? (process.env.DPD_SENDER_CLIENT_ID ? Number(process.env.DPD_SENDER_CLIENT_ID) : undefined);
        const phone = process.env.DPD_SENDER_PHONE || undefined;
        const email = process.env.DPD_SENDER_EMAIL || undefined;
        const name = process.env.DPD_SENDER_NAME || undefined;
        const siteName = process.env.DPD_SENDER_SITE_NAME || undefined;
        const postCode = process.env.DPD_SENDER_POST_CODE || undefined;
        const addressNote = process.env.DPD_SENDER_ADDRESS_NOTE || undefined;
        const dropoffOfficeId = process.env.DPD_PICKUP_OFFICE_ID ? Number(process.env.DPD_PICKUP_OFFICE_ID) : undefined;
        if (!clientId && !siteName && !addressNote && !dropoffOfficeId && !name && !phone && !email) return undefined; // nothing configured
        // If clientId is provided, DPD forbids clientName; send minimal structure
        if (clientId) {
          return {
            clientId,
            dropoffOfficeId,
          } as ShipmentSender;
        }
        return {
          clientName: name,
          email,
          phone1: phone ? { number: phone } : undefined as any,
          address: siteName || postCode || addressNote ? { countryId: 642, siteName, postCode, addressNote } : undefined,
          dropoffOfficeId,
        } as ShipmentSender;
      })();

  const contentDesc = (payload.items || []).map((it) => `${it.name} x${it.qty}`).join(', ').slice(0, 200) || 'Materiale tipar';

      const isRamburs = (payload.paymentType || 'Ramburs') === 'Ramburs';
      const codAmount = isRamburs ? Math.max(0, Number(payload.totalAmount || 0)) : 0;

      // Optional COD bank account for sender (used by DPD to transfer COD)
      const senderBankAccount = process.env.DPD_COD_IBAN && process.env.DPD_COD_ACCOUNT_HOLDER
        ? { iban: process.env.DPD_COD_IBAN, accountHolder: process.env.DPD_COD_ACCOUNT_HOLDER }
        : undefined;

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
        content: {
          parcelsCount: 1,
          totalWeight: 1,
          contents: contentDesc,
          package: 'Pachet',
        },
        payment: {
          courierServicePayer: 'SENDER',
          senderBankAccount,
        },
        ref1: 'Order Email Action',
      } as any;

      // Before creating/printing, if action is confirm_awb, run validation
      if (payload.action === 'confirm_awb') {
        const v = await validateShipment(shipment as any);
        if (!v.valid) {
          const baseUrl = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prynt.ro';
          const tokenEdit = signAdminAction({
            action: 'edit',
            address,
            paymentType: payload.paymentType,
            totalAmount: payload.totalAmount,
            serviceId,
            senderClientId: (sender as any)?.clientId,
          });
          const editUrl = `${baseUrl}/api/dpd/admin-action?token=${encodeURIComponent(tokenEdit)}&sid=${serviceId}${(sender as any)?.clientId ? `&scid=${(sender as any).clientId}` : ''}`;
          return htmlPage(
            'Validare eșuată',
            `<h1>Validare AWB eșuată</h1>
             <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:6px;">${(v.error && (v.error.message || JSON.stringify(v.error))) || 'Eroare necunoscută'}</pre>
             <p style="margin-top:12px;"><a href="${editUrl}" style="display:inline-block;padding:8px 12px;background:#0ea5e9;color:#fff;border-radius:8px;text-decoration:none;">Editează datele și reîncearcă</a></p>`
          );
        }
      }

      // If we already have a shipmentId in token (emitted earlier), skip creation
      const preCreatedId = payload.shipmentId || searchParams.get('ship') || '';
      const created = preCreatedId
        ? { id: preCreatedId, parcels: (payload.parcels as any) || [] }
        : await createShipment(shipment);
      if ((created as any)?.error || !created?.id) {
        const msg = (created as any)?.error?.message || 'Eroare creare expediție';
        const tokenEsc = encodeURIComponent(token);
        return htmlPage(
          'Eroare AWB',
          `<h1>Nu am putut crea AWB</h1>
           <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:6px;">${msg}</pre>
           <div style="margin-top:12px;padding:10px;border:1px solid #eee;border-radius:6px;">
             <p style="margin:0 0 8px;">Dacă mesajul indică „Serviciu nevalid”, poți încerca alt <code>serviceId</code>:</p>
             <form method="get">
               <input type="hidden" name="token" value="${tokenEsc}" />
               <label>serviceId:</label>
               <input name="sid" type="number" min="1" step="1" style="margin:0 8px;padding:6px;" />
               <button type="submit" style="padding:6px 10px;">Încearcă din nou</button>
             </form>
           </div>`
        );
      }

      const shipmentId = created.id!;
      const parcels = (created.parcels || []) as any[];

      if (payload.action === 'emit_awb' && !preCreatedId) {
        // Do NOT print or email. Provide next-step link to send.
        const baseUrl = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prynt.ro';
        const tokenSend = signAdminAction({
          action: 'confirm_awb',
          address,
          paymentType: payload.paymentType,
          totalAmount: payload.totalAmount,
          shipmentId,
          parcels: parcels.map((p: any) => ({ id: p.id })),
        });
        const sendUrl = `${baseUrl}/api/dpd/admin-action?token=${encodeURIComponent(tokenSend)}&sid=${serviceId}`;
        const track = trackingUrlForAwb(shipmentId);
        return htmlPage(
          'AWB creat',
          `<h1>AWB creat (fără tipărire)</h1>
           <p>AWB: <strong>${shipmentId}</strong></p>
           <p><a href="${track}">Deschide pagina de tracking (MyDPD)</a></p>
           <p style="margin-top:16px;"><a href="${sendUrl}" style="display:inline-block;padding:8px 12px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none;">Trimite AWB clientului</a></p>
           <p style="color:#555">Poți edita expediția în MyDPD, apoi revino aici și apasă „Trimite AWB clientului”.</p>`
        );
      }

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
      const dataHref = base64 ? `data:application/pdf;base64,${base64}` : '';
      const download = base64 ? `<p><a href="${dataHref}" download="DPD_${shipmentId}.pdf" style="display:inline-block;padding:8px 12px;background:#334155;color:#fff;border-radius:8px;text-decoration:none;">Descarcă PDF</a></p>` : '';
      const viewer = base64 ? `<div style="margin-top:12px;border:1px solid #e5e7eb;height:70vh"><iframe src="${dataHref}" style="width:100%;height:100%;border:0" title="Etichetă DPD"></iframe></div>` : '';
      return htmlPage(
        'AWB emis',
        `<h1>AWB emis și trimis clientului</h1>
         <p>AWB: <strong>${shipmentId}</strong></p>
         <p><a href="${track}">Deschide pagina de tracking</a></p>
         ${download}
         ${viewer}`
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
    });
    const baseUrl = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prynt.ro';
    const url = `${baseUrl}/api/dpd/admin-action?token=${encodeURIComponent(updatedToken)}&sid=${serviceId}${senderClientId ? `&scid=${senderClientId}` : ''}`;
    return new Response(null, { status: 303, headers: { Location: url } });
  } catch (e: any) {
    console.error('[API /dpd/admin-action POST] Error:', e?.message || e);
    return htmlPage('Eroare', '<h1>Eroare internă</h1>');
  }
}
