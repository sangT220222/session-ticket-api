-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "createdByID" TEXT NOT NULL DEFAULT 'cmnreizcl00002dbrz4pi2x65';

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdByID_fkey" FOREIGN KEY ("createdByID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
