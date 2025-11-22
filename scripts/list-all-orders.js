const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { items: true } });
    console.log('Found', orders.length, 'orders');
    for (const o of orders) {
      console.log({ id: o.id, orderNo: o.orderNo, userId: o.userId, total: Number(o.total), status: o.status, awbNumber: o.awbNumber });
    }
  } catch (e) {
    console.error('Error listing orders:', e);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
})();
