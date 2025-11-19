import { NextResponse } from "next/server";
// Importăm TOATE constantele de preț
import * as Pricing from "@/lib/pricing";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Pregătim contextul de prețuri din fișierul centralizat
    // Transformăm obiectul Pricing într-un string lizibil pentru AI
    const pricingContext = JSON.stringify(Pricing, null, 2);

    // 2. Construim promptul de sistem
    const systemMessage = {
      role: "system",
      content: `Ești asistentul virtual Prynt.ro, o tipografie online din România.
      
      REGULI DE AUR:
      1. Folosește DOAR prețurile și regulile de mai jos. Nu inventa prețuri.
      2. Răspunde scurt, politicos și la obiect.
      3. Dacă un client cere o ofertă, calculează pe baza formulelor din context.
      4. Nu oferi reduceri care nu sunt listate aici.
      
      CONTEXT PREȚURI ȘI PRODUSE (Sursa Adevărului):
      ${pricingContext}
      
      Instrucțiuni specifice:
      - Pentru Banner: Verifică Pricing.BANNER_CONSTANTS.
      - Pentru Pliante: Verifică Pricing.FLYER_CONSTANTS (atenție la față-verso).
      - Pentru Cărți de vizită/Flyere/Afișe: Ghidează clientul către configurator dacă e complex.
      
      Scopul tău este să ajuți clientul să aleagă produsul potrivit și să-i dai o estimare de preț corectă bazată pe datele de mai sus.`
    };

    // Aici ar trebui să fie logica ta de apelare OpenAI / alt LLM.
    // Deoarece nu am cheile tale, simulez structura standard de Chat Completion.
    // Înlocuiește partea de mai jos cu apelul tău real către OpenAI/Anthropic.
    
    // Exemplu generic pentru structura de request (presupunând OpenAI):
    const payload = {
      model: "gpt-3.5-turbo", // sau gpt-4
      messages: [systemMessage, ...messages],
      temperature: 0.7,
    };

    // NOTĂ: Aici trebuie să faci fetch-ul real către providerul tău de AI.
    // Dacă foloseai un SDK anume, păstrează-l, dar asigură-te că 'systemMessage' este primul în lista de mesaje.
    
    // Pentru acest exemplu, returnez payload-ul ca să vezi că s-a integrat contextul, 
    // dar tu vei păstra logica de fetch existentă, doar adăugând systemMessage.
    
    // Daca ai codul vechi cu fetch la OpenAI, doar adauga variabila `systemMessage` in array-ul de mesaje.
    // Mai jos e un placeholder funcțional care răspunde cu o eroare prietenoasă dacă nu e configurat key-ul,
    // sau poți lipi logica ta veche aici.
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        method: "POST",
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}