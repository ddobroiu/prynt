// lib/configurators-registry.ts
// Central registry for all configurators with detailed metadata

export type ConfiguratorMetadata = {
  id: string;
  name: string;
  slug: string;
  url: string;
  category: string;
  description: string;
  keywords: string[];
  useCases: string[];
  dimensions: {
    type: 'fixed' | 'custom' | 'preset';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    presets?: Array<{ width: number; height: number; label: string }>;
  };
  materials: Array<{
    id: string;
    name: string;
    description: string;
    priceModifier?: number;
    recommended?: boolean;
  }>;
  pricing: {
    type: 'per_sqm' | 'per_unit' | 'per_perimeter' | 'fixed';
    basePricePerSqm?: number;
    bands?: Array<{ max: number; price: number }>;
    formula?: string; // Human-readable formula explanation
  };
  options: Array<{
    id: string;
    name: string;
    type: 'select' | 'radio' | 'checkbox';
    values?: string[];
    priceImpact?: string;
  }>;
  turnaroundTime: string; // e.g., "2-4 zile lucrătoare"
  shippingNotes?: string;
  technicalSpecs?: string[];
  faq?: Array<{ q: string; a: string }>;
};

export const CONFIGURATORS_REGISTRY: ConfiguratorMetadata[] = [
  {
    id: 'banner',
    name: 'Banner PVC (Frontlit)',
    slug: 'banner',
    url: '/banner',
    category: 'outdoor',
    description: 'Bannere PVC pentru exterior și interior, printate pe Frontlit 440g sau 510g. Rezistente la intemperii, ideale pentru publicitate outdoor.',
    keywords: ['banner', 'pvc', 'frontlit', 'exterior', 'outdoor', 'publicitate', 'mesh', 'afisaj', 'vitrina'],
    useCases: [
      'Bannere publicitare pentru fațade clădiri',
      'Mesh pentru schele și construcții',
      'Afișaj evenimente și festivaluri',
      'Bannere temporare magazine',
      'Publicitate outdoor permanentă'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 50,
      maxWidth: 500,
      minHeight: 50,
      maxHeight: 500
    },
    materials: [
      {
        id: 'frontlit-440',
        name: 'Frontlit 440 g/mp',
        description: 'Material standard pentru exterior, rezistență ~6-12 luni',
        recommended: true
      },
      {
        id: 'frontlit-510',
        name: 'Frontlit 510 g/mp',
        description: 'Material premium pentru exterior, rezistență ~12-24 luni',
        priceModifier: 0.1
      },
      {
        id: 'mesh',
        name: 'Mesh (perforat)',
        description: 'Material perforat pentru zone cu vânt, reduce presiunea vântului',
        priceModifier: 0.15
      }
    ],
    pricing: {
      type: 'per_sqm',
      formula: 'Preț calculat pe suprafață totală (lățime × înălțime), cu reduceri progresive la volume mari',
      bands: [
        { max: 5, price: 18 },
        { max: 20, price: 16 },
        { max: 50, price: 14 },
        { max: 100, price: 12 },
        { max: Infinity, price: 10 }
      ]
    },
    options: [
      {
        id: 'finisaje',
        name: 'Finisaje',
        type: 'checkbox',
        values: ['Capsare', 'Tub', 'Lipire margini', 'Fara finisaje'],
        priceImpact: 'Capsare +2 RON/ml, Tub +3 RON/ml'
      },
      {
        id: 'artwork',
        name: 'Grafică',
        type: 'radio',
        values: ['Am grafica', 'Design simplu (+30 RON)', 'Design complex (+60 RON)']
      }
    ],
    turnaroundTime: '2-4 zile lucrătoare',
    shippingNotes: 'Livrat în sul pentru dimensiuni mari (>3m), pliat pentru dimensiuni mici',
    technicalSpecs: [
      'Rezoluție print: 1440 DPI',
      'Culori: CMYK full color',
      'Fișiere acceptate: PDF, AI, PSD, JPG (min 150 DPI)',
      'Profil culoare: ISO Coated v2 (ECI)'
    ],
    faq: [
      { q: 'Cât rezistă un banner la exterior?', a: 'Frontlit 440g: 6-12 luni, Frontlit 510g: 12-24 luni (depinde de expunere UV)' },
      { q: 'Pot comanda banner cu găuri pentru vânt?', a: 'Da, folosește varianta Mesh care este perforată special pentru zone ventilate' },
      { q: 'Ce finisaje recomandați?', a: 'Pentru montaj pe cadru: capsare. Pentru stâlpi: tub metalic. Pentru lipire: margini lipite.' }
    ]
  },
  {
    id: 'banner-verso',
    name: 'Banner Blockout (Față-Verso)',
    slug: 'banner-verso',
    url: '/banner-verso',
    category: 'outdoor',
    description: 'Banner blockout pentru print pe ambele fețe, cu strat opac intermediar. Ideal pentru afișaj suspendat sau vizibil din ambele părți.',
    keywords: ['banner verso', 'blockout', 'doua fete', 'suspendat', 'print ambele parti', 'double sided'],
    useCases: [
      'Bannere suspendate în centre comerciale',
      'Afișaj stradal vizibil din ambele sensuri',
      'Separatoare evenimente',
      'Publicitate exterior cu vizibilitate 360°'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 50,
      maxWidth: 500,
      minHeight: 50,
      maxHeight: 500
    },
    materials: [
      {
        id: 'blockout-510',
        name: 'Blockout 510 g/mp',
        description: 'Material opac cu print față-verso, nu lasă lumina să treacă',
        recommended: true
      }
    ],
    pricing: {
      type: 'per_sqm',
      formula: 'Preț ~1.5x față de banner simplu (se printează ambele fețe)',
      bands: [
        { max: 5, price: 27 },
        { max: 20, price: 24 },
        { max: 50, price: 21 },
        { max: 100, price: 18 },
        { max: Infinity, price: 15 }
      ]
    },
    options: [
      {
        id: 'finisaje',
        name: 'Finisaje',
        type: 'checkbox',
        values: ['Capsare', 'Tub', 'Lipire margini'],
        priceImpact: 'Similar cu banner simplu'
      }
    ],
    turnaroundTime: '3-5 zile lucrătoare',
    technicalSpecs: [
      'Necesită 2 grafici separate (față + verso)',
      'Graficile trebuie să fie oglindite dacă designul continuă'
    ]
  },
  {
    id: 'afise',
    name: 'Afișe Hârtie',
    slug: 'afise',
    url: '/afise',
    category: 'indoor',
    description: 'Afișe tipărite pe hârtie de calitate (Blueback, Whiteback, Satin, Foto) în formate standard sau personalizate. Ideale pentru interior.',
    keywords: ['afise', 'poster', 'hartie', 'a3', 'a2', 'a1', 'a0', 'indoor', 'print', 'blueback', 'whiteback'],
    useCases: [
      'Afișe promoționale magazine',
      'Postere evenimente',
      'Afișe decorative',
      'Materiale info puncte vânzare',
      'Campanii publicitare indoor'
    ],
    dimensions: {
      type: 'preset',
      presets: [
        { width: 29.7, height: 42, label: 'A3' },
        { width: 42, height: 59.4, label: 'A2' },
        { width: 59.4, height: 84.1, label: 'A1' },
        { width: 84.1, height: 118.9, label: 'A0' },
        { width: 70, height: 100, label: 'S5 (70×100cm)' },
        { width: 100, height: 140, label: 'S7 (100×140cm)' }
      ]
    },
    materials: [
      {
        id: 'blueback-115',
        name: 'Blueback 115g',
        description: 'Hârtie opacă cu spate albastru, anti-transparență',
        recommended: true
      },
      {
        id: 'whiteback-150',
        name: 'Whiteback 150g',
        description: 'Hârtie albă pe ambele părți, greutate medie',
        priceModifier: 0.1
      },
      {
        id: 'satin-170',
        name: 'Satin 170g',
        description: 'Hârtie satinată elegantă, finisaj semi-mat',
        priceModifier: 0.15
      },
      {
        id: 'foto-220',
        name: 'Foto 220g',
        description: 'Hârtie foto premium, culori vibrante',
        priceModifier: 0.25
      }
    ],
    pricing: {
      type: 'per_unit',
      formula: 'Preț per bucată, scade cu cantitatea. Variază după format și material.',
      bands: [
        { max: 50, price: 7.5 },
        { max: 100, price: 5.0 },
        { max: 200, price: 4.0 },
        { max: 500, price: 3.0 },
        { max: Infinity, price: 2.5 }
      ]
    },
    options: [],
    turnaroundTime: '1-3 zile lucrătoare',
    shippingNotes: 'Livrat în tub pentru protecție (formate mari)',
    technicalSpecs: [
      'Rezoluție: 1440 DPI',
      'Fișiere: PDF, AI, JPG (min 300 DPI pentru A3-A2, 150 DPI pentru A1-A0)'
    ]
  },
  {
    id: 'autocolante',
    name: 'Autocolante Vinyl (Oracal)',
    slug: 'autocolante',
    url: '/autocolante',
    category: 'vinyl',
    description: 'Autocolante vinyl pentru interior și exterior, pe materiale Oracal profesionale. Print+Cut sau Print Only, cu sau fără laminare.',
    keywords: ['autocolante', 'stickere', 'vinyl', 'oracal', 'personalizate', 'exterior', 'interior', 'decor'],
    useCases: [
      'Autocolante vitrină magazin',
      'Stickere mașini (car wrapping parțial)',
      'Autocolante decorative pereți',
      'Label-uri personalizate',
      'Autocolante produse',
      'Stickere casete luminoase'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 10,
      maxWidth: 137,
      minHeight: 10,
      maxHeight: 5000
    },
    materials: [
      {
        id: 'oracal-641',
        name: 'Oracal 641 (Economic)',
        description: 'Folie PVC economică, interior/exterior, 3-4 ani',
        recommended: true
      },
      {
        id: 'oracal-651',
        name: 'Oracal 651 (Premium)',
        description: 'Folie pentru casete luminoase, rezistență UV 5-7 ani',
        priceModifier: 0.15
      },
      {
        id: 'oracal-970',
        name: 'Oracal 970 (Car Wrapping)',
        description: 'Folie premium pentru wrapping mașini, 7-10 ani',
        priceModifier: 0.8
      },
      {
        id: 'oracal-638m',
        name: 'Oracal 638M (Wall Decor)',
        description: 'Folie decorativă pentru pereți interiori, adeziv removabil',
        priceModifier: 0.3
      }
    ],
    pricing: {
      type: 'per_sqm',
      formula: 'Preț per mp, benzi diferite pentru fiecare material Oracal',
      bands: [
        { max: 1, price: 120 },
        { max: 5, price: 90 },
        { max: 20, price: 80 },
        { max: Infinity, price: 70 }
      ]
    },
    options: [
      {
        id: 'type',
        name: 'Tip procesare',
        type: 'radio',
        values: ['Print+Cut (contur)', 'Print Only (dreptunghi)'],
        priceImpact: 'Print Only: -20% reducere'
      },
      {
        id: 'lamination',
        name: 'Laminare',
        type: 'checkbox',
        values: ['Fără laminare', 'Cu laminare (+10%)'],
        priceImpact: 'Laminarea protejează printul și crește durabilitatea cu 30-50%'
      }
    ],
    turnaroundTime: '2-4 zile lucrătoare',
    technicalSpecs: [
      'Print+Cut permite forme personalizate (AI cu contur vectorial)',
      'Laminarea se recomandă pentru exterior și zone cu trafic intens'
    ],
    faq: [
      { q: 'Ce diferență e între Print+Cut și Print Only?', a: 'Print+Cut = contur personalizat tăiat la plotter. Print Only = printul este tăiat dreptunghiular, mai ieftin cu 20%.' },
      { q: 'Când recomandați laminarea?', a: 'Obligatoriu pentru exterior și autocolante supuse frecării (vitrine, podele). Crește durabilitatea cu 50%.' }
    ]
  },
  {
    id: 'canvas',
    name: 'Canvas pe Pânză (Tablouri)',
    slug: 'canvas',
    url: '/canvas',
    category: 'decor',
    description: 'Tablouri canvas printate pe pânză textilă, întinse pe șasiu de lemn. Cu sau fără ramă, margine oglindită automată.',
    keywords: ['canvas', 'tablou', 'panza', 'decoratiune', 'personalizat', 'fotografie', 'art', 'rama'],
    useCases: [
      'Tablouri decorative casă',
      'Canvas cu fotografii personale',
      'Artă reproducere',
      'Decorațiuni birouri',
      'Cadouri personalizate'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 20,
      maxWidth: 300,
      minHeight: 20,
      maxHeight: 200
    },
    materials: [
      {
        id: 'canvas-polyester',
        name: 'Pânză Polyester 360g',
        description: 'Pânză textilă de calitate, print foto rezistent',
        recommended: true
      }
    ],
    pricing: {
      type: 'per_sqm',
      formula: 'Preț per mp + cost șasiu lemn (20 RON/ml perimetru). Reducere 20% aplicată automat.',
      bands: [
        { max: 1, price: 180 },
        { max: 3, price: 160 },
        { max: 5, price: 140 },
        { max: Infinity, price: 120 }
      ]
    },
    options: [
      {
        id: 'frame',
        name: 'Tip ramă',
        type: 'radio',
        values: ['Fără ramă (doar șasiu)', 'Cu ramă lemn natural', 'Cu ramă albă', 'Cu ramă neagră'],
        priceImpact: 'Rama adaugă 40-80 RON în funcție de dimensiune'
      },
      {
        id: 'design',
        name: 'Design',
        type: 'radio',
        values: ['Am fotografie', 'Design Pro colaj/editare (+40 RON)']
      }
    ],
    turnaroundTime: '3-5 zile lucrătoare',
    shippingNotes: 'Livrat cu protecție specială, pregătit pentru montaj imediat',
    technicalSpecs: [
      'Margine oglindită AUTOMATĂ (imaginea continuă pe laterale)',
      'Șasiu lemn inclus (înălțime 2cm)',
      'Fișiere recomandate: JPG/PNG min 150 DPI la dimensiunea finală'
    ],
    faq: [
      { q: 'Ce înseamnă margine oglindită?', a: 'Imaginea se extinde automat pe lateralele șasiului (2cm), creând un efect 3D fără chenare albe.' },
      { q: 'Pot comanda mai multe canvas formând un set?', a: 'Da, specifică în observații că vrei set triptic/poliptic și vom alinia imaginile.' }
    ]
  },
  {
    id: 'tapet',
    name: 'Tapet Personalizat (Fototapet)',
    slug: 'tapet',
    url: '/tapet',
    category: 'decor',
    description: 'Fototapet personalizat printabil pe material adeziv sau non-adeziv. Dimensiuni custom pentru pereți întregi.',
    keywords: ['tapet', 'fototapet', 'personalizat', 'perete', 'decor', 'adeziv', 'indoor'],
    useCases: [
      'Fototapet living/dormitor',
      'Decor pereți birouri',
      'Tapet personalizat evenimente',
      'Backdrop foto studio'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 50,
      maxWidth: 500,
      minHeight: 50,
      maxHeight: 300
    },
    materials: [
      {
        id: 'tapet-mat',
        name: 'Tapet Mat (non-adeziv)',
        description: 'Material mat fără adeziv, necesită clei separat',
        recommended: false
      },
      {
        id: 'tapet-adeziv',
        name: 'Tapet Adeziv (+10%)',
        description: 'Cu adeziv integrat repositionabil',
        recommended: true,
        priceModifier: 0.1
      }
    ],
    pricing: {
      type: 'per_sqm',
      bands: [
        { max: 1, price: 150 },
        { max: 5, price: 140 },
        { max: 20, price: 130 },
        { max: Infinity, price: 120 }
      ]
    },
    options: [
      {
        id: 'design',
        name: 'Design',
        type: 'radio',
        values: ['Am grafică', 'Design Pro (+200 RON)']
      }
    ],
    turnaroundTime: '3-5 zile lucrătoare',
    technicalSpecs: [
      'Livrare în sul, cu instrucțiuni aplicare',
      'Pentru pereți întregi se recomandă măsurători exacte'
    ]
  },
  {
    id: 'rollup',
    name: 'Roll-Up Banner (Retractabil)',
    slug: 'rollup',
    url: '/rollup',
    category: 'events',
    description: 'Sistem banner retractabil portabil cu casetă aluminiu și print pe Blueback 440g. Include geantă transport.',
    keywords: ['rollup', 'roll up', 'retractabil', 'banner portabil', 'stand', 'expozitie', 'targuri'],
    useCases: [
      'Standuri expoziții/târguri',
      'Prezentări evenimente',
      'Publicitate mobilă magazine',
      'Conferințe/seminarii',
      'Puncte info temporare'
    ],
    dimensions: {
      type: 'preset',
      presets: [
        { width: 85, height: 200, label: '85×200cm (Standard)' },
        { width: 100, height: 200, label: '100×200cm' },
        { width: 120, height: 200, label: '120×200cm' },
        { width: 150, height: 200, label: '150×200cm (Premium)' }
      ]
    },
    materials: [
      {
        id: 'blueback-440',
        name: 'Blueback 440g',
        description: 'Hârtie opacă premium pentru roll-up, include în preț',
        recommended: true
      }
    ],
    pricing: {
      type: 'per_unit',
      formula: 'Preț include: casetă aluminiu retractabilă + print Blueback 440g + geantă transport',
      bands: [
        { max: 5, price: 220 },
        { max: 10, price: 200 },
        { max: 20, price: 185 },
        { max: Infinity, price: 175 }
      ]
    },
    options: [],
    turnaroundTime: '3-5 zile lucrătoare',
    shippingNotes: 'Livrat în geantă de transport, gata de utilizare',
    technicalSpecs: [
      'Casetă aluminiu premium cu mecanism smooth',
      'Înălțime reglabilă',
      'Greutate ~3-4 kg (transportabil ușor)',
      'Durabilitate: 100+ utilizări'
    ],
    faq: [
      { q: 'Pot înlocui printul mai târziu?', a: 'Da, casetă rămâne reutilizabilă. Poți comanda doar reprint la nevoie.' },
      { q: 'Se poate folosi outdoor?', a: 'Doar indoor sau outdoor temporar (nu rezistă la ploaie/vânt).' }
    ]
  },
  {
    id: 'window-graphics',
    name: 'Window Graphics (Folie Perforată)',
    slug: 'window-graphics',
    url: '/window-graphics',
    category: 'vinyl',
    description: 'Folie perforată PVC 140μ pentru geamuri (one-way vision). 50% printabil, 50% perforații - vizibilitate unidirecțională.',
    keywords: ['window graphics', 'folie perforata', 'geam', 'vitrina', 'one way', 'mesh geam'],
    useCases: [
      'Autocolante geamuri magazine',
      'Publicitate ferestre birouri',
      'Vitrină personalizată',
      'Autocolante geamuri mașini (rear window)',
      'Privacy geamuri cu branding'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 30,
      maxWidth: 137,
      minHeight: 30,
      maxHeight: 5000
    },
    materials: [
      {
        id: 'pvc-140-perforated',
        name: 'PVC 140μ Perforat (50/50)',
        description: '50% print color, 50% perforații negre - vezi din interior, opac din exterior',
        recommended: true
      }
    ],
    pricing: {
      type: 'per_sqm',
      bands: [
        { max: 1, price: 250 },
        { max: 5, price: 200 },
        { max: 20, price: 170 },
        { max: Infinity, price: 150 }
      ]
    },
    options: [],
    turnaroundTime: '2-4 zile lucrătoare',
    technicalSpecs: [
      'Aplicare ușoară cu soluție apă+săpun',
      'Perforațiile permit vizibilitate din interior',
      'Opac complet din exterior'
    ],
    faq: [
      { q: 'Se vede prin folie din interior?', a: 'Da, perforațiile permit 40-50% vizibilitate din interior spre exterior.' },
      { q: 'Funcționează noaptea?', a: 'Efect one-way funcționează doar când interiorul e mai întunecos (ziua). Noaptea cu lumină înăuntru, se vede din exterior.' }
    ]
  },
  {
    id: 'pliante',
    name: 'Pliante (Broșuri)',
    slug: 'pliante',
    url: '/pliante',
    category: 'print',
    description: 'Pliante broșuri pe hârtie 115g-250g, pliuri simple sau duble. Reducere 30% aplicată automat.',
    keywords: ['pliante', 'brosuri', 'flyer pliabil', 'a4', 'a5', 'a6', 'pliuri'],
    useCases: [
      'Materiale prezentare servicii',
      'Meniuri restaurante',
      'Brosuri informative',
      'Prezentări produse',
      'Materiale marketing evenimente'
    ],
    dimensions: {
      type: 'preset',
      presets: [
        { width: 21, height: 29.7, label: 'A4' },
        { width: 14.8, height: 21, label: 'A5' },
        { width: 10.5, height: 14.8, label: 'A6' }
      ]
    },
    materials: [
      {
        id: 'couche-115',
        name: 'Couché 115g',
        description: 'Hârtie standard economică',
        recommended: true
      },
      {
        id: 'couche-170',
        name: 'Couché 170g',
        description: 'Hârtie premium, mai rigidă',
        priceModifier: 0.2
      },
      {
        id: 'couche-250',
        name: 'Couché 250g',
        description: 'Hârtie carton, rezistență maximă',
        priceModifier: 0.4
      }
    ],
    pricing: {
      type: 'per_unit',
      formula: 'Reducere 30% APLICATĂ. Preț per bucată, scade cu cantitatea.',
      bands: [
        { max: 499, price: 0.966 },
        { max: 999, price: 0.616 },
        { max: 4999, price: 0.336 },
        { max: 9999, price: 0.28 },
        { max: Infinity, price: 0.245 }
      ]
    },
    options: [
      {
        id: 'folds',
        name: 'Tip pliuri',
        type: 'radio',
        values: ['Fără pliu', '1 pliu (jumătate)', '2 pliuri (Z sau C)'],
        priceImpact: 'Pliul este inclus în preț'
      }
    ],
    turnaroundTime: '2-4 zile lucrătoare'
  },
  {
    id: 'flayere',
    name: 'Flayere (Fluturași)',
    slug: 'flayere',
    url: '/flayere',
    category: 'print',
    description: 'Flayere A6, A5, DL pe hârtie 135g sau carton 250g. Față sau față-verso. Reducere 25% aplicată.',
    keywords: ['flyer', 'fluturasi', 'a6', 'a5', 'dl', 'ulotka', 'promotie'],
    useCases: [
      'Distribuție stradală promoții',
      'Flyers evenimente',
      'Materiale info rapide',
      'Cupoane reducere',
      'Invite-uri'
    ],
    dimensions: {
      type: 'preset',
      presets: [
        { width: 10.5, height: 14.8, label: 'A6' },
        { width: 14.8, height: 21, label: 'A5' },
        { width: 21, height: 10, label: 'DL (21×10cm)' }
      ]
    },
    materials: [
      {
        id: 'couche-135',
        name: 'Couché 135g',
        description: 'Standard economică pentru volume mari',
        recommended: true
      },
      {
        id: 'carton-250',
        name: 'Carton 250g',
        description: 'Carton rigid premium (+20%)',
        priceModifier: 0.2
      }
    ],
    pricing: {
      type: 'per_unit',
      formula: 'Reducere 25% APLICATĂ. Cantități mari = preț foarte mic.',
      bands: [
        { max: 99, price: 0.495 },
        { max: 249, price: 0.368 },
        { max: 499, price: 0.293 },
        { max: 999, price: 0.245 },
        { max: 4999, price: 0.218 },
        { max: Infinity, price: 0.195 }
      ]
    },
    options: [
      {
        id: 'sides',
        name: 'Față/Verso',
        type: 'radio',
        values: ['Față (simplu)', 'Față-Verso (+30%)']
      }
    ],
    turnaroundTime: '1-3 zile lucrătoare'
  },
  {
    id: 'fonduri-eu',
    name: 'Panouri Fonduri Europene',
    slug: 'fonduri-eu',
    url: '/fonduri-eu',
    category: 'institutional',
    description: 'Panouri informative conform legislație fonduri UE (PNRR, Regio, POCU). Dimensiuni și layout conform ghidurilor oficiale.',
    keywords: ['fonduri europene', 'pnrr', 'feadr', 'pocu', 'regio', 'panou informativ', 'ue'],
    useCases: [
      'Panouri proiecte PNRR',
      'Afișaj fonduri structurale',
      'Informare beneficiari',
      'Conformitate legislație UE'
    ],
    dimensions: {
      type: 'preset',
      presets: [
        { width: 100, height: 70, label: '100×70cm (Mic)' },
        { width: 150, height: 100, label: '150×100cm (Mediu)' },
        { width: 200, height: 150, label: '200×150cm (Mare)' },
        { width: 300, height: 200, label: '300×200cm (Foarte Mare)' }
      ]
    },
    materials: [
      {
        id: 'alucobond-3mm',
        name: 'Alucobond 3mm',
        description: 'Material rigid premium pentru exterior, legislație UE cere materiale durabile',
        recommended: true
      },
      {
        id: 'pvc-5mm',
        name: 'PVC Forex 5mm',
        description: 'Alternativă mai economică (verifică dacă e acceptat în ghid)',
        priceModifier: -0.3
      }
    ],
    pricing: {
      type: 'per_sqm',
      formula: 'Preț material rigid + print UV + elemente obligatorii (logo UE, flag România)',
      bands: [
        { max: 5, price: 450 },
        { max: 10, price: 400 },
        { max: Infinity, price: 350 }
      ]
    },
    options: [
      {
        id: 'program',
        name: 'Program',
        type: 'select',
        values: ['PNRR', 'FEADR', 'POCU', 'Regio', 'Altul'],
        priceImpact: 'Template prestabilit conform legislație'
      }
    ],
    turnaroundTime: '5-7 zile lucrătoare',
    technicalSpecs: [
      'Include logo UE, flag România, informații beneficiar',
      'Layout conform ghid vizual oficial',
      'Garanție conformitate legislație'
    ],
    faq: [
      { q: 'Trimiteți macheta spre aprobare înainte?', a: 'Da, trimitem macheta PDF conform ghidului vizual pentru aprobare înainte de producție.' }
    ]
  },
  {
    id: 'plexiglass',
    name: 'Plexiglas (Metacrilat)',
    slug: 'plexiglass',
    url: '/materiale/plexiglass',
    category: 'rigid',
    description: 'Plexiglas transparent sau alb, grosimi 2-10mm. Print UV direct sau aplicare vinyl. Dimensiuni max 400×200cm.',
    keywords: ['plexiglas', 'plexiglass', 'metacrilat', 'transparent', 'rigid', 'premium'],
    useCases: [
      'Plăci firmă luminoasă',
      'Totem interior premium',
      'Display produse',
      'Separatoare elegante',
      'Panouri decorative'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 10,
      maxWidth: 400,
      minHeight: 10,
      maxHeight: 200
    },
    materials: [
      {
        id: 'plexi-transparent',
        name: 'Transparent (față)',
        description: 'Transparent, print UV pe față (vizibil prin material)',
        recommended: true
      },
      {
        id: 'plexi-alb',
        name: 'Alb opac',
        description: 'Opac alb, ideal pentru iluminare din spate',
        priceModifier: -0.2
      }
    ],
    pricing: {
      type: 'per_sqm',
      formula: 'Preț variază după grosime. Transparent mai scump decât alb.',
      bands: [
        { max: 1, price: 280 },
        { max: 5, price: 250 },
        { max: Infinity, price: 220 }
      ]
    },
    options: [
      {
        id: 'thickness',
        name: 'Grosime',
        type: 'select',
        values: ['2mm', '3mm', '4mm', '5mm', '6mm', '8mm', '10mm'],
        priceImpact: '2mm: bază | 10mm: +400% (vezi tabel prețuri)'
      },
      {
        id: 'print',
        name: 'Print',
        type: 'radio',
        values: ['Print UV direct', 'Aplicare vinyl'],
        priceImpact: 'UV direct mai durabil, vinyl mai economic'
      }
    ],
    turnaroundTime: '5-7 zile lucrătoare',
    shippingNotes: 'Livrat cu folie protecție, fragil - manipulare atentă'
  },
  {
    id: 'pvc-forex',
    name: 'PVC Forex (Expandat)',
    slug: 'pvc-forex',
    url: '/materiale/pvc-forex',
    category: 'rigid',
    description: 'PVC expandat alb, ușor și rigid. Grosimi 3-10mm, ideal indoor/outdoor temporar.',
    keywords: ['pvc forex', 'expandat', 'spuma pvc', 'rigid', 'usor'],
    useCases: [
      'Plăci firmă outdoor',
      'Indicatoare direcționale',
      'Standuri expoziție',
      'Panouri info',
      'Litere volumetrice'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 10,
      maxWidth: 305,
      minHeight: 10,
      maxHeight: 205
    },
    materials: [
      {
        id: 'forex-alb',
        name: 'PVC Forex Alb',
        description: 'Material standard, suprafață mată albă',
        recommended: true
      }
    ],
    pricing: {
      type: 'per_sqm',
      bands: [
        { max: 5, price: 120 },
        { max: 20, price: 100 },
        { max: Infinity, price: 85 }
      ]
    },
    options: [
      {
        id: 'thickness',
        name: 'Grosime',
        type: 'select',
        values: ['3mm', '5mm', '10mm'],
        priceImpact: '3mm: standard | 10mm: +30%'
      }
    ],
    turnaroundTime: '3-5 zile lucrătoare'
  },
  {
    id: 'alucobond',
    name: 'Alucobond (Dibond)',
    slug: 'alucobond',
    url: '/materiale/alucobond',
    category: 'rigid',
    description: 'Panou compozit aluminiu, premium pentru exterior. Grosimi 3-4mm, rezistență maximă la intemperii.',
    keywords: ['alucobond', 'dibond', 'compozit', 'aluminiu', 'exterior', 'premium'],
    useCases: [
      'Plăci firmă premium exterior',
      'Fațade clădiri',
      'Totemuri outdoor permanente',
      'Panouri publicitare durabile',
      'Branding premium'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 10,
      maxWidth: 205,
      minHeight: 10,
      maxHeight: 305
    },
    materials: [
      {
        id: 'alucobond-3mm',
        name: 'Alucobond 3mm',
        description: 'Standard pentru plăci firmă',
        recommended: true
      },
      {
        id: 'alucobond-4mm',
        name: 'Alucobond 4mm',
        description: 'Extra rigid pentru dimensiuni mari',
        priceModifier: 0.15
      }
    ],
    pricing: {
      type: 'per_sqm',
      bands: [
        { max: 1, price: 450 },
        { max: 5, price: 400 },
        { max: Infinity, price: 350 }
      ]
    },
    options: [],
    turnaroundTime: '5-7 zile lucrătoare',
    technicalSpecs: [
      'Rezistență UV extremă (10+ ani)',
      'Impermeabil 100%',
      'Poate fi frezat pentru litere volumetrice'
    ]
  },
  {
    id: 'carton',
    name: 'Carton Plume (Foam Board)',
    slug: 'carton',
    url: '/materiale/carton',
    category: 'rigid',
    description: 'Carton plume ușor, 5mm grosime. Ideal pentru indoor temporar, expoziții, presentații.',
    keywords: ['carton plume', 'foam board', 'usor', 'indoor', 'expozitie'],
    useCases: [
      'Panouri expoziție temporară',
      'Prezentări corporative',
      'Machete arhitectură',
      'Standuri info evenimente',
      'Decorațiuni indoor'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 10,
      maxWidth: 100,
      minHeight: 10,
      maxHeight: 140
    },
    materials: [
      {
        id: 'carton-plume-5mm',
        name: 'Carton Plume 5mm',
        description: 'Spumă polistiren între 2 cartonașe',
        recommended: true
      }
    ],
    pricing: {
      type: 'per_sqm',
      bands: [
        { max: 5, price: 65 },
        { max: 20, price: 55 },
        { max: Infinity, price: 45 }
      ]
    },
    options: [],
    turnaroundTime: '2-4 zile lucrătoare',
    shippingNotes: 'Fragil - doar pentru indoor, evită umiditate'
  },
  {
    id: 'polipropilena',
    name: 'Polipropilenă (PP Corrugated)',
    slug: 'polipropilena',
    url: '/materiale/polipropilena',
    category: 'rigid',
    description: 'Polipropilenă alveolară 4mm, impermeabilă și ușoară. Ideal outdoor temporar și indoor.',
    keywords: ['polipropilena', 'pp', 'corrugated', 'canalit', 'usor', 'impermeabil'],
    useCases: [
      'Panouri outdoor temporare (vânzări, închirieri)',
      'Indicatoare șantier',
      'Afișaj electoral',
      'Panouri info evenimente',
      'Display-uri reutilizabile'
    ],
    dimensions: {
      type: 'custom',
      minWidth: 10,
      maxWidth: 100,
      minHeight: 10,
      maxHeight: 200
    },
    materials: [
      {
        id: 'pp-4mm-alb',
        name: 'PP Alveolar 4mm Alb',
        description: 'Impermeabil, rezistent la șocuri, ușor',
        recommended: true
      }
    ],
    pricing: {
      type: 'per_sqm',
      bands: [
        { max: 5, price: 90 },
        { max: 20, price: 75 },
        { max: Infinity, price: 65 }
      ]
    },
    options: [],
    turnaroundTime: '3-5 zile lucrătoare',
    technicalSpecs: [
      'Impermeabil 100%',
      'Rezistent la temperaturi -20°C / +80°C',
      'Reutilizabil, ușor de tăiat'
    ]
  }
];

