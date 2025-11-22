const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userEmail = process.env.USER_EMAIL;
  if (!userEmail) {
    console.error('Please set USER_EMAIL env var');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) {
    console.error('User not found:', userEmail);
    process.exit(1);
  }

  const canceledOrders = await prisma.order.findMany({ where: { userId: user.id, status: 'canceled' } });
  if (!canceledOrders.length) {
    console.log('No canceled orders found for user', userEmail);
    return;
  }

  console.log(`Found ${canceledOrders.length} canceled orders for user ${userEmail}:`);
  for (const o of canceledOrders) {
    console.log(`- ${o.orderNo} (${o.id}) total: ${o.total}`);
  }

  if (process.env.COMMIT === '1') {
    console.log('\nCOMMIT=1 detected. Updating statuses to "paid"...');
    for (const o of canceledOrders) {
      await prisma.order.update({ where: { id: o.id }, data: { status: 'paid' } });
      console.log(`Updated order ${o.orderNo} -> paid`);
    }
    console.log('All updates applied.');
  } else {
    console.log('\nDry-run only. To apply run with COMMIT=1:');
    console.log('  $env:USER_EMAIL="contact@prynt.ro"; $env:COMMIT="1"; node .\\scripts\\mark-user-canceled-orders-paid.js; Remove-Item Env:COMMIT; Remove-Item Env:USER_EMAIL');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
