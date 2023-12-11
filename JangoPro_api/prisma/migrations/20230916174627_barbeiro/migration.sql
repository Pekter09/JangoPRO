/*
  Warnings:

  - You are about to drop the column `name` on the `barbers` table. All the data in the column will be lost.
  - Added the required column `nome` to the `barbers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `barbers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "barbers" DROP COLUMN "name",
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL;
