// lib/emailMarketing.ts
// Email Marketing System focused on 14 main configurators

import { Resend } from 'resend';
import { getHtmlTemplate } from './email';

const resend = new Resend(process.env.RESEND_API_KEY);

// 14 Main Configurators (Core Products)
export const MAIN_CONFIGURATORS = [
  {
    id: 'banner',
    title: 'Bannere Outdoor',
    description: 'Rezistente UV, tiv & capse incluse',
    url: '/banner',
    image: '/products/banner/1.webp',
    category: 'outdoor',
    startingPrice: 50,
    benefits: ['Rezistent la UV', 'Tiv inclus', 'Capse metalice', 'Livrare rapidă']
  },
  {
    id: 'banner-verso',
    title: 'Bannere Față-Verso',
    description: 'Vizibilitate maximă din ambele părți',
    url: '/banner-verso',
    image: '/products/banner/verso/1.webp',
    category: 'outdoor',
    startingPrice: 85,
    benefits: ['Print dublu', 'Material blockout', 'Impact vizual maxim', 'ROI superior']
  },
  {
    id: 'autocolante',
    title: 'Autocolante & Stickere',
    description: 'Print & Cut pe contur, orice formă',
    url: '/autocolante',
    image: '/products/autocolante/1.webp',
    category: 'indoor',
    startingPrice: 25,
    benefits: ['Decupaj pe contur', 'Vinyl premium', 'Adeziv puternic', 'Orice formă']
  },
  {
    id: 'afise',
    title: 'Afișe & Postere',
    description: 'A4, A3, A2, A1, A0 - toate formatele',
    url: '/afise',
    image: '/products/afise/1.webp',
    category: 'indoor',
    startingPrice: 3,
    benefits: ['Toate formatele', 'Hârtie premium', 'Rezoluție înaltă', 'Prețuri mici']
  },
  {
    id: 'canvas',
    title: 'Tablouri Canvas',
    description: 'Print pe pânză întinsă pe șasiu',
    url: '/canvas',
    image: '/products/canvas/1.webp',
    category: 'decor',
    startingPrice: 79,
    benefits: ['Pânză premium', 'Șasiu lemn', 'Gata de agățat', 'Cadou perfect']
  },
  {
    id: 'tapet',
    title: 'Tapet Personalizat',
    description: 'Fototapet la dimensiuni custom',
    url: '/tapet',
    image: '/products/tapet/1.webp',
    category: 'decor',
    startingPrice: 45,
    benefits: ['Orice dimensiune', 'Rezoluție 4K', 'Adeziv inclus', 'Instalare ușoară']
  },
  {
    id: 'flayere',
    title: 'Flyere Promoționale',
    description: 'A6, A5, DL - promovare stradală',
    url: '/flayere',
    image: '/products/flayere/1.webp',
    category: 'promo',
    startingPrice: 50,
    benefits: ['Hârtie 250g', 'Tiraje mari', 'Livrare rapidă', 'Cost per bucată mic']
  },
  {
    id: 'pliante',
    title: 'Pliante Marketing',
    description: 'Brosuri pliabile pentru prezentare',
    url: '/pliante',
    image: '/products/pliante/1.webp',
    category: 'promo',
    startingPrice: 120,
    benefits: ['Multiple pliuri', 'Hârtie lucioasă', 'Design profesional', 'Impact mare']
  },
  {
    id: 'pvc-forex',
    title: 'PVC Forex',
    description: 'Panouri rigide pentru interior/exterior',
    url: '/materiale/pvc-forex',
    image: '/products/materiale/pvc-forex/1.webp',
    category: 'rigide',
    startingPrice: 85,
    benefits: ['Rezistent UV', 'Ușor de montat', 'Suprafață netedă', 'Durabilitate mare']
  },
  {
    id: 'plexiglass',
    title: 'Plexiglass Premium',
    description: 'Transparență cristalină, aspect luxury',
    url: '/materiale/plexiglass',
    image: '/products/materiale/plexiglass/1.webp',
    category: 'rigide',
    startingPrice: 150,
    benefits: ['Transparență perfectă', 'Aspect premium', 'Rezistent șocuri', 'Finisaj luxury']
  },
  {
    id: 'alucobond',
    title: 'Alucobond Composite',
    description: 'Material premium pentru exterior',
    url: '/materiale/alucobond',
    image: '/products/materiale/alucobond/1.webp',
    category: 'rigide',
    startingPrice: 200,
    benefits: ['Durabilitate extremă', 'Aspect metalic', 'Rezistent intemperii', 'Profesional']
  },
  {
    id: 'carton',
    title: 'Carton Plast',
    description: 'Soluția economică pentru indoor',
    url: '/materiale/carton',
    image: '/products/materiale/carton/1.webp',
    category: 'rigide',
    startingPrice: 35,
    benefits: ['Economic', 'Ușor', 'Ideal evenimente', 'Livrare rapidă']
  },
  {
    id: 'polipropilena',
    title: 'Polipropilenă',
    description: 'Flexibilă și rezistentă',
    url: '/materiale/polipropilena',
    image: '/products/materiale/polipropilena/1.webp',
    category: 'rigide',
    startingPrice: 45,
    benefits: ['Flexibilă', 'Rezistentă apă', 'Ușor de curățat', 'Versatilă']
  },
  {
    id: 'fonduri-eu',
    title: 'Pachete Fonduri UE',
    description: 'Set complet pentru proiecte europene',
    url: '/fonduri-pnrr',
    image: '/products/fonduri/1.webp',
    category: 'pachete',
    startingPrice: 850,
    benefits: ['Pachet complet', 'Conforme cerințe UE', 'Consultanță inclusă', 'Aprobare garantată']
  }
] as const;

