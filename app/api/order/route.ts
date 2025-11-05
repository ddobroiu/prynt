// app/api/order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configurează transportatorul Nodemailer (EXEMPLU PENTRU GMAIL)
// Te rog să folosești variabile de mediu (.env) pentru securitate!
const transporter = nodemailer.createTransport({
    service: 'gmail', // Sau 'SendGrid', 'Outlook' etc.
    auth: {
        user: process.env.EMAIL_USER || 'contul_tau_email@gmail.com', // Schimbă cu email-ul tău
        pass: process.env.EMAIL_PASS || 'parola_sau_app_password', // Schimbă cu parola ta
    },
});

export async function POST(req: NextRequest) {
    try {
        const orderData = await req.json();

        // 1. Validare minimă
        if (!orderData.items || orderData.items.length === 0 || !orderData.email) {
            return NextResponse.json({ message: 'Date de comandă invalide.' }, { status: 400 });
        }

        // 2. Generare conținut email
        const itemsHtml = orderData.items.map((item: any) => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity} buc.</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.unitAmount.toFixed(2)} RON</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.totalAmount.toFixed(2)} RON</td>
            </tr>
        `).join('');

        const htmlContent = `
            <h2 style="color: #4f46e5;">Comandă Nouă Plasată pe Prynt.ro</h2>
            <p><strong>Total Comandă:</strong> <span style="font-size: 1.2em; color: #10b981;">${orderData.cartTotal.toFixed(2)} RON</span></p>
            <p><strong>Metodă de Plată:</strong> ${orderData.paymentMethod}</p>

            <h3 style="color: #4f46e5;">Detalii Client</h3>
            <p><strong>Nume/Firmă:</strong> ${orderData.nume}</p>
            <p><strong>Email:</strong> ${orderData.email}</p>
            <p><strong>Telefon:</strong> ${orderData.telefon}</p>
            <p><strong>Adresă:</strong> ${orderData.adresa}, ${orderData.oras}, ${orderData.judet}</p>
            ${orderData.mentiuni ? `<p><strong>Mentiuni:</strong> ${orderData.mentiuni}</p>` : ''}

            <h3 style="color: #4f46e5;">Produse Comandate</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f3f4f6;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Produs</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cantitate</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Preț/Unitate</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">TOTAL:</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold; color: #10b981;">${orderData.cartTotal.toFixed(2)} RON</td>
                    </tr>
                </tfoot>
            </table>
            <p style="margin-top: 20px;">Vă rugăm să procesați comanda.</p>
        `;

        // 3. Trimitere email către administrator
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'noreply@prynt.ro',
            to: process.env.ADMIN_EMAIL || 'admin@prynt.ro', // Schimbă cu email-ul unde primești comenzile
            subject: `COMANDA NOUĂ PRYNT.RO - ${orderData.nume} - ${orderData.cartTotal.toFixed(2)} RON`,
            html: htmlContent,
        });

        // 4. Trimitere email de confirmare către client (Opțional, dar recomandat)
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'contact@prynt.ro',
            to: orderData.email,
            subject: `Confirmare Comandă Prynt.ro - ${orderData.cartTotal.toFixed(2)} RON`,
            html: `
                <p>Bună ziua, ${orderData.nume},</p>
                <p>Comanda ta a fost plasată cu succes și este în curs de procesare.</p>
                <p>Total de plată: <strong>${orderData.cartTotal.toFixed(2)} RON</strong> (Plată la Livrare).</p>
                <p>Îți mulțumim pentru încredere!</p>
                <p>Echipa Prynt.ro</p>
                ${htmlContent}
            `,
        });

        return NextResponse.json({ message: 'Comanda plasată cu succes!' }, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Eroare internă la plasarea comenzii.' }, { status: 500 });
    }
}