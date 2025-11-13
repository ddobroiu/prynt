// Minimal DPD Romania Web API client (Create Shipment + Print)
// Docs: https://api.dpd.ro/api/docs/ (BASE_URL = https://api.dpd.ro/v1)

const BASE_URL = 'https://api.dpd.ro/v1';

export type DpdCredentials = {
  userName: string;
  password: string;
  language?: 'RO' | 'EN';
  clientSystemId?: number;
};

function getCreds(): DpdCredentials {
  const userName = process.env.DPD_USERNAME;
  const password = process.env.DPD_PASSWORD;
  if (!userName || !password) {
    throw new Error('DPD credentials missing (DPD_USERNAME/DPD_PASSWORD)');
  }
  return { userName, password, language: 'RO' };
}

// Types mirror a subset of DPD API structures; callers should supply valid address/service data per docs
export type ShipmentPhoneNumber = { number: string; extension?: string };
export type ShipmentAddress = {
  // For Romania: Address Type 1 or use addressNote fallback (may reduce validation strictness)
  countryId?: number; // ISO numeric (642 for RO) – optional, defaults to local country
  siteId?: number;
  siteType?: string;
  siteName?: string; // city/town name (DPD site)
  postCode?: string;
  streetId?: number;
  streetType?: string;
  streetName?: string;
  streetNo?: string;
  blockNo?: string;
  entranceNo?: string;
  floorNo?: string;
  apartmentNo?: string;
  poiId?: number;
  addressNote?: string;
  // Foreign (type 2)
  stateId?: string;
  addressLine1?: string;
  addressLine2?: string;
};

export type ShipmentSender = {
  clientId?: number;
  phone1: ShipmentPhoneNumber;
  phone2?: ShipmentPhoneNumber;
  phone3?: ShipmentPhoneNumber;
  clientName?: string;
  contactName?: string;
  email?: string;
  privatePerson?: boolean;
  address?: ShipmentAddress;
  dropoffOfficeId?: number;
  dropoffGeoPUDOId?: string;
};

export type ShipmentRecipient = {
  clientId?: number;
  phone1?: ShipmentPhoneNumber; // required for certain services/cases
  phone2?: ShipmentPhoneNumber;
  phone3?: ShipmentPhoneNumber;
  clientName?: string;
  contactName?: string;
  email?: string;
  privatePerson?: boolean;
  address?: ShipmentAddress;
  pickupOfficeId?: number;
  pickupGeoPUDOId?: string;
  autoSelectNearestOffice?: boolean;
};

export type ShipmentService = {
  pickupDate?: string; // yyyy-MM-dd
  autoAdjustPickupDate?: boolean;
  serviceId: number; // REQUIRED by API – caller must provide a valid service id
  additionalServices?: any; // COD, declaredValue, etc (see docs)
  deferredDays?: number;
  saturdayDelivery?: boolean;
};

export type ShipmentParcel = {
  seqNo: number; // 1..n
  size?: { width: number; depth: number; height: number }; // cm (needed for pallet/postal)
  weight: number; // kg
  ref1?: string;
  ref2?: string;
};

export type ShipmentContent = {
  parcelsCount?: number; // required when parcels omitted
  totalWeight?: number; // required when parcels omitted
  contents: string; // description
  package: string; // e.g. "Pachet"
  documents?: boolean;
  palletized?: boolean;
  parcels?: ShipmentParcel[]; // if provided, parcelsCount/totalWeight ignored
  pendingParcels?: boolean;
  goodsValue?: number;
  goodsValueCurrencyCode?: string;
};

export type ShipmentPayment = {
  courierServicePayer: 'SENDER' | 'RECIPIENT' | 'THIRD_PARTY';
  declaredValuePayer?: 'SENDER' | 'RECIPIENT' | 'THIRD_PARTY';
  packagePayer?: 'SENDER' | 'RECIPIENT' | 'THIRD_PARTY';
  thirdPartyClientId?: number;
  discountCardId?: { contractId: number; cardId: number };
  senderBankAccount?: { iban: string; accountHolder: string };
  administrativeFee?: boolean;
};

export type CreateShipmentRequest = {
  sender?: ShipmentSender;
  recipient: ShipmentRecipient;
  service: ShipmentService;
  content: ShipmentContent;
  payment: ShipmentPayment;
  shipmentNote?: string;
  ref1?: string;
  ref2?: string;
  consolidationRef?: string;
  requireUnsuccessfulDeliveryStickerImage?: boolean;
};

export type CreatedShipmentParcel = { seqNo: number; id: string };
export type CreateShipmentResponse = {
  id?: string;
  parcels?: CreatedShipmentParcel[];
  price?: any;
  pickupDate?: string;
  deliveryDeadline?: string;
  error?: { message: string; code: number; id?: string; context?: string };
};

