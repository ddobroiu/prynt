import OpenAI from 'openai';
import { BANNER_CONSTANTS } from './pricing';
import { MATERIAL_OPTIONS } from './products';

// --- LISTA JUDEȚE (Embeded direct pentru a evita erori de import) ---
const JUDETE_LIST = [
  "Alba", "Arad", "Arges", "Bacau", "Bihor", "Bistrita-Nasaud", "Botosani", "Brasov", "Braila",
  "Bucuresti", "Buzau", "Caras-Severin", "Calarasi", "Cluj", "Constanta", "Covasna", "Dambovita",
  "Dolj", "Galati", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomita", "Iasi", "Ilfov",
  "Maramures", "Mehedinti", "Mures", "Neamt", "Olt", "Prahova", "Satu Mare", "Salaj", "Sibiu",
  "Suceava", "Teleorman", "Timis", "Tulcea", "Vaslui", "Valcea", "Vrancea"
];

// --- 0. HELPERE PENTRU GENERAREA PROMPTULUI (DATE DINAMICE) ---

// 1. Lista de prețuri bannere
const getBannerPricingText = () => {
  const bands = BANNER_CONSTANTS.PRICES.bands;
  let text = "PRAGURI REDUCERE BANNERE (Preț/mp în funcție de suprafața totală):\n";
  let prevMax = 0;
  bands.forEach((band) => {
    const range = band.max === Infinity 
      ? `Peste ${prevMax} mp` 
      : `${prevMax} - ${band.max} mp`;
    text += `- ${range}: ${band.price} RON/mp\n`;
    prevMax = band.max;
  });
  text += "\nNOTĂ: Banner Verso (Blockout) are prețuri aprox. 1.5x față de lista de mai sus.";
  return text;
};

// 2. Lista de Materiale Disponibile (din products.ts)
const getMaterialsText = () => {
  return MATERIAL_OPTIONS.map(m => `- ${m.label} (Recomandat pentru: ${m.recommendedFor?.join(', ')})`).join('\n');
};

// 3. Lista de Județe
const getJudeteText = () => {
  return JUDETE_LIST.join(', ');
};

// --- 1. DEFINIREA UNELTELOR (TOOLS) ---
export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calculate_banner_price",
      description: "Calculează preț pentru Bannere (Frontlit sau Verso).",
      parameters: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["frontlit", "verso"] },
          width_cm: { type: "number" },
          height_cm: { type: "number" },
          quantity: { type: "number" },
          material: { type: "string", enum: ["frontlit_440", "frontlit_510"] },
          want_wind_holes: { type: "boolean" },
          want_hem_and_grommets: { type: "boolean" },
          same_graphic: { type: "boolean" }
        },
        required: ["type", "width_cm", "height_cm", "quantity"]
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_rigid_price",
      description: "Calculează preț materiale rigide.",
      parameters: {
        type: "object",
        properties: {
          material_type: { type: "string", enum: ["plexiglass", "forex", "alucobond", "polipropilena", "carton"] },
          width_cm: { type: "number" },
          height_cm: { type: "number" },
          quantity: { type: "number" },
          thickness_mm: { type: "number" },
          subtype: { type: "string" },
          print_double: { type: "boolean" },
          color: { type: "string" }
        },
        required: ["material_type", "width_cm", "height_cm", "quantity"]
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_roll_print_price",
      description: "Calculează preț autocolant, canvas, tapet.",
      parameters: {
        type: "object",
        properties: {
          product_type: { type: "string", enum: ["autocolant", "canvas", "tapet"] },
          width_cm: { type: "number" },
          height_cm: { type: "number" },
          quantity: { type: "number" },
          material_subtype: { type: "string" },
          canvas_edge: { type: "string" },
          options: { type: "object", properties: { laminated: {type:"boolean"}, diecut: {type:"boolean"}, adhesive: {type:"boolean"} } }
        },
        required: ["product_type", "width_cm", "height_cm", "quantity"]
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_standard_print_price",
      description: "Calculează preț flyere, afișe, pliante.",
      parameters: {
        type: "object",
        properties: {
          product_type: { type: "string", enum: ["flyer", "pliant", "afis"] },
          size: { type: "string" },
          quantity: { type: "number" },
          paper_type: { type: "string" },
          fold_type: { type: "string" },
          two_sided: { type: "boolean" }
        },
        required: ["product_type", "size", "quantity"]
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_order",
      description: "Finalizează comanda. Apelează DOAR după ce ai validat JUDEȚUL și LOCALITATEA.",
      parameters: {
        type: "object",
        properties: {
          customer_details: {
            type: "object",
            properties: {
              name: { type: "string" },
              phone: { type: "string" },
              email: { type: "string" },
              address: { type: "string" },
              city: { type: "string" },
              county: { type: "string" }
            },
            required: ["name", "phone", "email", "address", "city", "county"]
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                quantity: { type: "number" },
                price: { type: "number" },
                details: { type: "string" }
              },
              required: ["title", "quantity", "price"]
            }
          }
        },
        required: ["customer_details", "items"]
      }
    }
  }
];

