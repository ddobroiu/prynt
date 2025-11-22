import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// --- TEMPLATE COMUN (Folosit de toate emailurile) ---
export function getHtmlTemplate({
  title,
  message,
  buttonText,
  buttonUrl,
  footerText
}: {
  title: string;
  message: string;
  buttonText: string;
  buttonUrl: string;
  footerText?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #171717; padding: 24px; text-align: center; }
    .content { padding: 32px 24px; }
    .h1 { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 16px; }
    .text { font-size: 15px; color: #555; margin-bottom: 24px; }
    .button { display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px; text-align: center; }
    .button:hover { background-color: #4338ca; }
    .footer { background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
    .link-fallback { font-size: 11px; color: #999; margin-top: 20px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
       <span style="color: white; font-weight: bold; font-size: 20px;">Prynt</span>
    </div>
    <div class="content">
      <div class="h1">${title}</div>
      <p class="text">${message}</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${buttonUrl}" class="button" target="_blank">${buttonText}</a>
      </div>
      ${footerText ? `<p class="text" style="font-size: 13px;">${footerText}</p>` : ''}
      <div class="link-fallback">
        Dacă butonul nu funcționează, copiază acest link:<br/>
        <a href="${buttonUrl}" style="color: #4f46e5;">${buttonUrl}</a>
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Prynt. Toate drepturile rezervate.<br/>
      Acest email a fost trimis automat.
    </div>
  </div>
</body>
</html>
  `;
}

// --- 1. EMAIL BUN VENIT ---
export async function sendWelcomeEmail(to: string, name: string) {
  const html = getHtmlTemplate({
    title: "Bine ai venit pe Prynt!",
    message: `Salut, ${name}! Contul tău a fost creat cu succes. Poți începe să plasezi comenzi și să gestionezi grafica direct din contul tău.`,
    buttonText: "Accesează contul",
    buttonUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    footerText: "Dacă nu ai creat acest cont, ignoră acest email."
  });

  await resend.emails.send({
    from: 'Prynt <no-reply@prynt.ro>',
    to,
    subject: 'Bine ai venit pe Prynt!',
    html,
  });
}

// --- 2. EMAIL RESETARE PAROLĂ ---
export async function sendPasswordResetEmail(to: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/login/reset?token=${token}`;
  
  const html = getHtmlTemplate({
    title: "Resetare Parolă",
    message: "Am primit o cerere de resetare a parolei pentru contul tău Prynt. Apasă pe butonul de mai jos pentru a seta o parolă nouă.",
    buttonText: "Resetează Parola",
    buttonUrl: resetLink,
    footerText: "Dacă nu ai cerut acest lucru, poți ignora acest email."
  });

  await resend.emails.send({
    from: 'Prynt <no-reply@prynt.ro>',
    to,
    subject: 'Resetare parolă Prynt',
    html,
  });
}

// --- 3. EMAIL CONFIRMARE COMANDĂ (CLIENT) ---
export async function sendOrderConfirmationEmail(order: any) {
  const orderIdShort = order.id.slice(-6).toUpperCase();
  const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}`;

  const html = getHtmlTemplate({
    title: `Comanda #${orderIdShort} a fost înregistrată!`,
    message: `Salut! Îți mulțumim pentru comandă. Am primit solicitarea ta în valoare de ${order.total} ${order.currency}. Te vom notifica imediat ce expediem produsele.`,
    buttonText: "Vezi detalii comandă",
    buttonUrl: viewUrl,
    footerText: "Mulțumim că ai ales Prynt.ro!"
  });

  await resend.emails.send({
    from: 'Prynt Comenzi <no-reply@prynt.ro>',
    to: order.userEmail,
    subject: `Confirmare Comandă #${orderIdShort}`,
    html,
  });
}

// --- 4. EMAIL NOTIFICARE ADMIN (COMANDĂ NOUĂ) ---
export async function sendNewOrderAdminEmail(order: any) {
  const orderIdShort = order.id.slice(-6).toUpperCase();
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}`;
  
  const adminEmail = process.env.ADMIN_EMAIL || 'contact@prynt.ro'; 

  const html = getHtmlTemplate({
    title: "Comandă Nouă!",
    message: `O nouă comandă (#${orderIdShort}) a fost plasată prin asistentul virtual sau site. Client: ${order.shippingAddress?.name}. Total: ${order.total} ${order.currency}.`,
    buttonText: "Gestionează în Admin",
    buttonUrl: adminUrl,
    footerText: "Notificare internă sistem."
  });

  await resend.emails.send({
    from: 'Prynt System <no-reply@prynt.ro>',
    to: adminEmail,
    subject: `[ADMIN] Comandă Nouă #${orderIdShort}`,
    html,
  });
}

// --- 5. EMAIL FORMULAR CONTACT (NOU) ---
export async function sendContactFormEmail(data: { name: string; email: string; phone?: string; message: string }) {
  const { name, email, phone, message } = data;
  
  // NOTĂ IMPORTANTĂ PENTRU RESEND:
  // 1. Dacă ai domeniul 'prynt.ro' VERIFICAT în panoul Resend (DNS records), lasă linia de mai jos așa:
  const fromEmail = 'Prynt Contact <no-reply@prynt.ro>';
  
  // 2. Dacă NU ai domeniul verificat încă (ești în Testing), TREBUIE să folosești linia de mai jos 
  // și poți trimite emailuri DOAR către adresa ta de login Resend:
  // const fromEmail = 'onboarding@resend.dev';

  // Adresa unde vrei să primești mesajele de contact
  const adminEmail = 'contact@prynt.ro';

  const html = getHtmlTemplate({
    title: "Mesaj Nou de pe Site",
    message: `Ai primit un mesaj nou de la <strong>${name}</strong> (${email}).`,
    buttonText: "Răspunde pe Email",
    buttonUrl: `mailto:${email}`,
    footerText: `Telefon client: ${phone || 'Nespecificat'}`
  });

  // Inserăm mesajul clientului în template-ul HTML pentru a fi vizibil clar
  const contentHtml = html.replace(
      '<p class="text">', 
      `<p class="text">
         <strong>Mesaj primit:</strong><br/>
         <em style="display:block; background:#f3f4f6; padding:15px; border-left: 4px solid #4f46e5; margin-top:10px; border-radius: 4px;">${message.replace(/\n/g, '<br>')}</em>
         <br/>`
  );

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email, // Când dai Reply din Gmail, se va duce către client
      subject: `[Contact] Mesaj nou de la ${name}`,
      html: contentHtml,
    });
    
    if (result.error) {
        console.error("Resend API Error:", result.error);
        throw new Error(result.error.message);
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Eroare la trimiterea emailului de contact:", error);
    throw error;
  }
}