// Helper function to find configurator by various criteria
export function findConfigurator(criteria: {
  id?: string;
  slug?: string;
  keyword?: string;
  category?: string;
}): ConfiguratorMetadata | undefined {
  return CONFIGURATORS_REGISTRY.find(c => {
    if (criteria.id && c.id === criteria.id) return true;
    if (criteria.slug && c.slug === criteria.slug) return true;
    if (criteria.keyword && c.keywords.some(k => k.includes(criteria.keyword!.toLowerCase()))) return true;
    if (criteria.category && c.category === criteria.category) return true;
    return false;
  });
}

// Get all configurators by category
export function getConfiguratorsByCategory(category: string): ConfiguratorMetadata[] {
  return CONFIGURATORS_REGISTRY.filter(c => c.category === category);
}

// Generate comprehensive text description for embeddings
export function generateConfiguratorDescription(config: ConfiguratorMetadata): string {
  let desc = `# ${config.name}\n\n`;
  desc += `**Categoria**: ${config.category}\n`;
  desc += `**URL**: ${config.url}\n\n`;
  desc += `## Descriere\n${config.description}\n\n`;
  
  desc += `## Cazuri de utilizare\n`;
  config.useCases.forEach(uc => desc += `- ${uc}\n`);
  desc += `\n`;
  
  desc += `## Cuvinte cheie\n${config.keywords.join(', ')}\n\n`;
  
  desc += `## Dimensiuni\n`;
  if (config.dimensions.type === 'custom') {
    desc += `Dimensiuni personalizate: ${config.dimensions.minWidth}-${config.dimensions.maxWidth}cm × ${config.dimensions.minHeight}-${config.dimensions.maxHeight}cm\n`;
  } else if (config.dimensions.type === 'preset') {
    desc += `Dimensiuni prestabilite:\n`;
    config.dimensions.presets?.forEach(p => desc += `- ${p.label}: ${p.width}×${p.height}cm\n`);
  }
  desc += `\n`;
  
  desc += `## Materiale disponibile\n`;
  config.materials.forEach(m => {
    desc += `- **${m.name}**: ${m.description}`;
    if (m.recommended) desc += ` ✓ RECOMANDAT`;
    if (m.priceModifier) desc += ` (${m.priceModifier > 0 ? '+' : ''}${(m.priceModifier * 100).toFixed(0)}%)`;
    desc += `\n`;
  });
  desc += `\n`;
  
  desc += `## Pricing\n`;
  desc += `Tip: ${config.pricing.type}\n`;
  if (config.pricing.formula) desc += `Formula: ${config.pricing.formula}\n`;
  if (config.pricing.bands) {
    desc += `Benzi de preț:\n`;
    let prevMax = 0;
    config.pricing.bands.forEach(band => {
      const range = band.max === Infinity ? `> ${prevMax}` : `${prevMax}-${band.max}`;
      desc += `- ${range}: ${band.price} RON\n`;
      prevMax = band.max;
    });
  }
  desc += `\n`;
  
  if (config.options.length > 0) {
    desc += `## Opțiuni configurare\n`;
    config.options.forEach(opt => {
      desc += `**${opt.name}** (${opt.type}):\n`;
      if (opt.values) desc += `Valori: ${opt.values.join(', ')}\n`;
      if (opt.priceImpact) desc += `Impact preț: ${opt.priceImpact}\n`;
    });
    desc += `\n`;
  }
  
  desc += `## Timp producție\n${config.turnaroundTime}\n\n`;
  
  if (config.shippingNotes) {
    desc += `## Livrare\n${config.shippingNotes}\n\n`;
  }
  
  if (config.technicalSpecs && config.technicalSpecs.length > 0) {
    desc += `## Specificații tehnice\n`;
    config.technicalSpecs.forEach(spec => desc += `- ${spec}\n`);
    desc += `\n`;
  }
  
  if (config.faq && config.faq.length > 0) {
    desc += `## Întrebări frecvente\n`;
    config.faq.forEach(faq => desc += `**Î**: ${faq.q}\n**R**: ${faq.a}\n\n`);
  }
  
  return desc;
}
