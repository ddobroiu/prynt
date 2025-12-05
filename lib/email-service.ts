import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OfferEmailParams {
  to: string;
  customerName: string;
  orderNo: string;
  total: number;
  pdfLink: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    details?: string;
  }>;
}

export async function sendOfferEmail(params: OfferEmailParams) {
  const { to, customerName, orderNo, total, pdfLink, items } = params;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} RON</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${(item.price * item.quantity).toFixed(2)} RON</td>
    </tr>
  `).join('');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">📄 Oferta ta Prynt.ro</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Oferta #${orderNo}</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Bună ${customerName},</p>
    
    <p style="font-size: 14px; color: #666; margin-bottom: 30px;">
      Îți mulțumim pentru interesul manifestat! Mai jos găsești detaliile ofertei tale personalizate.
    </p>
    
    <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
      <thead>
        <tr style="background: #667eea; color: white;">
          <th style="padding: 12px; text-align: left;">Produs</th>
          <th style="padding: 12px; text-align: center;">Cantitate</th>
          <th style="padding: 12px; text-align: right;">Preț/buc</th>
          <th style="padding: 12px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr style="background: #f5f5f5;">
          <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px;">TOTAL OFERTĂ:</td>
          <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #667eea;">${total.toFixed(2)} RON</td>
        </tr>
      </tbody>
    </table>
    
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #856404;">
        ⏰ <strong>Validitate:</strong> Această ofertă este valabilă 30 de zile de la data emiterii.
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${pdfLink}" style="display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        📥 Descarcă Oferta PDF
      </a>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 18px;">Ce urmează?</h3>
      <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
        <li style="margin-bottom: 10px;">Descarcă PDF-ul și verifică toate detaliile</li>
        <li style="margin-bottom: 10px;">Dacă totul este în regulă, ne poți contacta pentru a transforma oferta în comandă fermă</li>
        <li style="margin-bottom: 10px;">Pentru întrebări sau modificări, răspunde direct la acest email</li>
      </ul>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #999; font-size: 13px;">
      <p style="margin: 5px 0;">📞 <strong>Telefon:</strong> 0750.473.111</p>
      <p style="margin: 5px 0;">📧 <strong>Email:</strong> contact@prynt.ro</p>
      <p style="margin: 5px 0;">🌐 <strong>Website:</strong> <a href="https://www.prynt.ro" style="color: #667eea; text-decoration: none;">www.prynt.ro</a></p>
      <p style="margin: 20px 0 5px 0; font-size: 12px; color: #bbb;">
        Acest email a fost generat automat de asistentul AI Prynt.ro
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Oferta Prynt.ro #${orderNo}

Bună ${customerName},

Îți mulțumim pentru interesul manifestat! Mai jos găsești detaliile ofertei tale:

${items.map(item => `${item.name} - ${item.quantity} buc × ${item.price.toFixed(2)} RON = ${(item.price * item.quantity).toFixed(2)} RON`).join('\n')}

TOTAL: ${total.toFixed(2)} RON

Descarcă oferta PDF aici: ${pdfLink}

Validitate: 30 zile

Pentru întrebări sau comenzi, ne poți contacta la:
📞 0750.473.111
📧 contact@prynt.ro
🌐 www.prynt.ro

Cu stimă,
Echipa Prynt.ro
  `;

  const result = await resend.emails.send({
    from: 'Prynt.ro <contact@prynt.ro>',
    to,
    subject: `📄 Oferta ta Prynt.ro #${orderNo} (${total.toFixed(2)} RON)`,
    html: htmlContent,
    text: textContent,
  });

  return result;
}
