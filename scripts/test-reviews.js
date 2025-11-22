const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const reviews = await prisma.review.findMany({ where: { productSlug: 'banner' }, include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: 'desc' } });
    console.log('Found', reviews.length, 'reviews');
    console.dir(reviews, { depth: 2 });
  } catch (e) {
    console.error('Error querying reviews:', e);
  } finally {
    await prisma.$disconnect();
  }
})();