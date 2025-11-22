const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    where: { userId: null },
    select: { id: true, orderNo: true, address: true, createdAt: true }
  });

  if (!orders.length) {
    console.log('No guest orders found.');
    return;
  }

  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  const usersByEmail = new Map(users.map(u => [u.email && u.email.toLowerCase(), u]));

  const matches = [];
  for (const o of orders) {
    const addr = o.address || {};
    const email = (addr.email || '').toLowerCase();
    if (!email) continue;
    const user = usersByEmail.get(email);
    if (user) {
      matches.push({ orderId: o.id, orderNo: o.orderNo, orderCreatedAt: o.createdAt, userId: user.id, userEmail: user.email });
    }
  }

  if (!matches.length) {
    console.log('No matching user found for guest orders by email.');
    return;
  }

  console.log('Found the following potential matches (dry-run):');
  for (const m of matches) {
    console.log(`Order ${m.orderNo} (${m.orderId}) -> User ${m.userEmail} (${m.userId})`);
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
    console.log('  COMMIT=1 node scripts/assign-userid-to-orders.js');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
