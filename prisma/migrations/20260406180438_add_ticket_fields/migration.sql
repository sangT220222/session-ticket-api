-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "description" TEXT,
ADD COLUMN     "priority" "TicketPriority";
