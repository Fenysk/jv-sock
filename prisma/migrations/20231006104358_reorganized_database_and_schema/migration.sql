/*
  Warnings:

  - You are about to drop the column `game_id` on the `Sale` table. All the data in the column will be lost.
  - Made the column `purchase_id` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_game_id_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_purchase_id_fkey";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "game_id",
ALTER COLUMN "purchase_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
