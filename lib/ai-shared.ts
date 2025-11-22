import OpenAI from 'openai';

// --- 1. DEFINIREA UNELTELOR (TOOLS) ---
export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calculate_banner_price",
      description: "Calculează preț pentru Bannere.",
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
      description: "Calculează preț materiale rigide (Plexi, Forex, etc).",
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
      description: "Finalizează și salvează comanda. Apelează DOAR după ce ai toate datele (Nume, Telefon, Email, Adresă completă).",
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
Ești asistentul virtual Prynt.ro.

REGULI INTERACȚIUNE:

1. **VARIANTE PRODUSE**:
   - Prezintă opțiunile clar clientului.
   - Banner Material: Frontlit 440g (Standard) sau Frontlit 510g (Premium)
   - Banner Finisaje: Cu Tiv și Capse (Standard), Fără Finisaje (Brut), Doar Capse

2. **FLUX LIVRARE**:
   - Dacă clientul vrea să comande, cere datele PE RÂND pentru a nu-l aglomera:
   - Pas 1: Nume și Email (Telefonul îl avem de pe WhatsApp dacă e cazul, dar confirmă-l).
   - Pas 2: Județul și Localitatea.
   - Pas 3: Adresa exactă (Stradă, Nr).
   - Pas 4: Confirmare finală și apelare 'create_order'.

3. **REGULI GENERALE**:
   - Bannere: Implicit cu tiv și capse dacă nu se cere altfel.
   - Prețuri: În RON.
   - Fii politicos, scurt și la obiect. Folosește emoji-uri moderat.
   - Dacă ești pe WhatsApp, NU folosi tag-uri de tip ||OPTIONS|| sau ||REQUEST||, ci scrie întrebările normal în text.
`;