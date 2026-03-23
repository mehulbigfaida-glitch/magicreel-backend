-- CreateTable
CREATE TABLE "ProductToModelJob" (
    "id" TEXT NOT NULL,
    "productImageUrl" TEXT NOT NULL,
    "modelImageUrl" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "engineJobId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "resultImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductToModelJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductToModelJob_status_idx" ON "ProductToModelJob"("status");

-- CreateIndex
CREATE INDEX "ProductToModelJob_createdAt_idx" ON "ProductToModelJob"("createdAt");
