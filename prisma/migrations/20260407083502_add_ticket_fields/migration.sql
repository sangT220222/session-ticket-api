-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('todo', 'in_progress', 'completed');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "status" "TicketStatus";
