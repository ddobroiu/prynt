const { sendConfiguratorWelcomeEmail, sendAbandonedCartEmail } = require('./lib/emailMarketing');

async function testEmails() {
  console.log('🚀 Trimit mailuri de probă...\n');
  
  try {
    // 1. Email Welcome pentru Canvas
    console.log('1️⃣ Trimit Welcome Email pentru Canvas...');
    const welcome = await sendConfiguratorWelcomeEmail('contact@prynt.ro', 'canvas');
    console.log(welcome ? '✅ Trimis cu succes' : '❌ Eroare la trimitere');
    
    // 2. Email Welcome pentru Banner  
    console.log('2️⃣ Trimit Welcome Email pentru Banner...');
    const welcomeBanner = await sendConfiguratorWelcomeEmail('contact@prynt.ro', 'banner');
    console.log(welcomeBanner ? '✅ Trimis cu succes' : '❌ Eroare la trimitere');
    
    // 3. Abandoned Cart - prima încercare (gentle)
    console.log('3️⃣ Trimit Abandoned Cart - prima încercare...');
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
    console.log(abandoned1 ? '✅ Trimis cu succes' : '❌ Eroare la trimitere');
    
    // 4. Abandoned Cart - a doua încercare (discount 10%)
    console.log('4️⃣ Trimit Abandoned Cart - a doua încercare (10% discount)...');
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
    console.log(abandoned2 ? '✅ Trimis cu succes' : '❌ Eroare la trimitere');
    
    // 5. Abandoned Cart - ultima încercare (discount 15%)
    console.log('5️⃣ Trimit Abandoned Cart - ultima încercare (15% discount)...');
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
    console.log(abandoned3 ? '✅ Trimis cu succes' : '❌ Eroare la trimitere');
    
    console.log('\n🎉 Toate mailurile au fost trimise pe contact@prynt.ro!');
    console.log('📧 Verifică inbox-ul pentru a vedea noile coduri de reducere funcționale.');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
  }
}

testEmails();