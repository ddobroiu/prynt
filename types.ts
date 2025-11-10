export type Address = {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
};

export type Billing = {
  tip_factura: "persoana_fizica" | "persoana_juridica";
  // Date companie (obligatorii doar pentru persoana_juridica)
  denumire_companie?: string;
  cui?: string;          // CUI/CIF
  reg_com?: string;      // Registrul comerțului (opțional)
  // Adresă facturare (poate fi aceeași cu livrarea)
  judet?: string;
  localitate?: string;
  strada_nr?: string;
};