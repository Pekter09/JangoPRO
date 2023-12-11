-- AlterTable
ALTER TABLE "haircuts" ADD COLUMN     "barberId" TEXT;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "date" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "haircuts" ADD CONSTRAINT "haircuts_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barbers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
