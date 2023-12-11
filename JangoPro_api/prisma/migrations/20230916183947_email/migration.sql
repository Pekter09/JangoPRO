/*
  Warnings:

  - Made the column `email` on table `barbers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "barbers" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" DROP DEFAULT;
