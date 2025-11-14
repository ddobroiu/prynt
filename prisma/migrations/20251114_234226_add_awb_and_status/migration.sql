-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "awbCarrier" TEXT,
ADD COLUMN     "awbNumber" TEXT,
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

