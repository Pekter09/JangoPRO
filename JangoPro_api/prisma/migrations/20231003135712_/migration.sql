/*
  Warnings:

  - You are about to drop the column `barberId` on the `haircuts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "haircuts" DROP CONSTRAINT "haircuts_barberId_fkey";

-- AlterTable
ALTER TABLE "haircuts" DROP COLUMN "barberId";

-- CreateTable
CREATE TABLE "_BarberToHaircut" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BarberToHaircut_AB_unique" ON "_BarberToHaircut"("A", "B");

-- CreateIndex
CREATE INDEX "_BarberToHaircut_B_index" ON "_BarberToHaircut"("B");

-- AddForeignKey
ALTER TABLE "_BarberToHaircut" ADD CONSTRAINT "_BarberToHaircut_A_fkey" FOREIGN KEY ("A") REFERENCES "barbers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarberToHaircut" ADD CONSTRAINT "_BarberToHaircut_B_fkey" FOREIGN KEY ("B") REFERENCES "haircuts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
