/*
  Warnings:

  - A unique constraint covering the columns `[name,console,edition,region,released_year]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_name_console_edition_region_released_year_key" ON "Game"("name", "console", "edition", "region", "released_year");
