/**
 * DPD Service - Integrare API pentru generare AWB-uri
 * Autentificare: HTTP Basic Auth (username:password)
 */

interface DPDParcel {
  weight: number; // kg
  width: number; // cm
  height: number; // cm
  length: number; // cm
}

interface DPDShipmentRequest {
  shipmentRef: string;
  parcels: DPDParcel[];
  sender: {
    name: string;
    phone: string;
    email: string;
    street: string;
    streetNumber: string;
    city: string;
    county: string;
    zipCode: string;
    country: string;
  };
  recipient: {
    name: string;
    phone: string;
    email: string;
    street: string;
    streetNumber: string;
    city: string;
    county: string;
    zipCode: string;
    country: string;
  };
  service: string;
  cod?: number;
}

interface DPDResponse {
  success: boolean;
  shipmentId?: string;
  awb?: string;
  error?: string;
}

/**
 * Generează AWB-ul pe DPD România
 * Folosește HTTP Basic Authentication
 */
export async function generateDPDAWB(
  shipmentData: DPDShipmentRequest
): Promise<DPDResponse> {
  try {
    const username = process.env.DPD_USERNAME;
    const password = process.env.DPD_PASSWORD;

    if (!username || !password) {
      throw new Error('DPD credentiale nu sunt configurate în .env');
    }

    // Generează Basic Auth header
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    const requestPayload = {
      shipmentReference: shipmentData.shipmentRef,
      parcels: shipmentData.parcels.map(p => ({
        weight: p.weight,
        width: p.width,
        height: p.height,
        length: p.length,
      })),
      shipper: {
        contactName: shipmentData.sender.name,
        phone: shipmentData.sender.phone,
        email: shipmentData.sender.email,
        address: {
          streetName: shipmentData.sender.street,
          streetNumber: shipmentData.sender.streetNumber,
          city: shipmentData.sender.city,
          county: shipmentData.sender.county,
          postalCode: shipmentData.sender.zipCode,
          country: shipmentData.sender.country,
        },
      },
      consignee: {
        contactName: shipmentData.recipient.name,
        phone: shipmentData.recipient.phone,
        email: shipmentData.recipient.email,
        address: {
          streetName: shipmentData.recipient.street,
          streetNumber: shipmentData.recipient.streetNumber,
          city: shipmentData.recipient.city,
          county: shipmentData.recipient.county,
          postalCode: shipmentData.recipient.zipCode,
          country: shipmentData.recipient.country,
        },
      },
      service: shipmentData.service || 'STANDARD',
      cod: shipmentData.cod || 0,
    };

    console.log('📤 Request la DPD:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch('https://services.dpd.ro/api/shipments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(requestPayload),
    });

    const responseData = await response.json();

    console.log('📥 Response de la DPD:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('❌ DPD API Error:', {
        status: response.status,
        data: responseData,
      });
      return {
        success: false,
        error: `DPD Error: ${response.status} - ${JSON.stringify(responseData)}`,
      };
    }

    return {
      success: true,
      shipmentId: responseData.shipmentId || responseData.id,
      awb: responseData.awb || responseData.referenceNumber,
    };
  } catch (error: any) {
    console.error('❌ DPD Service Error:', error.message);
    return { success: false, error: error.message };
  }
}