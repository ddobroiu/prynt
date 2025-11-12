export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date
  author?: string;
  tags: string[];
  hero?: string;
  contentHtml: string; // basic HTML string rendered with dangerouslySetInnerHTML
};

export const POSTS: BlogPost[] = [
  {
    slug: "ghid-bannere-publicitare",
    title: "Ghid complet: bannere publicitare – materiale, dimensiuni, finisări",
    description: "Află ce material să alegi (frontlit, blockout), ce rezoluție recomandăm și cum configurezi bannerul online.",
    date: new Date().toISOString(),
    author: "Prynt",
    tags: ["banner", "publicitar", "capse", "tiv"],
    hero: "/products/banner/hero.jpg",
    contentHtml: `
      <p>Bannerele publicitare rămân una dintre cele mai eficiente soluții de semnalistică outdoor și indoor. Alegerea materialului, dimensiunii și finisajelor influențează direct vizibilitatea, durabilitatea și costul.</p>
      <h2>Materiale și aplicații</h2>
      <ul>
        <li><b>PVC Frontlit 510 g</b> – standardul pentru exterior: rezistent, opacitate bună, print clar. Recomandat pentru față simplă.</li>
        <li><b>Blockout (față–verso)</b> – material opac cu strat de blocare a luminii pentru print pe ambele fețe, ideal la suspendare în spații deschise.</li>
      </ul>
      <p>La Prynt folosim cerneluri rezistente UV pentru culori stabile în timp. Dimensiunile pot fi personalizate la centimetru.</p>
      <h2>Dimensiuni, rezoluție și fișiere</h2>
      <ul>
        <li>Rezoluție recomandată: <b>100–150 dpi</b> la scara 1:1 (afișaj vizualizat de la distanță).</li>
        <li>Bleed (margine de finisare): 10–20 mm, în funcție de tiv/capse.</li>
        <li>Formate uzuale: 200×100 cm, 300×100 cm, 300×150 cm sau personalizat.</li>
        <li>Formate acceptate: PDF/AI/PSD/JPG/PNG; convertește fonturile în curbe.</li>
      </ul>
      <h2>Finisări: tiv, capse, buzunare</h2>
      <p><b>Tiv</b>ul întărește marginile; <b>capsele</b> se pot poziționa la 30–50 cm sau la cerere. Pentru prindere pe țevi/ramă, alege <b>buzunare</b>.</p>
      <h2>Montaj și bune practici</h2>
      <ul>
        <li>Evită întinderea excesivă; prinde uniform în toate colțurile.</li>
        <li>Curăță suprafețele de prindere și verifică integritatea elementelor (șoricei, bride, șuruburi).</li>
      </ul>
      <h2>Întrebări frecvente</h2>
      <ul>
        <li><b>Cât durează?</b> Termen total (producție + livrare): 24–48 ore.</li>
        <li><b>Pot primi BAT?</b> Da, la cerere trimitem o previzualizare (BAT) pentru confirmare.</li>
      </ul>
      <h2>Configurează acum</h2>
      <p>Comandă rapid în <a href="/banner">configuratorul de Bannere</a> sau alege <a href="/banner-verso">Banner față–verso</a> pentru print pe ambele fețe.</p>
    `,
  },
  {
    slug: "autocolante-decupate-la-contur",
    title: "Autocolante decupate la contur: materiale, rezistență și preț",
    description: "Tot ce trebuie să știi despre autocolante decupate: monomeric vs polimeric, laminare și rezistență în timp.",
    date: new Date().toISOString(),
    author: "Prynt",
    tags: ["autocolante", "decupare", "laminare"],
    hero: "/products/autocolante/hero.jpg",
    contentHtml: `
      <p>Autocolantele decupate la contur sunt excelente pentru logo-uri, etichete și semnalistică rapidă. Materialul și laminarea fac diferența între o soluție temporară și una care arată bine luni sau ani.</p>
      <h2>Materiale: monomeric vs polimeric</h2>
      <ul>
        <li><b>Monomeric</b> – economic, potrivit pentru interior sau exterior pe termen scurt-medii (campanii).</li>
        <li><b>Polimeric</b> – stabil dimensional mai bun, recomandat pentru exterior pe termen mediu.</li>
      </ul>
      <h2>Laminare și protecție</h2>
      <p>Laminarea (lucioasă/mată) protejează printul la abraziune și UV. Recomandată pentru exterior sau zone cu trafic intens.</p>
      <h2>Decupare la formă și fișiere</h2>
      <ul>
        <li>Include un <b>contur (cut path)</b> în fișier sau descrie forma în comandă.</li>
        <li>Rezoluție recomandată: 150–300 dpi la scara 1:1 pentru grafici detaliate.</li>
      </ul>
      <h2>Aplicare corectă</h2>
      <ul>
        <li>Curăță suprafața (fără praf/ulei). Aplică la temperatură moderată.</li>
        <li>Pentru bucăți mari, folosește racletă și pulverizare ușoară (aplicare umedă), dacă materialul permite.</li>
      </ul>
      <h2>Comandă rapid</h2>
      <p>Configurează <a href="/autocolante">autocolante personalizate</a>, încarcă fișierele sau lasă linkul către grafica ta. Termen total 24–48 ore.</p>
    `,
  },
  {
    slug: "pliante-vs-flayere-cand-si-de-ce",
    title: "Pliante vs Flyere: când alegi fiecare și ce influențează prețul",
    description: "Diferențe între pliante și flyere, formate uzuale, plieri și sfaturi de design pentru impact maxim.",
    date: new Date().toISOString(),
    tags: ["pliante", "flyere", "formate"],
    hero: "/products/pliante/hero.jpg",
    contentHtml: `
      <p>Pliantele și flyerele sunt materiale tipărite esențiale în promovarea locală. Diferența principală: <b>pliantele</b> se pliază (bi/tri pli), oferă mai mult spațiu de conținut structurabil; <b>flyerele</b> sunt o coală simplă – ideale pentru mesaje scurte, distribuție masivă.</p>
      <h2>Formate și plieri</h2>
      <ul>
        <li>Formate uzuale: A6, A5, A4; pentru pliante – bi pli/tri pli.</li>
        <li>Bleed recomandat: 3 mm; margini de siguranță: 3–5 mm.</li>
      </ul>
      <h2>Hârtie și finisaje</h2>
      <ul>
        <li>Gramaje: 130–300 g; <b>170–200 g</b> echilibru bun pentru cost/rigiditate.</li>
        <li>Finisaj: lucios sau mat; plastifiere opțională pentru rezistență și aspect premium.</li>
      </ul>
      <h2>Design care convertește</h2>
      <ul>
        <li>Headline clar, CTA vizibil, informații esențiale scanabile.</li>
        <li>Contrast bun și fonturi lizibile; pregătește PDF cu imagini în CMYK.</li>
      </ul>
      <h2>Comandă rapid</h2>
      <p>Configurează <a href="/pliante">pliantele</a> sau <a href="/flayere">flyerele</a> cu preț instant. Termen total 24–48 ore.</p>
    `,
  },
  {
    slug: "afise-rapid-rezolutie-si-materiale",
    title: "Afișe rapide: rezoluție, materiale și bune practici",
    description: "Ce rezoluție folosim la afișe, ce materiale recomandăm (blueback/whiteback/foto) și cum trimiți fișierele corecte.",
    date: new Date().toISOString(),
    tags: ["afișe", "rezoluție", "materiale"],
    hero: "/products/afise/hero.jpg",
    contentHtml: `
      <p>Afișele sunt perfecte pentru promoții, evenimente și comunicare vizuală rapidă. Contează materialul, rezoluția și mesajul concis.</p>
      <h2>Materiale recomandate</h2>
      <ul>
        <li><b>Blueback</b> – ideal outdoor, opac, acoperă bine suprafețe deja colate.</li>
        <li><b>Whiteback/Satin/Foto</b> – pentru print high-quality și indoor.</li>
        <li><b>Hârtie 150/300 g</b> lucioasă sau mată – pentru postere la interior.</li>
      </ul>
      <h2>Rezoluție și dimensiuni</h2>
      <ul>
        <li>Rezoluție recomandată: 150–300 dpi pentru formate A3–A0; 100–150 dpi pentru afișe foarte mari.</li>
        <li>Formate: A3, A2, A1, A0, S5/S7 sau dimensiuni personalizate.</li>
      </ul>
      <h2>Comandă rapid</h2>
      <p>Configurează <a href="/afise">afișele</a> cu preț instant. Acceptăm PDF/AI/PSD/JPG/PNG; verificăm gratuit fișierele. Termen total 24–48 ore.</p>
    `,
  },
];

export function getAllPosts(): BlogPost[] {
  return POSTS;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}
