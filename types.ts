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

/*
  Tipuri noi pentru magazin
*/
export type ProductCategory = "bannere" | "postere" | "stickere" | string;

export type Product = {
  id: string;
  slug: string; // ex: "banner-90x200"
  title: string;
  description?: string;
  price: number; // în lei (număr)
  currency?: string; // ex: "RON"
  stock: number; // cantitate în stoc
  category: ProductCategory;
  images?: string[]; // căi relative în /public (ex: /products/banner1.jpg)
  attributes?: Record<string, string>; // ex: { dimensiuni: "90x200", material: "PVC" }
  created_at?: string;
  updated_at?: string;
};