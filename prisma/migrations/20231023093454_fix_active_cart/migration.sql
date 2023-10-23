/*
  Warnings:

  - You are about to drop the column `is_active` on the `Cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[active_cart_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "is_active";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active_cart_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_active_cart_id_key" ON "User"("active_cart_id");
