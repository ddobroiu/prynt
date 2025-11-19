import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template HTML Modern pentru Bun Venit
const getWelcomeEmailHtml = (name: string) => {
  // Poți ajusta culorile și logo-ul după preferințe
  const brandColor = '#4f46e5'; // Indigo
  const grayColor = '#4b5563';
  const lightGray = '#f3f4f6';
  
  // Dacă nu ai încă variabila definită, fallback pe localhost pentru development
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const logoUrl = `${appUrl}/logo.png`;
  const loginUrl = `${appUrl}/login`;

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bine ai venit la Prynt!</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${lightGray}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
    
    <tr>
      <td align="center" style="padding: 40px 0 20px 0; background-color: #ffffff; border-bottom: 1px solid #f0f0f0;">
        <a href="${appUrl}" target="_blank">
           <img src="${logoUrl}" alt="Prynt Logo" width="120" style="display: block; border: 0; max-width: 100%; height: auto;" />
        </a>
      </td>
    </tr>

    <tr>
      <td style="padding: 40px 40px 20px 40px;">
        <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 20px 0; text-align: center;">
          Salut, ${name || 'prietene'}! 👋
        </h1>
        <p style="color: ${grayColor}; font-size: 16px; line-height: 26px; margin: 0 0 20px 0; text-align: center;">
          Contul tău a fost creat cu succes. Ne bucurăm să te avem alături de noi la <strong>Prynt</strong>.
        </p>
        <p style="color: ${grayColor}; font-size: 16px; line-height: 26px; margin: 0 0 30px 0; text-align: center;">
          Platforma noastră te ajută să configurezi rapid materialele publicitare de care ai nevoie.
        </p>
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              <a href="${loginUrl}" style="display: inline-block; padding: 14px 32px; background-color: ${brandColor}; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px; transition: background-color 0.2s;">
                Intră în cont
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="background-color: #f9fafb; padding: 30px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
          © ${new Date().getFullYear()} Prynt. Toate drepturile rezervate.
        </p>
        <div style="margin-top: 15px;">
          <a href="${appUrl}/termeni" style="color: #9ca3af; font-size: 12px; text-decoration: underline; margin: 0 10px;">Termeni</a>
          <a href="${appUrl}/confidentialitate" style="color: #9ca3af; font-size: 12px; text-decoration: underline; margin: 0 10px;">Confidențialitate</a>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    // Folosim EMAIL_FROM din .env (ex: 'Prynt <contact@prynt.ro>') 
    // sau fallback la testing domain-ul Resend dacă nu ai domeniul verificat încă
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const data = await resend.emails.send({
      from: fromEmail,
      to: to,
      subject: 'Bine ai venit în comunitatea Prynt! 🎨',
      html: getWelcomeEmailHtml(name),
    });

    console.log(`Email trimis cu ID: ${data.data?.id}`);
    return { success: true, data };
  } catch (error) {
    console.error('Eroare la trimiterea emailului prin Resend:', error);
    return { success: false, error };
  }
}