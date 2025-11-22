const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const order = await prisma.order.findFirst({ orderBy: { createdAt: 'desc' }, include: { items: true } });
    if (!order) {
      console.log('No orders found');
      return;
    }
    console.log('Latest order:');
    console.log({ id: order.id, orderNo: order.orderNo, total: Number(order.total), awbNumber: order.awbNumber, awbCarrier: order.awbCarrier, status: order.status, createdAt: order.createdAt });
    console.dir(order.items || [], { depth: 2 });
  } catch (e) {
    console.error('Error fetching latest order:', e);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
})();
