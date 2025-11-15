/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `UserGraphic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `UserGraphic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserGraphic" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserGraphic_publicId_key" ON "UserGraphic"("publicId");