// Email Marketing Categories
export const EMAIL_CATEGORIES = {
  outdoor: {
    name: 'Publicitate Exterior',
    products: ['banner', 'banner-verso'],
    audience: 'Afaceri cu vizibilitate stradală'
  },
  indoor: {
    name: 'Materiale Interior',
    products: ['autocolante', 'afise'],
    audience: 'Magazine, birouri, evenimente indoor'
  },
  decor: {
    name: 'Decorațiuni & Cadouri',
    products: ['canvas', 'tapet'],
    audience: 'Persoane fizice, designeri, arhitecti'
  },
  promo: {
    name: 'Marketing Direct',
    products: ['flayere', 'pliante'],
    audience: 'Campanii promoționale, evenimente'
  },
  rigide: {
    name: 'Materiale Rigide',
    products: ['pvc-forex', 'plexiglass', 'alucobond', 'carton', 'polipropilena'],
    audience: 'Constructii, amenajari, signaletică'
  },
  pachete: {
    name: 'Soluții Complete',
    products: ['fonduri-eu'],
    audience: 'Organizații cu proiecte europene'
  }
} as const;

// Newsletter Signup with Interest Tracking
export interface NewsletterSubscription {
  email: string;
  name?: string;
  interests: string[]; // configurator IDs
  source: string; // 'footer' | 'popup' | 'checkout' | 'configurator'
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

// Email Templates for Configurators
export function generateConfiguratorEmailContent(configurator: typeof MAIN_CONFIGURATORS[number], type: 'welcome' | 'abandoned' | 'recommendation') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  
  switch (type) {
    case 'welcome':
      return {
        subject: `Bine ai venit! Descoperă ${configurator.title}`,
        title: `Mulțumim pentru interesul în ${configurator.title}!`,
        message: `${configurator.description}. Începe să configurezi produsul perfect pentru nevoile tale cu prețuri de la ${configurator.startingPrice} RON.`,
        benefits: configurator.benefits,
        buttonText: "Configurează Acum",
        buttonUrl: `${baseUrl}${configurator.url}`,
        image: `${baseUrl}${configurator.image}`
      };
      
    case 'abandoned':
      return {
        subject: `Ai uitat ${configurator.title} în coș?`,
        title: `Produsele tale te așteaptă!`,
        message: `Ai început să configurezi ${configurator.title} dar nu ai finalizat comanda. Continuă de unde ai rămas și profită de prețurile noastre competitive.`,
        benefits: configurator.benefits,
        buttonText: "Continuă Comanda",
        buttonUrl: `${baseUrl}${configurator.url}?utm_source=email&utm_medium=abandoned&utm_campaign=recovery`,
        image: `${baseUrl}${configurator.image}`,
        discount: '5% REDUCERE cu codul EMAIL5'
      };
      
    case 'recommendation':
      return {
        subject: `Recomandare specială: ${configurator.title}`,
        title: `Produsul perfect pentru tine!`,
        message: `Pe baza preferințelor tale, ${configurator.title} ar putea fi exact ce cauți. ${configurator.description} cu beneficii exclusive.`,
        benefits: configurator.benefits,
        buttonText: "Vezi Detalii",
        buttonUrl: `${baseUrl}${configurator.url}?utm_source=email&utm_medium=recommendation`,
        image: `${baseUrl}${configurator.image}`
      };
  }
}

// Smart Recommendations based on behavior
export function getSmartRecommendations(userHistory: string[], currentInterest?: string): typeof MAIN_CONFIGURATORS[number][] {
  // Cross-sell logic
  const crossSellMap: Record<string, string[]> = {
    'banner': ['autocolante', 'afise', 'pvc-forex'],
    'banner-verso': ['banner', 'plexiglass', 'alucobond'],
    'autocolante': ['afise', 'banner', 'tapet'],
    'afise': ['flayere', 'pliante', 'autocolante'],
    'canvas': ['tapet', 'afise', 'plexiglass'],
    'tapet': ['canvas', 'autocolante', 'pvc-forex'],
    'pvc-forex': ['plexiglass', 'alucobond', 'banner'],
    'plexiglass': ['alucobond', 'pvc-forex', 'canvas']
  };
  
  const recommended = new Set<string>();
  
  // Add cross-sell recommendations
  if (currentInterest && crossSellMap[currentInterest]) {
    crossSellMap[currentInterest].forEach(id => recommended.add(id));
  }
  
  // Add category-based recommendations
  userHistory.forEach(productId => {
    if (crossSellMap[productId]) {
      crossSellMap[productId].forEach(id => recommended.add(id));
    }
  });
  
  // Remove already viewed products
  userHistory.forEach(id => recommended.delete(id));
  if (currentInterest) recommended.delete(currentInterest);
  
  // Return top 3 recommendations
  return Array.from(recommended)
    .slice(0, 3)
    .map(id => MAIN_CONFIGURATORS.find(c => c.id === id))
    .filter(Boolean) as typeof MAIN_CONFIGURATORS[number][];
}

