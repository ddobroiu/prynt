import { NextResponse } from 'next/server';
import { sendConfiguratorWelcomeEmail, sendAbandonedCartEmail } from '@/lib/emailMarketing';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { type = 'all' } = await request.json().catch(() => ({}));
    
    const results = [];
    
    if (type === 'all' || type === 'welcome-canvas') {
      // 1. Welcome Canvas
      console.log('🎨 Trimit Welcome Email pentru Canvas...');
      const welcomeCanvas = await sendConfiguratorWelcomeEmail({
        email: 'contact@prynt.ro',
        interests: ['canvas'],
        name: 'Test User',
        source: 'test'
      });
      results.push({ type: 'welcome-canvas', success: welcomeCanvas });
    }
    
    if (type === 'all' || type === 'welcome-banner') {
      // 2. Welcome Banner
      console.log('🖼️ Trimit Welcome Email pentru Banner...');
      const welcomeBanner = await sendConfiguratorWelcomeEmail({
        email: 'contact@prynt.ro', 
        interests: ['banner'],
        name: 'Test User',
        source: 'test'
      });
      results.push({ type: 'welcome-banner', success: welcomeBanner });
    }

    if (type === 'all' || type === 'welcome-afise') {
      // 3. Welcome Afișe
      console.log('📄 Trimit Welcome Email pentru Afișe...');
      const welcomeAfise = await sendConfiguratorWelcomeEmail({
        email: 'contact@prynt.ro',
        interests: ['afise'], 
        name: 'Test User',
        source: 'test'
      });
      results.push({ type: 'welcome-afise', success: welcomeAfise });
    }

    if (type === 'all' || type === 'welcome-autocolante') {
      // 4. Welcome Autocolante
      console.log('🏷️ Trimit Welcome Email pentru Autocolante...');
      const welcomeAutocolante = await sendConfiguratorWelcomeEmail({
        email: 'contact@prynt.ro',
        interests: ['autocolante'],
        name: 'Test User', 
        source: 'test'
      });
      results.push({ type: 'welcome-autocolante', success: welcomeAutocolante });
    }

    if (type === 'all' || type === 'welcome-flayere') {
      // 5. Welcome Flyere
      console.log('📢 Trimit Welcome Email pentru Flyere...');
      const welcomeFlayere = await sendConfiguratorWelcomeEmail({
        email: 'contact@prynt.ro',
        interests: ['flayere'],
        name: 'Test User',
        source: 'test' 
      });
      results.push({ type: 'welcome-flayere', success: welcomeFlayere });
    }
    
    if (type === 'all' || type === 'abandoned-gentle') {
      // 3. Abandoned Cart - gentle
      console.log('😊 Trimit Abandoned Cart - gentle...');
      const abandoned1 = await sendAbandonedCartEmail({
        email: 'contact@prynt.ro',
        configuratorId: 'canvas',
        cartData: {
          width_cm: 60,
          height_cm: 40,
          material: 'canvas',
          quantity: 1,
          price: 150
        },
        emailType: 'gentle'
      });
      results.push({ type: 'abandoned-gentle', success: abandoned1 });
    }
    
    if (type === 'all' || type === 'abandoned-discount') {
      // 4. Abandoned Cart - discount 10%
      console.log('💰 Trimit Abandoned Cart - 10% discount...');
      const abandoned2 = await sendAbandonedCartEmail({
        email: 'contact@prynt.ro',
        configuratorId: 'banner',
        cartData: {
          width_cm: 200,
          height_cm: 100,
          material: 'pvc',
          quantity: 2,
          price: 280
        },
        emailType: 'discount',
        discountPercent: 10
      });
      results.push({ type: 'abandoned-discount', success: abandoned2 });
    }
    
    if (type === 'all' || type === 'abandoned-final') {
      // 5. Abandoned Cart - final 15%
      console.log('🔥 Trimit Abandoned Cart - 15% final discount...');
      const abandoned3 = await sendAbandonedCartEmail({
        email: 'contact@prynt.ro',
        configuratorId: 'afise',
        cartData: {
          width_cm: 70,
          height_cm: 100,
          material: 'alucobond',
          quantity: 1,
          price: 350
        },
        emailType: 'final',
        discountPercent: 15
      });
      results.push({ type: 'abandoned-final', success: abandoned3 });
    }
    
    return NextResponse.json({
      success: true,
      message: `📧 Am trimis ${results.length} emailuri pe contact@prynt.ro cu coduri de reducere reale!`,
      results,
      note: 'Verifică inbox-ul pentru noile coduri funcționale 🎉'
    });
    
  } catch (error) {
    console.error('❌ Eroare la trimiterea emailurilor:', error);
    return NextResponse.json(
      { message: 'Eroare la trimiterea emailurilor', error: (error as Error).message },
      { status: 500 }
    );
  }
}