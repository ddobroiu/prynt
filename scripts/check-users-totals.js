const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const usersRaw = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          select: { id: true, total: true, createdAt: true, status: true }
        },
        addresses: {
          where: { isDefault: true },
          take: 1
        }
      }
    });

    const users = usersRaw.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      orders: user.orders.map(o => ({ id: o.id, total: Number(o.total), status: o.status })) ,
      addresses: user.addresses
    }));

    for (const u of users) {
      const totalSpent = u.orders.filter(o => o.status !== 'canceled').reduce((s, o) => s + (o.total || 0), 0);
      console.log(`User: ${u.email} (${u.id}) - Orders: ${u.orders.length} - TotalSpent: ${totalSpent}`);
    }

  } catch (e) {
    console.error('Error checking users totals:', e);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
})();
