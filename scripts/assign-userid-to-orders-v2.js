const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalizePhone(p) {
  if (!p) return '';
  return p.replace(/[^0-9]/g, '');
}

async function main() {
  const orders = await prisma.order.findMany({
    where: { userId: null },
    select: { id: true, orderNo: true, address: true, createdAt: true }
  });

  if (!orders.length) {
    console.log('No guest orders found.');
    return;
  }

  const users = await prisma.user.findMany({ include: { addresses: true } });
  const usersByEmail = new Map();
  const usersByPhone = new Map();

  for (const u of users) {
    if (u.email) usersByEmail.set(u.email.toLowerCase(), u);
    for (const a of (u.addresses || [])) {
      if (a.phone) usersByPhone.set(normalizePhone(a.phone), u);
    }
  }

  const matches = [];
  for (const o of orders) {
    const addr = o.address || {};
    const email = (addr.email || '').toLowerCase();
    const phone = normalizePhone(addr.phone || '');
    let user = null;
    if (email && usersByEmail.has(email)) user = usersByEmail.get(email);
    else if (phone && usersByPhone.has(phone)) user = usersByPhone.get(phone);

    if (user) {
      matches.push({ orderId: o.id, orderNo: o.orderNo, orderCreatedAt: o.createdAt, userId: user.id, userEmail: user.email, matchedBy: user.email && email === (user.email || '').toLowerCase() ? 'email' : 'phone' });
    }
  }

  if (!matches.length) {
    console.log('No matching user found for guest orders by email or phone.');
    return;
  }

  console.log('Found the following potential matches (dry-run):');
  for (const m of matches) {
    console.log(`Order ${m.orderNo} (${m.orderId}) -> User ${m.userEmail} (${m.userId}) via ${m.matchedBy}`);
  }

  if (process.env.COMMIT === '1') {
    console.log('\nCOMMIT=1 detected. Applying updates...');
    for (const m of matches) {
      await prisma.order.update({ where: { id: m.orderId }, data: { userId: m.userId } });
      console.log(`Updated order ${m.orderNo} -> user ${m.userEmail}`);
    }
    console.log('All updates applied.');
  } else {
    console.log('\nDry-run only. To apply these changes, re-run with COMMIT=1:');
    console.log('  COMMIT=1 node scripts/assign-userid-to-orders-v2.js');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
