import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateDPDAWB } from '../../../lib/dpd-service';
import { generateOblioInvoice, validateCUI } from '../../../lib/oblio-service';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    if (!orderData.items || orderData.items.length === 0 || !orderData.email) {
      return NextResponse.json(
        { message: 'Date invalide' },
        { status: 400 }
      );
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('📋 Procesare comandă:', orderId);

    const isPF = orderData.tip_factura === 'persoana_fizica';

    if (!isPF && orderData.cui) {
      if (!validateCUI(orderData.cui)) {
        return NextResponse.json(
          { message: 'CUI invalid' },
          { status: 400 }
        );
      }
    }

    console.log(`✅ Validare: ${isPF ? 'PF' : 'PJ'}`);

    // ====== 1. GENEREAZA FACTURA PE OBLIO ======

    const oblioItems = orderData.items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      unit_price: parseFloat((item.unitAmount / 1.19).toFixed(2)),
      tax_rate: 19,
    }));

    const oblioResponse = await generateOblioInvoice({
      client: {
        type: isPF ? 'person' : 'company',
        name: isPF ? orderData.nume_livrare : orderData.nume_companie,
        identifier: orderData.cui || orderData.nume_livrare,
        address: orderData.adresa_facturare,
        city: orderData.oras_facturare,
        county: orderData.judet_facturare,
        email: orderData.email,
        phone: orderData.telefon,
      },
      items: oblioItems,
      payment_method: 'cash',
      notes: `Comandă ${orderId}`,
    });

    if (!oblioResponse.success) {
      console.error('❌ Oblio Error:', oblioResponse.error);
      return NextResponse.json(
        { message: 'Eroare la generarea facturii', error: oblioResponse.error },
        { status: 500 }
      );
    }

    console.log(`✅ Factura: ${oblioResponse.invoiceNumber}`);

    // ====== 2. GENEREAZA AWB PE DPD ======

    const totalWeight = Math.max(
      orderData.items.reduce((sum: number, item: any) => sum + (item.quantity * 0.2), 0),
      0.5
    );

    const dpdResponse = await generateDPDAWB({
      shipmentRef: orderId,
      parcels: [{
        weight: totalWeight,
        width: 40,
        height: 30,
        length: 20,
      }],
      sender: {
        name: orderData.expeditor_nume,
        phone: orderData.expeditor_telefon,
        email: orderData.expeditor_email,
        street: orderData.expeditor_adresa,
        streetNumber: '1',
        city: orderData.expeditor_oras,
        county: orderData.expeditor_judet,
        zipCode: '010001',
        country: 'RO',
      },
      recipient: {
        name: orderData.nume_livrare,
        phone: orderData.telefon,
        email: orderData.email,
        street: orderData.adresa_livrare,
        streetNumber: '1',
        city: orderData.oras_livrare,
        county: orderData.judet_livrare,
        zipCode: '000000',
        country: 'RO',
      },
      service: 'STANDARD',
      cod: Math.round(orderData.cartTotal * 100),
    });

    if (!dpdResponse.success) {
      console.error('❌ DPD Error:', dpdResponse.error);
      console.log('⚠️ AWB nu s-a generat, continuăm cu comanda...');
    }

    const awb = dpdResponse.awb || 'PENDING';
    console.log(`✅ AWB: ${awb}`);

    // ====== 3. EMAIL CLIENT ======

    const itemsHtml = orderData.items.map((item: any) => {
      const pricePerUnit = (item.unitAmount / 1.19).toFixed(2);
      return `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${pricePerUnit} RON</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${(pricePerUnit * item.quantity).toFixed(2)} RON</td>
        </tr>
      `;
    }).join('');

    const totalFaraTVA = (orderData.cartTotal / 1.19).toFixed(2);
    const TVA = (orderData.cartTotal - parseFloat(totalFaraTVA)).toFixed(2);

    const htmlContent = `
      <div style="font-family: Arial; background-color: #f3f4f6; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden;">
          
          <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">✓ Comandă Confirmată!</h1>
          </div>

          <div style="padding: 30px;">
            <p>Salut <strong>${orderData.nume_livrare}</strong>,</p>

            <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; font-weight: bold;">📋 Detalii Comandă</p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">
                <strong>ID:</strong> ${orderId}<br>
                <strong>Factura:</strong> ${oblioResponse.invoiceNumber}<br>
                ${awb !== 'PENDING' ? `<strong>AWB DPD:</strong> <span style="color: #10b981; font-weight: bold;">${awb}</span>` : '<strong>AWB:</strong> <span style="color: #f59e0b;">Se generează...</span>'}
              </p>
            </div>

            <h3 style="color: #4f46e5;">📦 Produse</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f3f4f6;">
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Produs</th>
                <th style="border: 1px solid #ddd; padding: 10px;">Buc</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Preț</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Total</th>
              </tr>
              ${itemsHtml}
            </table>

            <div style="background: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>Subtotal:</span>
                <strong>${totalFaraTVA} RON</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>TVA (19%):</span>
                <strong>${TVA} RON</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0; border-top: 1px solid #ddd; padding-top: 10px; font-size: 18px; font-weight: bold; color: #4f46e5;">
                <span>Total:</span>
                <span>${orderData.cartTotal.toFixed(2)} RON</span>
              </div>
            </div>

            <h3 style="color: #4f46e5;">🚚 Livrare</h3>
            <p>${orderData.adresa_livrare}, ${orderData.oras_livrare}, ${orderData.judet_livrare}</p>
            <p>📞 ${orderData.telefon}</p>

            ${awb !== 'PENDING' ? `
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://tracking.dpd.com.ro/?awb=${awb}" 
                   style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  🔗 Urmărește Coletul
                </a>
              </div>
            ` : ''}

            <p style="margin-top: 30px; color: #999; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Contact: support@prynt.ro | 0721234567
            </p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: orderData.email,
      subject: `✓ Comandă ${orderId} - Factura ${oblioResponse.invoiceNumber}`,
      html: htmlContent,
    });

    console.log('✅ Email trimis');

    return NextResponse.json({
      success: true,
      orderId,
      awb,
      invoiceNumber: oblioResponse.invoiceNumber,
      message: 'Comandă plasată cu succes!',
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { message: 'Eroare internă', error: error.message },
      { status: 500 }
    );
  }
}