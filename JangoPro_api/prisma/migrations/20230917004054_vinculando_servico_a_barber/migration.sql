-- AlterTable
ALTER TABLE "services" ADD COLUMN     "barber_id" TEXT;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
