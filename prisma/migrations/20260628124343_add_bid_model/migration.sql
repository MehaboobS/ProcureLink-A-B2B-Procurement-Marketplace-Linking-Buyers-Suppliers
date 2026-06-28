-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "quotedPrice" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "deliveryDays" INTEGER NOT NULL,
    "remarks" TEXT,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bid_requirementId_supplierId_key" ON "Bid"("requirementId", "supplierId");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
