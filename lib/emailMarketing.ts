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
        incentive: 'Livrare GRATUITĂ pentru comenzi peste 100 RON'
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
  
  // Create welcome discount code
  let discountCodeHtml = '';
  try {
    const { createEmailDiscountCode } = await import('@/lib/discountCodes');
    const discountCode = await createEmailDiscountCode('welcome');
    
    discountCodeHtml = `<div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 20px; border-radius: 8px; margin: 16px 0; text-align: center;">
      <strong style="font-size: 20px;">🎁 CADOU DE BUNE VENIT!</strong><br/>
      <span>LIVRARE GRATUITĂ cu codul: <strong>${discountCode.code}</strong></span><br/>
      <small style="opacity: 0.9;">Pentru comenzi peste ${discountCode.minOrderValue} RON - valabil ${Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} zile!</small>
    </div>`;
  } catch (error) {
    console.error('[Email] Failed to create welcome discount:', error);
  }
  
  const html = getHtmlTemplate({
    title: content.title,
    message: content.message,
    buttonText: content.buttonText,
    buttonUrl: content.buttonUrl,
    footerText: "Mulțumim că te-ai alăturat comunității Prynt!"
  });
  
  // Add benefits list, image and discount code
  const enhancedHtml = html.replace(
    content.message,
    `${content.message}<br/><br/>
    ${discountCodeHtml}
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
export async function sendAbandonedCartEmail({ email, configuratorId, cartData, emailType, discountPercent = 0 }: {
  email: string;
  configuratorId: string;
  cartData: any;
  emailType: 'gentle' | 'discount' | 'final';
  discountPercent?: number;
}) {
  const configurator = MAIN_CONFIGURATORS.find(c => c.id === configuratorId);
  if (!configurator) return false;
  
  // Import discount codes function
  const { createEmailDiscountCode } = await import('@/lib/discountCodes');
  
  let incentiveText = '';
  let subject = '';
  let mainMessage = '';
  let discountCode = null;
  
  // Create discount code for this email
  try {
    switch (emailType) {
      case 'gentle':
        subject = `🎨 Ai uitat ceva? ${configurator.title} te așteaptă!`;
        mainMessage = `${configurator.title} pe care l-ai configurat te așteaptă să finalizezi comanda.`;
        discountCode = await createEmailDiscountCode('abandoned_gentle', configuratorId);
        incentiveText = `<div style="background: linear-gradient(135deg, #059669, #10B981); color: white; padding: 20px; border-radius: 8px; margin: 16px 0; text-align: center;">
          <strong style="font-size: 18px;">🚚 LIVRARE GRATUITĂ</strong><br/>
          <span>Folosește codul: <strong>${discountCode.code}</strong></span><br/>
          <small style="opacity: 0.9;">Valabil ${Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} zile!</small>
        </div>`;
        break;
        
      case 'discount':
        subject = `🎁 10% REDUCERE pentru ${configurator.title}!`;
        mainMessage = `${configurator.title} pe care l-ai configurat vine cu o surpriză plăcută!`;
        discountCode = await createEmailDiscountCode('abandoned_discount', configuratorId);
        incentiveText = `<div style="background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; padding: 20px; border-radius: 8px; margin: 16px 0; text-align: center;">
          <strong style="font-size: 20px;">🎉 REDUCERE ${discountCode.value}%</strong><br/>
          <span>Codul tău exclusiv: <strong>${discountCode.code}</strong></span><br/>
          <small style="opacity: 0.9;">Valabil ${Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} zile pentru comenzi peste ${discountCode.minOrderValue} RON!</small>
        </div>`;
        break;
        
      case 'final':
        subject = `⏰ ULTIMA ȘANSĂ: 15% reducere pentru ${configurator.title}!`;
        mainMessage = `Configurația ta pentru ${configurator.title} se va șterge din sistem în curând.`;
        discountCode = await createEmailDiscountCode('abandoned_final', configuratorId);
        incentiveText = `<div style="background: linear-gradient(135deg, #DC2626, #EF4444); color: white; padding: 20px; border-radius: 8px; margin: 16px 0; text-align: center;">
          <strong style="font-size: 22px;">🔥 REDUCERE ${discountCode.value}%</strong><br/>
          <span>ULTIMUL TĂU COD: <strong>${discountCode.code}</strong></span><br/>
          <small style="opacity: 0.9;">Expiră în ${Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60))} ore!</small>
        </div>`;
        break;
    }
  } catch (error) {
    console.error('[Email] Failed to create discount code:', error);
    // Fallback to generic incentives if discount creation fails
    incentiveText = `<div style="background: #EFF6FF; border: 1px solid #3B82F6; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
      <strong style="color: #1D4ED8;">💬 Ai întrebări?</strong><br/>
      <span style="color: #1E40AF;">Răspundem în maxim 30 minute la contact@prynt.ro</span>
    </div>`;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  const buttonUrl = `${baseUrl}${configurator.url}?utm_source=email&utm_medium=abandoned&utm_campaign=${emailType}`;
  
  const html = getHtmlTemplate({
    title: subject.replace(/🎨|🎁|⏰/, '').trim(),
    message: mainMessage,
    buttonText: emailType === 'final' ? "Finalizează ACUM" : "Continuă Comanda",
    buttonUrl: buttonUrl,
    footerText: "Echipa Prynt"
  });
  
  const enhancedHtml = html.replace(
    '<div style="text-align: center; margin: 30px 0;">',
    `${incentiveText}<div style="text-align: center; margin: 30px 0;">`
  );
  
  try {
    await resend.emails.send({
      from: 'PRYNT <noreply@prynt.ro>',
      to: email,
      subject: subject,
      html: enhancedHtml,
    });
    return true;
  } catch (error) {
    console.error('[Email] Abandoned cart send failed:', error);
    return false;
  }
}

export default {
  MAIN_CONFIGURATORS,
  EMAIL_CATEGORIES,
  generateConfiguratorEmailContent,
  getSmartRecommendations,
  sendConfiguratorWelcomeEmail,
  sendAbandonedCartEmail
};