async function dpdFetch(path: string, body: any, init?: RequestInit) {
  const creds = getCreds();
  const payload = { ...creds, ...body };
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    ...init,
  });
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  }
  const buf = await res.arrayBuffer();
  return { ok: res.ok, status: res.status, data: buf };
}

// Raw fetch helper for CSV endpoints (site list)
async function dpdFetchCsv(path: string, body?: any) {
  const creds = getCreds();
  const payload = { ...creds, ...(body || {}) };
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

export async function createShipment(req: CreateShipmentRequest): Promise<CreateShipmentResponse> {
  const { ok, data, status } = await dpdFetch('/shipment', req);
  if (!ok) {
    const err = typeof data === 'object' && data?.error ? data.error : { message: `HTTP ${status}` };
    return { error: err } as any;
  }
  return data as CreateShipmentResponse;
}

export type PrintRequest = {
  paperSize: 'A4' | 'A6' | 'A4_4xA6';
  parcels: { id?: string; fullBarcode?: string; externalCarrierParcelNumber?: string }[];
  format?: 'pdf' | 'zpl';
  dpi?: 'dpi203' | 'dpi300';
  additionalWaybillSenderCopy?: 'NONE' | 'ON_SAME_PAGE' | 'ON_SINGLE_PAGE';
};

export async function printExtended(req: PrintRequest): Promise<{ base64?: string; labelsInfo?: any[]; error?: any }>
{
  // Use extended print to get JSON with base64 data
  const parcels = req.parcels.map((p) => ({ id: p.id, fullBarcode: p.fullBarcode, externalCarrierParcelNumber: p.externalCarrierParcelNumber }));
  const body = {
    paperSize: req.paperSize,
    parcels: parcels.map((p) => ({ parcel: p })),
    format: req.format || 'pdf',
    dpi: req.dpi || 'dpi203',
    additionalWaybillSenderCopy: req.additionalWaybillSenderCopy || 'NONE',
  };
  const { ok, data, status } = await dpdFetch('/print/extended', body);
  if (!ok) {
    return { error: { status, data } };
  }
  if (data?.error) return { error: data.error };
  return { base64: data?.data, labelsInfo: data?.printLabelsInfo };
}

export function decodeBase64PdfToBuffer(base64?: string): Buffer | null {
  if (!base64) return null;
  return Buffer.from(base64, 'base64');
}

// Public tracking URL generator for DPD Romania
// Note: DPD RO tracking page does not document a prefilled query param.
// We return the main tracking portal and include the AWB separately in emails/UI.
export function trackingUrlForAwb(awb: string): string {
  // If in the future DPD documents a deep-link format, update this function.
  return 'https://tracking.dpd.ro/';
}

// --- Location: Sites CSV (for RO counties/localities) ---
export type DpdSiteRow = {
  id: number;
  name: string;
  municipality?: string;
  region?: string; // județ
  postCode?: string;
};

// Simple CSV parser that supports quoted fields and commas inside quotes
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let i = 0;
  const n = text.length;
  let cell = '';
  let row: string[] = [];
  let inQuotes = false;
  while (i < n) {
    const ch = text[i++];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i] === '"') { // escaped quote
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      row.push(cell);
      cell = '';
      continue;
    }
    if (ch === '\n') {
      // trim trailing \r
      if (text[i - 2] === '\r') {
        // already handled by splitting logic
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }
    cell += ch;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

export async function getAllSitesRO(): Promise<DpdSiteRow[]> {
  // Country ISO numeric for RO is 642
  const { ok, text, status } = await dpdFetchCsv('/location/site/csv/642');
  if (!ok || !text) throw new Error(`DPD site CSV failed: HTTP ${status}`);
  const rows = parseCsv(text.trim());
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim());
  const idx = (name: string) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());
  const idIdx = idx('id');
  const nameIdx = idx('name');
  const municipalityIdx = idx('municipality');
  const regionIdx = idx('region');
  const postCodeIdx = idx('postCode');
  const out: DpdSiteRow[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    const idStr = cols[idIdx] || '';
    const id = parseInt(idStr, 10);
    if (!Number.isFinite(id)) continue;
    const name = (cols[nameIdx] || '').trim();
    const municipality = (cols[municipalityIdx] || '').trim() || undefined;
    const region = (cols[regionIdx] || '').trim() || undefined;
    const postCode = (cols[postCodeIdx] || '').trim() || undefined;
    out.push({ id, name, municipality, region, postCode });
  }
  return out;
}

// Validate shipment without creating it
export async function validateShipment(req: CreateShipmentRequest): Promise<{ valid: boolean; error?: any }>{
  const { ok, data, status } = await dpdFetch('/validation/shipment', req);
  if (!ok) return { valid: false, error: { status } };
  if (typeof data?.valid === 'boolean') return { valid: data.valid, error: data.error };
  // Some responses mirror ValidationResponse
  if (data?.error) return { valid: false, error: data.error };
  return { valid: false, error: { message: 'Unknown validation response' } };
}
