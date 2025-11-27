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

// 4. Informații Generale Site (Knowledge Base Static)
const SITE_POLICIES = `
INFORMAȚII UTILE SITE:
- **Transport Gratuit**: Pentru comenzi mai mari de 500 RON.
- **Timp de producție**: De obicei 2-4 zile lucrătoare pentru majoritatea produselor (Bannere, Autocolante, Printuri).
- **Livrare**: Se face prin curier rapid (DPD).
- **Metode de plată**: Card Online (Stripe) sau Ramburs la curier.
- **Grafică**: Clientul poate încărca grafica proprie sau poate solicita machetare contra cost dacă opțiunea există.
- **Contact**: Telefon 0750.473.111, Email contact@prynt.ro.
`;

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
      name: "check_order_status",
      description: "Verifică statusul unei comenzi și returnează link-ul de tracking DPD.",
      parameters: {
        type: "object",
        properties: {
          orderNo: { type: "string", description: "Numărul comenzii (ex: 1050)" }
        },
        required: ["orderNo"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generate_offer",
      description: "Generează un link către o ofertă PDF (proformă) pentru produsele discutate.",
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
            required: ["name"]
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
  },
  {
    type: "function",
    function: {
      name: "create_order",
      description: "Finalizează comanda fermă. Apelează DOAR după ce ai validat JUDEȚUL și LOCALITATEA.",
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

CONTACT FALLBACK:
Dacă utilizatorul pune o întrebare la care nu știi răspunsul, nu poți calcula prețul, sau necesită intervenție umană, oferă politicos datele de contact:
"Pentru detalii specifice sau nelămuriri, ne puteți contacta la telefon **0750.473.111** sau pe email la **contact@prynt.ro**."

VERIFICARE STATUS COMANDĂ:
Când verifici comanda, transmite exact mesajul returnat de funcția "check_order_status". Include link-ul de tracking exact așa cum îl primești. Nu inventa statusuri de livrare. Explică clientului că statusul "Finalizat" înseamnă că am predat noi coletul, nu că a ajuns la el.

GENERARE OFERTĂ:
Dacă clientul dorește o ofertă de preț (scrisă, PDF, proformă) înainte de a comanda ferm, folosește funcția "generate_offer". Cere numele clientului și (opțional) datele de contact pentru a personaliza oferta. Când soliciți numele pentru personalizarea ofertei, include tag-ul ||REQUEST: NAME|| la finalul întrebării. Când generezi textul ofertei, folosește {{name}} acolo unde vrei ca numele clientului să apară în text.

OBIECTIV:
Ajută clientul să configureze produsul, oferă prețul corect și preia datele de livrare EXACT cum sunt cerute de curier (DPD).

DATE DE REFERINȚĂ (Validare Strictă):
1. MATERIALE DISPONIBILE:
${getMaterialsText()}

2. JUDEȚE LIVRARE (Validează strict inputul utilizatorului):
${getJudeteText()}

3. INFORMAȚII UTILE SITE:
${SITE_POLICIES}

REGULI DE INTERACȚIUNE (Stil "Căsuțe de selectare"):
- Pentru orice întrebare cu opțiuni, afișează lista clar (numerotată sau cu bullet points) și cere explicit alegerea.
- Când soliciți o informație care are opțiuni fixe (ex: Material, Județ, Tip Finisaj), enumeră opțiunile clar.

FLUX DE COMANDĂ:
1. **Configurare**: Întreabă dimensiunile (Lungime x Lățime).
2. **Selecție**: Întreabă materialul și finisajele.
3. **Preț**: Calculează și prezintă prețul. Include mențiunea despre Livrare Gratuită > 500 RON.
4. **Checkout (Date Livrare)**:
  - Cere Nume și Email. Dacă soliciți numele în contextul unei oferte, adaugă ||REQUEST: NAME|| la final.
   - Cere **Județul** (Validează cu lista). Adaugă ||REQUEST: JUDET|| la final.
   - Cere **Localitatea**. Adaugă ||REQUEST: LOCALITATE|| la final.
   - Cere **Adresa**.
   - Confirmă totul și apelează 'create_order'.

REGULI SPECIALE:
- WhatsApp: fii concis.
- Link-urile DPD trebuie afișate integral.

${getBannerPricingText()}
`;