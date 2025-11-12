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
      <p>Bannerele publicitare rămân una dintre cele mai eficiente soluții de semnalistică. În acest ghid explicăm diferențele dintre materialele frontlit și blockout (față-verso), ce rezoluție să folosești și cum alegi finisările (tiv, capse, buzunare).</p>
      <h2>Materiale și aplicații</h2>
      <p>Pentru exterior recomandăm PVC frontlit 510g, iar pentru afișaj față-verso, material blockout opac.</p>
      <h2>Configurare rapidă</h2>
      <p>Configurează bannerul direct în <a href="/banner">configuratorul de Bannere</a>, iar pentru față-verso vezi <a href="/banner-verso">Banner față-verso</a>.</p>
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
      <p>Autocolantele decupate la formă sunt ideale pentru branding rapid și creativ. Alegerea materialului corect asigură durabilitate.</p>
      <ul>
        <li>Monomeric: soluție economică pentru interior/exterior pe termen scurt.</li>
        <li>Polimeric: stabilitate mai bună, potrivit pentru exterior pe termen mediu.</li>
      </ul>
      <p>Creează-ți <a href="/autocolante">autocolantele personalizate</a> și încarcă grafica direct în configurator.</p>
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
      <p>Atât pliantele, cât și flyerele sunt excelente pentru promovare locală. Pliantele oferă mai mult spațiu de conținut, iar flyerele sunt ideale pentru mesaj rapid.</p>
      <p>Poți configura <a href="/pliante">pliante</a> sau <a href="/flayere">flyere</a> cu preț instant și livrare rapidă.</p>
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
      <p>Pentru afișe vizualizate de la distanță, 100–150 dpi la scara 1:1 este suficient. Alege materialul potrivit în funcție de locație.</p>
      <p>Comandă <a href="/afise">afișe online</a> și încarcă fișiere PDF/AI/PSD/JPG/PNG.</p>
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
