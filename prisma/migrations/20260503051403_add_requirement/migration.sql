-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "deliveryLocation" TEXT NOT NULL,
    "deliveryDeadline" TIMESTAMP(3) NOT NULL,
    "budgetMin" DOUBLE PRECISION,
    "budgetMax" DOUBLE PRECISION,
    "budgetHidden" BOOLEAN NOT NULL DEFAULT false,
    "closingDatetime" TIMESTAMP(3) NOT NULL,
    "biddingMode" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "specDocumentUrl" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Requirement_categoryId_idx" ON "Requirement"("categoryId");

-- CreateIndex
CREATE INDEX "Requirement_buyerId_idx" ON "Requirement"("buyerId");

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
