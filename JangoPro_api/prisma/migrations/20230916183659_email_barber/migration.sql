/*
  Warnings:

  - You are about to drop the column `barberId` on the `haircuts` table. All the data in the column will be lost.
  - Added the required column `email` to the `barbers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "haircuts" DROP CONSTRAINT "haircuts_barberId_fkey";

-- AlterTable
ALTER TABLE "barbers" ADD COLUMN "email" TEXT DEFAULT 'sem-email';

-- AlterTable
ALTER TABLE "haircuts" DROP COLUMN "barberId";
