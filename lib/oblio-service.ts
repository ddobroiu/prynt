/**
 * Oblio Service - Integrare API pentru Facturare Online
 * Corect: PJ = CUI, PF = CNP (FĂRĂ a cere ambele)
 */

interface OblioClient {
  type: 'person' | 'company';
  name: string;
  identifier: string; // DOAR CNP pentru PF, DOAR CUI pentru PJ
  address: string;
  city: string;
  county: string;
  email?: string;
  phone?: string;
}

interface OblioItem {
  name: string;
  quantity: number;
  unit_price: number; // fără TVA
  tax_rate?: number;
}

interface OblioInvoiceRequest {
  client: OblioClient;
  items: OblioItem[];
  payment_method: string;
  notes?: string;
}

interface OblioResponse {
  success: boolean;
  invoiceId?: string;
  invoiceNumber?: string;
  pdfUrl?: string;
  error?: string;
}

/**
 * Genereaza factura pe Oblio
 */
export async function generateOblioInvoice(
  invoiceData: OblioInvoiceRequest
): Promise<OblioResponse> {
  try {
    const clientId = process.env.OBLIO_CLIENT_ID;
    const clientSecret = process.env.OBLIO_CLIENT_SECRET;
    const cifFirma = process.env.OBLIO_CIF_FIRMA;
    const serieFactura = process.env.OBLIO_SERIE_FACTURA;

    if (!clientId || !clientSecret || !cifFirma || !serieFactura) {
      throw new Error('Credențialele Oblio nu sunt configurate în .env');
    }

    // Prepara clientul pentru Oblio
    const clientData: any = {
      cif: invoiceData.client.identifier, // CUI pentru PJ, CNP pentru PF
      name: invoiceData.client.name,
      address: invoiceData.client.address,
      city: invoiceData.client.city,
      county: invoiceData.client.county,
      country: 'RO',
    };

    if (invoiceData.client.email) {
      clientData.email = invoiceData.client.email;
    }
    if (invoiceData.client.phone) {
      clientData.phone = invoiceData.client.phone;
    }

    // Construieste requestul
    const requestBody = {
      cif: cifFirma, // CUI-ul FIRMEI tale (din env)
      serie: serieFactura, // SERIA facturii (F5)
      client: clientData,
      products: invoiceData.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.unit_price, // Pret unitar FARA TVA
        tax_name: 'VAT',
        tax_rate: item.tax_rate || 19,
      })),
      payment_method: invoiceData.payment_method || 'cash',
      notes: invoiceData.notes || '',
      issue_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    console.log('📤 Request la Oblio:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://www.oblio.eu/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': clientSecret,
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ Oblio API Error:', {
        status: response.status,
        data: responseData,
      });
      return {
        success: false,
        error: `Oblio Error: ${response.status} - ${JSON.stringify(responseData)}`,
      };
    }

    console.log('✅ Factura generată pe Oblio:', {
      invoiceId: responseData.id,
      invoiceNumber: responseData.number,
      pdfUrl: responseData.pdf_url,
    });

    return {
      success: true,
      invoiceId: responseData.id,
      invoiceNumber: responseData.number,
      pdfUrl: responseData.pdf_url,
    };
  } catch (error: any) {
    console.error('❌ Oblio Service Error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Validare CNP (Persoană Fizică)
 * Format: 13 cifre
 */
export function validateCNP(cnp: string): boolean {
  // Elimina spatii
  cnp = cnp.replace(/\s/g, '');

  // CNP valid: 13 cifre
  if (!/^\d{13}$/.test(cnp)) {
    return false;
  }

  // Validare checksum
  const weights = [2, 4, 8, 5, 10, 9, 7, 3, 6, 1, 2, 4, 8];
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnp[i]) * weights[i];
  }

  const checksum = sum % 11;
  const remainder = checksum === 10 ? 1 : checksum;

  return parseInt(cnp[12]) === remainder;
}

/**
 * Validare CUI (Persoană Juridică)
 * Format: RO + 2-10 cifre (ex: RO12345678)
 */
export function validateCUI(cui: string): boolean {
  // Elimina spatii
  cui = cui.replace(/\s/g, '').toUpperCase();

  // CUI valid: RO + 2-10 cifre
  if (!/^RO\d{2,10}$/.test(cui)) {
    return false;
  }

  // Validare checksum
  const cuiNumber = cui.substring(2);
  let sum = 0;
  const weights = [7, 5, 3, 2, 1, 7, 5, 3, 2];

  for (let i = 0; i < cuiNumber.length - 1; i++) {
    if (i < weights.length) {
      sum += parseInt(cuiNumber[i]) * weights[i];
    }
  }

  const remainder = sum % 11;
  const checksum = remainder === 10 ? 0 : remainder;

  return parseInt(cuiNumber[cuiNumber.length - 1]) === checksum;
}

/**
 * Formatează identifier-ul pentru Oblio
 */
export function formatIdentifier(type: 'pf' | 'pj', value: string): string {
  value = value.replace(/\s/g, '').toUpperCase();

  if (type === 'pj') {
    // CUI: asigura prefixul RO
    if (!value.startsWith('RO')) {
      value = 'RO' + value;
    }
  }
  // PF: CNP fara prefix

  return value;
}