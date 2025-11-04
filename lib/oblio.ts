// lib/oblio.ts
// În pasul următor vom implementa call-urile reale la Oblio.
// Aici păstrăm interfețele și tipurile.
export type OblioCustomerPayload = {
  isCompany: boolean;
  fullName?: string;
  email: string;
  phone?: string;
  companyName?: string;
  cui?: string;
  regCom?: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
};

export type OblioInvoiceLine = {
  name: string;
  code?: string;
  qty: number;
  unitPrice: number;
  vatRate: number; // ex: 19
};

export async function ensureOblioCustomer(_payload: OblioCustomerPayload): Promise<{ id: string }> {
  // TODO: integrare reală
  return { id: 'oblio_cust_demo' };
}

export async function createOblioInvoice(_args: {
  customerId: string;
  currency: string;
  lines: OblioInvoiceLine[];
  series?: string; // seria facturii
  issueDate?: string; // YYYY-MM-DD
}): Promise<{ invoiceId: string; invoiceUrl?: string }> {
  // TODO: integrare reală
  return { invoiceId: 'INV-DEMO-0001', invoiceUrl: 'https://oblio.ro/invoice/INV-DEMO-0001' };
}
