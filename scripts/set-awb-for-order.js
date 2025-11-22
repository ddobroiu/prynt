const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    const arg = process.argv[2];
    let order;
    if (arg && arg.length === 36) {
      // assume it's an order id
      order = await prisma.order.findUnique({ where: { id: arg } });
    } else {
      order = await prisma.order.findFirst({ orderBy: { createdAt: 'desc' } });
    }

    if (!order) {
      console.log('No order found to update.');
      return;
    }

    const awbArg = process.argv[3] || process.env.TEST_AWB || `TEST-AWB-${Date.now()}`;
    const awb = arg && arg.length !== 36 && !process.argv[3] ? arg : awbArg;

    const updated = await prisma.order.update({ where: { id: order.id }, data: { awbNumber: String(awb), awbCarrier: 'DPD' } });
    console.log('Updated order:', { id: updated.id, awbNumber: updated.awbNumber, awbCarrier: updated.awbCarrier });
  } catch (e) {
    console.error('Error updating order AWB:', e);
    process.exitCode = 2;
  } finally {
    await (new PrismaClient()).$disconnect().catch(()=>{});
  }
})();
