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
};

export async function createDpdShipment(_payload: DpdShipmentPayload): Promise<{
  awb: string;
  labelUrl?: string;
  trackingUrl?: string;
}> {
  return {
    awb: 'DPD1234567890',
    labelUrl: 'https://dpd.ro/label/DPD1234567890.pdf',
    trackingUrl: 'https://tracking.dpd.ro/DPD1234567890',
  };
}

/**
 * Localități DPD – STUB
 * Returnează o listă minimală acum; schimbăm cu call-ul real DPD când avem credențiale.
 * Format item: { city, county, postalCode }
 */
export async function searchLocalities(args: { query: string; country?: string }): Promise<
  Array<{ city: string; county?: string; postalCode?: string }>
> {
  const q = args.query.toLowerCase();

  // Exemplu set (poți extinde până conectăm API-ul)
  const demo = [
    { city: 'București', county: 'București', postalCode: '010011' },
    { city: 'Cluj-Napoca', county: 'Cluj', postalCode: '400000' },
    { city: 'Iași', county: 'Iași', postalCode: '700000' },
    { city: 'Timișoara', county: 'Timiș', postalCode: '300000' },
    { city: 'Brașov', county: 'Brașov', postalCode: '500000' },
    { city: 'Constanța', county: 'Constanța', postalCode: '900000' },
    { city: 'Sibiu', county: 'Sibiu', postalCode: '550000' },
    { city: 'Oradea', county: 'Bihor', postalCode: '410000' },
    { city: 'Ploiești', county: 'Prahova', postalCode: '100000' },
    { city: 'Galați', county: 'Galați', postalCode: '800000' },
  ];

  return demo.filter(
    (x) =>
      x.city.toLowerCase().includes(q) ||
      (x.county?.toLowerCase().includes(q) ?? false) ||
      (x.postalCode?.toLowerCase().includes(q) ?? false)
  );
}

/* TODO (DPD real):
   - folosește endpoint-ul de localități/zones al DPD RO
   - mapează răspunsul la { city, county, postalCode }
   - adaugă caching (ex. 1h) dacă e nevoie
*/
