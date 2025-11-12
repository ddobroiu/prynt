import { NextRequest, NextResponse } from "next/server";

type InMessage = { role: "user" | "assistant" | "system"; content: string };

// Simple Romanian intent mapping -> product suggestions
const intents: Array<{
  id: string;
  keywords: RegExp[];
  title: string;
  description: string;
  href: string;
}> = [
  {
    id: "banner",
    keywords: [/\bbanner(e)?\b/i, /frontlit/i, /capse/i, /tiv/i],
    title: "Banner publicitar (față simplă)",
    description: "PVC frontlit 510 g, finisare cu tiv și capse, dimensiuni la cm.",
    href: "/banner",
  },
  {
    id: "banner-verso",
    keywords: [/față\s*-?\s*verso/i, /double\s*sided/i, /blockout/i],
    title: "Banner față–verso (blockout)",
    description: "Material opac pentru print pe ambele fețe, ideal suspendat.",
    href: "/banner-verso",
  },
  {
    id: "autocolante",
    keywords: [/autocolant(e)?/i, /sticker(e)?/i, /decupat/i, /laminare/i],
    title: "Autocolante decupate la contur",
    description: "Monomeric/polimeric, opțional laminare mată/lucioasă.",
    href: "/autocolante",
  },
  {
    id: "afise",
    keywords: [/afiș(e)?/i, /poster(e)?/i, /blueback/i],
    title: "Afișe (blueback/whiteback)",
    description: "Rezoluție recomandată 150–300 dpi, formate A3–A0 sau personalizat.",
    href: "/afise",
  },
  {
    id: "pliante",
    keywords: [/pliant(e)?/i, /tri\s*pli/i, /bi\s*pli/i],
    title: "Pliante personalizate",
    description: "Formate A6–A4, bi/tri pli, gramaje 130–300 g.",
    href: "/pliante",
  },
  {
    id: "flayere",
    keywords: [/flyer(e)?/i, /flayer(e)?/i],
    title: "Flyere promoționale",
    description: "Mesaj scurt, distribuție rapidă, preț optim.",
    href: "/flayere",
  },
  {
    id: "canvas",
    keywords: [/canvas/i, /tablou/i],
    title: "Tablouri canvas",
    description: "Print pe pânză, întins pe șasiu, gata de agățat.",
    href: "/canvas",
  },
  {
    id: "pvc-forex",
    keywords: [/forex/i, /pvc\s*expansiat/i],
    title: "PVC Forex",
    description: "Material rigid ușor, ideal pentru semnalistică indoor/outdoor.",
    href: "/pvc-forex",
  },
  {
    id: "plexiglass",
    keywords: [/plexi/i, /acril(lic)?/i],
    title: "Plexiglass",
    description: "Aspect premium, rigid, lucios – pentru display-uri.",
    href: "/plexiglass",
  },
  {
    id: "polipropilena",
    keywords: [/polipropilen(ă|a)/i, /pp\s*cellular/i],
    title: "Polipropilenă celulară",
    description: "Foarte ușoară, panotaj economic, temporar.",
    href: "/polipropilena",
  },
  {
    id: "carton",
    keywords: [/carton/i, /print\s*pe\s*carton/i],
    title: "Carton – print personalizat",
    description: "Carton cretat 150–300 g, opțional plastifiere.",
    href: "/carton",
  },
  {
    id: "tapet",
    keywords: [/tapet/i, /wallpaper/i, /perete/i],
    title: "Tapet personalizat",
    description: "Tapet personalizat pentru pereți, texturat sau lavabil.",
    href: "/tapet",
  },
  {
    id: "alucobond",
    keywords: [/alucobond/i, /dibond/i, /bond/i],
    title: "Alucobond",
    description: "Placă compozită aluminiu – rigidă, rezistentă.",
    href: "/alucobond",
  },
];

function findSuggestions(text: string) {
  const lower = text.toLowerCase();
  const matches = intents.filter((it) => it.keywords.some((r) => r.test(lower)));
  // If nothing matched, propose top categories
  const top = [
    intents.find((i) => i.id === 'banner')!,
    intents.find((i) => i.id === 'autocolante')!,
    intents.find((i) => i.id === 'pliante')!,
    intents.find((i) => i.id === 'afise')!,
  ].filter(Boolean);
  return matches.length ? matches.slice(0, 3) : top;
}

function buildReply(userText: string) {
  const suggestions = findSuggestions(userText);
  const intro =
    'Iată ce îți recomand, pe baza mesajului tău. Poți configura online (preț instant) și încărca grafica:';
  const list = suggestions
    .map(
      (s) => `• <a href="${s.href}" class="underline">${s.title}</a> — ${s.description}`
    )
    .join('\n');
  const eta = '\n\nTermen total (producție + livrare): 24–48 ore. Dacă vrei, pot estima rapid prețul dacă îmi spui dimensiunile exacte, tirajul și opțiunile (ex: capse, laminare).';
  return `${intro}\n${list}${eta}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { messages?: InMessage[] };
    const last = body.messages?.slice().reverse().find((m) => m.role === 'user');
    const userText = last?.content?.toString().slice(0, 2000) || '';
    const reply = userText
      ? buildReply(userText)
      : 'Spune-mi pe scurt ce ai nevoie (ex: banner 300×100 cm, autocolante decupate, pliante A5) și îți dau o recomandare + link direct către configurator.';
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ reply: 'A apărut o eroare. Încearcă din nou.' }, { status: 200 });
  }
}
