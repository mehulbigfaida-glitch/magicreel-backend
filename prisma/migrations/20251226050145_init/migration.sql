-- CreateTable
CREATE TABLE "Garment" (
    "id" TEXT NOT NULL,
    "frontImageUrl" TEXT NOT NULL,
    "backImageUrl" TEXT,
    "category" TEXT NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Garment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lookbook" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "presetId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "garmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lookbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Render" (
    "id" TEXT NOT NULL,
    "pose" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "modelImageUrl" TEXT NOT NULL,
    "garmentImageUrl" TEXT NOT NULL,
    "outputImageUrl" TEXT,
    "status" TEXT NOT NULL,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "failureReason" TEXT,
    "lookbookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Render_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lookbook" ADD CONSTRAINT "Lookbook_garmentId_fkey" FOREIGN KEY ("garmentId") REFERENCES "Garment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Render" ADD CONSTRAINT "Render_lookbookId_fkey" FOREIGN KEY ("lookbookId") REFERENCES "Lookbook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
