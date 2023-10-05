-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "origin" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "content" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