// Newsletter Campaign Templates
export function generateNewsletterCampaign(theme: 'weekly' | 'promotional' | 'educational') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  
  switch (theme) {
    case 'weekly':
      return {
        subject: 'Săptămâna aceasta la Prynt: Noutăți și Oferte',
        title: 'Noutățile săptămânii',
        sections: [
          {
            title: 'Produs în Spotul Săptămânii',
            configurator: MAIN_CONFIGURATORS[Math.floor(Math.random() * MAIN_CONFIGURATORS.length)],
            discount: '10% REDUCERE'
          },
          {
            title: 'Configuratoare Populare',
            configurators: MAIN_CONFIGURATORS.slice(0, 3)
          }
        ]
      };
      
    case 'promotional':
      return {
        subject: '🔥 OFERTĂ SPECIALĂ: Până la 25% Reducere!',
        title: 'Oferte Limitate - Nu Rata Ocazia!',
        sections: [
          {
            title: 'Reduceri Masive',
            configurators: MAIN_CONFIGURATORS.filter(c => c.category === 'outdoor'),
            discount: '25% REDUCERE'
          }
        ]
      };
      
    case 'educational':
      return {
        subject: 'Ghid Complet: Cum Alegi Materialul Perfect',
        title: 'Învață să Alegi Optim',
        sections: [
          {
            title: 'Materiale pentru Exterior vs Interior',
            configurators: [
              MAIN_CONFIGURATORS.find(c => c.id === 'banner')!,
              MAIN_CONFIGURATORS.find(c => c.id === 'afise')!
            ]
          }
        ]
      };
  }
}

// Send Welcome Series Email
export async function sendConfiguratorWelcomeEmail(subscription: NewsletterSubscription) {
  if (!subscription.interests.length) return;
  
  const mainInterest = subscription.interests[0];
  const configurator = MAIN_CONFIGURATORS.find(c => c.id === mainInterest);
  
  if (!configurator) return;
  
  const content = generateConfiguratorEmailContent(configurator, 'welcome');
  
  const html = getHtmlTemplate({
    title: content.title,
    message: content.message,
    buttonText: content.buttonText,
    buttonUrl: content.buttonUrl,
    footerText: "Mulțumim că te-ai alăturat comunității Prynt!"
  });
  
  // Add benefits list and image
  const enhancedHtml = html.replace(
    content.message,
    `${content.message}<br/><br/>
    <img src="${content.image}" alt="${configurator.title}" style="max-width: 300px; border-radius: 8px; margin: 16px 0;"/>
    <h3 style="color: #333; margin-top: 20px;">De ce să alegi ${configurator.title}?</h3>
    <ul style="color: #666; line-height: 1.6;">
      ${content.benefits.map(benefit => `<li>✅ ${benefit}</li>`).join('')}
    </ul>`
  );
  
  await resend.emails.send({
    from: 'Prynt Configuratoare <no-reply@prynt.ro>',
    to: subscription.email,
    subject: content.subject,
    html: enhancedHtml,
  });
}

// Abandoned Cart Recovery
export async function sendAbandonedCartEmail(email: string, configuratorId: string, delay: '1h' | '24h' | '3d') {
  const configurator = MAIN_CONFIGURATORS.find(c => c.id === configuratorId);
  if (!configurator) return;
  
  const content = generateConfiguratorEmailContent(configurator, 'abandoned');
  
  const discountCode = delay === '3d' ? 'LAST10' : delay === '24h' ? 'RETURN5' : null;
  const discountText = discountCode ? `<div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
    <strong style="color: #15803d;">🎉 REDUCERE SPECIALĂ: ${discountCode === 'LAST10' ? '10%' : '5%'}</strong><br/>
    <span style="color: #166534;">Folosește codul: <code style="background: #dcfce7; padding: 4px 8px; border-radius: 4px;">${discountCode}</code></span>
  </div>` : '';
  
  const html = getHtmlTemplate({
    title: content.title,
    message: content.message,
    buttonText: content.buttonText,
    buttonUrl: content.buttonUrl,
    footerText: "Echipa Prynt"
  });
  
  const enhancedHtml = html.replace(
    '</div>', // Before closing button div
    `${discountText}</div>`
  );
  
  await resend.emails.send({
    from: 'Prynt Reminder <no-reply@prynt.ro>',
    to: email,
    subject: content.subject,
    html: enhancedHtml,
  });
}

export default {
  MAIN_CONFIGURATORS,
  EMAIL_CATEGORIES,
  generateConfiguratorEmailContent,
  getSmartRecommendations,
  sendConfiguratorWelcomeEmail,
  sendAbandonedCartEmail
};