// --- 2. SYSTEM PROMPT ---
export const SYSTEM_PROMPT = `
Ești asistentul virtual Prynt.ro. Ești conectat direct la sistemul de producție și livrare.

OBIECTIV:
Ajută clientul să configureze produsul, oferă prețul corect și preia datele de livrare EXACT cum sunt cerute de curier (DPD).

DATE DE REFERINȚĂ (Validare Strictă):
1. MATERIALE DISPONIBILE:
${getMaterialsText()}

2. JUDEȚE LIVRARE (Validează strict inputul utilizatorului):
${getJudeteText()}
*(Nu accepta abrevieri sau nume greșite. Dacă clientul scrie "Buc", întreabă: "Vă referiți la București?". Curierul are nevoie de denumirea exactă.)*

REGULI DE INTERACȚIUNE (Stil "Căsuțe de selectare"):
- Când soliciți o informație care are opțiuni fixe (ex: Material, Județ, Tip Finisaj), enumeră opțiunile clar.
- Formatare: Folosește liste numerotate sau bullet points pentru opțiuni.
- Exemplu Material: "Ce material doriți? Avem disponibil: \n1. Frontlit 440g\n2. Frontlit 510g"
- Exemplu Județ: "În ce județ livrăm? (ex: Alba, București, Cluj...)"
- TEHNIC: Când ceri județul, include în răspuns tag-ul ||REQUEST: JUDET||.
- TEHNIC: Când ceri localitatea, include în răspuns tag-ul ||REQUEST: LOCALITATE||.

FLUX DE COMANDĂ:
1. **Configurare**: Întreabă dimensiunile (Lungime x Lățime) - aici clientul scrie liber.
2. **Selecție**: Întreabă materialul și finisajele - oferă LISTA de opțiuni.
3. **Preț**: Calculează și prezintă prețul. Include mențiunea despre Livrare Gratuită > 500 RON.
4. **Checkout (Date Livrare)**:
   - Cere Nume și Email.
   - Cere **Județul** (Validează cu lista de mai sus). Adaugă ||REQUEST: JUDET|| la finalul întrebării.
   - Cere **Localitatea** (După ce ai județul). Adaugă ||REQUEST: LOCALITATE|| la finalul întrebării.
   - Cere **Adresa** (Stradă, Nr).
   - Confirmă totul și apelează 'create_order'.

REGULI SPECIALE:
- Dacă clientul este pe WhatsApp, fii foarte concis.
- Dacă clientul vrea o dimensiune atipică, confirmă că se poate face (fiind tipar digital), dar cere dimensiunile exacte în cm.
- Nu accepta comanda fără un Județ valid din lista de mai sus.

${getBannerPricingText()}
`;