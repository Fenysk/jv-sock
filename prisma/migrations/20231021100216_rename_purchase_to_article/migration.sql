/*
  Warnings:

  - You are about to drop the column `purchase_id` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[article_id]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `article_id` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_game_id_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_purchase_id_fkey";

-- DropIndex
DROP INDEX "Sale_purchase_id_key";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "purchase_id",
ADD COLUMN     "article_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Purchase";

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "purchased_price" DOUBLE PRECISION NOT NULL,
    "estimated_price" DOUBLE PRECISION NOT NULL,
    "origin" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "content" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sale_article_id_key" ON "Sale"("article_id");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
