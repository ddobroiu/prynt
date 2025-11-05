export interface Address {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
}

export interface Billing {
  tip_factura: 'persoana_fizica' | 'companie';
  cui?: string;
  name?: string;
  address?: string;
}

export interface CartItem {
  id: string; // sau number
  name: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
}

export type FormState = 'idle' | 'loading' | 'error' | 'success';