const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const commit = process.env.COMMIT === '1' || process.env.COMMIT === 'true';
    const orderId = process.env.ORDER_ID; // optional: target single order id
    const newAwb = process.env.NEW_AWB; // optional: replacement AWB

    if (orderId && newAwb && !commit) {
      console.log('To replace AWB for a single order you must set COMMIT=1 as well.');
      process.exit(1);
    }

    const where = orderId ? { id: orderId } : { awbNumber: { startsWith: 'TEST-AWB' } };
    const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'desc' } });

    if (!orders.length) {
      console.log('No test-AWB orders found.');
      return;
    }

    console.log(`Found ${orders.length} order(s) with TEST-AWB:`);
    orders.forEach(o => {
      console.log(`- id=${o.id} orderNo=${o.orderNo} awb=${o.awbNumber} status=${o.status}`);
    });

    if (!commit) {
      console.log('\nRun with COMMIT=1 to clear these test AWBs or to replace one using ORDER_ID and NEW_AWB.');
      return;
    }

    if (orderId && newAwb) {
      const updated = await prisma.order.update({ where: { id: orderId }, data: { awbNumber: String(newAwb), awbCarrier: 'DPD' } });
      console.log('Replaced AWB for order:', { id: updated.id, awbNumber: updated.awbNumber });
      return;
    }

    // Default: clear awbNumber for all matching orders
    for (const o of orders) {
      const updated = await prisma.order.update({ where: { id: o.id }, data: { awbNumber: null, awbCarrier: null } });
      console.log(`Cleared AWB for order ${updated.id}`);
    }

    console.log('Done.');
  } catch (e) {
    console.error('Error while clearing test AWBs:', e);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
})();
