// lib/dpd.ts
export type DpdShipmentPayload = {
  recipient: {
    name: string;
    phone?: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  weightGr: number;
  // opțional: plic/colet, dimensiuni etc.
};

export async function createDpdShipment(_payload: DpdShipmentPayload): Promise<{
  awb: string;
  labelUrl?: string;
  trackingUrl?: string;
}> {
  // TODO: integrare reală
  return {
    awb: 'DPD1234567890',
    labelUrl: 'https://dpd.ro/label/DPD1234567890.pdf',
    trackingUrl: 'https://tracking.dpd.ro/DPD1234567890',
  };
}
