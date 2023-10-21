/*
  Warnings:

  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_price` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `game_id` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `purchased_price` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Article` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[purchase_id]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_id` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_game_id_fkey";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "content",
DROP COLUMN "estimated_price",
DROP COLUMN "game_id",
DROP COLUMN "origin",
DROP COLUMN "purchased_price",
DROP COLUMN "state",
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "images_url" TEXT[],
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "purchase_id" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Purchase" (
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

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_purchase_id_key" ON "Article"("purchase_id");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
