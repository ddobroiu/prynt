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
    
    const daysLeft = Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    discountCodeHtml = `
    <div style="background:#0F172A;color:#F8FAFC;padding:22px;border-radius:14px;margin:24px 0;font-family:Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.25);">
      <div style="font-size:22px;font-weight:700;letter-spacing:.5px;display:flex;align-items:center;justify-content:center;gap:8px;">
        <span>🎁</span><span>Cadou de Bun Venit</span>
      </div>
      <div style="margin-top:10px;font-size:15px;line-height:1.5;">
        <strong style="color:#C7D2FE;">🚚 Livrare gratuită</strong> la <u>toată comanda</u> cu codul:<br/>
        <span style="display:inline-block;margin-top:8px;padding:10px 16px;background:#1E3A8A;border:1px solid #3B82F6;border-radius:10px;font-size:18px;font-weight:700;letter-spacing:1px;">${discountCode.code}</span>
      </div>
      <div style="margin-top:12px;font-size:12px;opacity:.85;line-height:1.4;">
        Prag minim: ${discountCode.minOrderValue} RON • Valabil ${daysLeft} ${daysLeft === 1 ? 'zi' : 'zile'} • Se aplică la toate produsele din coș. Nu se cumulează cu alte coduri.
      </div>
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
        {
          const daysLeft = Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          incentiveText = `
          <div style="background:#064E3B;color:#ECFDF5;padding:20px;border-radius:14px;margin:20px 0;font-family:Arial,sans-serif;box-shadow:0 3px 10px rgba(0,0,0,0.25);text-align:center;">
            <div style="font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;">
              <span>🟢</span><span>Continuă comanda</span>
            </div>
            <div style="margin-top:8px;font-size:14px;line-height:1.5;">🎯 Reținem configurarea încă puțin – salveaz-o acum.</div>
            <div style="margin-top:14px;font-size:15px;font-weight:600;">🚚 Livrare gratuită la toată comanda</div>
            <div style="margin-top:6px;">Cod: <span style="background:#065F46;padding:8px 14px;border-radius:8px;font-weight:700;letter-spacing:.5px;">${discountCode.code}</span></div>
            <div style="margin-top:8px;font-size:11px;opacity:.85;">Valabil ${daysLeft} ${daysLeft === 1 ? 'zi' : 'zile'} • Se aplică întregului total • Nu se cumulează cu alte coduri.</div>
          </div>`;
        }
        break;
        
      case 'discount':
        subject = `🎁 ${configurator.title}: 10% reducere aplicată la toată comanda`; 
        mainMessage = `Ai configurat ${configurator.title}, iar noi ți-am rezervat un bonus special. Profită de reducere înainte să expiră.`;
        discountCode = await createEmailDiscountCode('abandoned_discount', configuratorId);
        {
          const daysLeft = Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          incentiveText = `
          <div style="background:#4C1D95;color:#F5F3FF;padding:22px;border-radius:14px;margin:22px 0;font-family:Arial,sans-serif;box-shadow:0 4px 14px rgba(76,29,149,.4);text-align:center;">
            <div style="font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;">
              <span>🎉</span><span>${discountCode.value}% Reducere</span>
            </div>
            <div style="margin-top:10px;font-size:14px;line-height:1.5;">Se aplică la <strong>TOATĂ COMANDA</strong> (inclusiv alte produse) – dacă totalul depășește ${discountCode.minOrderValue} RON.</div>
            <div style="margin-top:14px;">Cod: <span style="background:#6D28D9;padding:10px 18px;border-radius:10px;font-weight:700;letter-spacing:1px;">${discountCode.code}</span></div>
            <div style="margin-top:10px;font-size:11px;opacity:.85;">Valabil ${daysLeft} ${daysLeft === 1 ? 'zi' : 'zile'} • Nu se cumulează cu alte coduri • Se aplică înainte de transport.</div>
          </div>`;
        }
        break;
        
      case 'final':
        mainMessage = `Configurația ta pentru ${configurator.title} se va șterge curând. Acesta este ultimul email – dacă finalizezi acum, beneficiezi de reducere pe întregul coș.`;
        discountCode = await createEmailDiscountCode('abandoned_final', configuratorId);
        subject = `⏰ Ultima șansă: ${discountCode.value}% reducere globală pentru ${configurator.title}`;
        {
          const hoursLeft = Math.ceil((discountCode.validUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60));
          incentiveText = `
          <div style="background:#7F1D1D;color:#FEE2E2;padding:24px;border-radius:16px;margin:24px 0;font-family:Arial,sans-serif;box-shadow:0 4px 16px rgba(127,29,29,.45);text-align:center;">
            <div style="font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:8px;">
              <span>🔥</span><span>${discountCode.value}% Reducere Finală</span>
            </div>
            <div style="margin-top:12px;font-size:14px;line-height:1.55;">Se aplică la <strong>TOATĂ COMANDA</strong>. După expirare, configurarea și avantajul se pierd.</div>
            <div style="margin-top:16px;">Cod: <span style="background:#991B1B;padding:12px 20px;border-radius:12px;font-weight:700;letter-spacing:1px;">${discountCode.code}</span></div>
            <div style="margin-top:12px;font-size:11px;opacity:.85;">Expiră în ${hoursLeft} ${hoursLeft === 1 ? 'oră' : 'ore'} • Ne-cumulabil • Folosește-l înainte de procesarea stocurilor.</div>
          </div>`;
        }
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