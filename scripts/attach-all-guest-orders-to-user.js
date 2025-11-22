const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userIdentifier = process.env.USER_ID || process.env.USER_EMAIL;
  if (!userIdentifier) {
    console.error('Please set USER_ID or USER_EMAIL environment variable');
    process.exit(1);
  }

  let user = null;
  if (process.env.USER_ID) {
    user = await prisma.user.findUnique({ where: { id: process.env.USER_ID } });
  } else {
    user = await prisma.user.findUnique({ where: { email: process.env.USER_EMAIL } });
  }

  if (!user) {
    console.error('User not found for', userIdentifier);
    process.exit(1);
  }

  const guestOrders = await prisma.order.findMany({ where: { userId: null } });

  if (!guestOrders.length) {
    console.log('No guest orders to attach.');
    return;
  }

  console.log(`Found ${guestOrders.length} guest orders. Will attach to user ${user.email} (id: ${user.id}).`);
  for (const o of guestOrders) {
    console.log(`- OrderNo: ${o.orderNo}  id: ${o.id}  total: ${o.total}`);
  }

  if (process.env.COMMIT === '1') {
    console.log('\nCOMMIT=1 detected. Applying updates...');
    for (const o of guestOrders) {
      await prisma.order.update({ where: { id: o.id }, data: { userId: user.id } });
      console.log(`Updated order ${o.orderNo} -> user ${user.email}`);
    }
    console.log('All updates applied.');
  } else {
    console.log('\nDry-run only. To apply changes re-run with COMMIT=1 and USER_ID or USER_EMAIL:');
    console.log("  $env:USER_EMAIL='contact@prynt.ro'; $env:COMMIT='1'; node .\\scripts\\attach-all-guest-orders-to-user.js; Remove-Item Env:COMMIT; Remove-Item Env:USER_EMAIL");
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
