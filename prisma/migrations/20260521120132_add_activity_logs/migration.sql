-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('MERIT_ADDED', 'MERIT_UPDATED', 'MERIT_DELETED', 'REGISTRATION_COMPLETED', 'REGISTRATION_CANCELLED', 'EVENT_CREATED', 'EVENT_STATUS_CHANGED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailSubscribed" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "studentId" TEXT,
    "eventId" TEXT,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_studentId_idx" ON "ActivityLog"("studentId");

-- CreateIndex
CREATE INDEX "ActivityLog_eventId_idx" ON "ActivityLog"("eventId");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
