-- CreateTable
CREATE TABLE "LookbookEdit" (
    "id" TEXT NOT NULL,
    "lookbookId" TEXT NOT NULL,
    "elementType" TEXT NOT NULL,
    "sourceImage" TEXT NOT NULL,
    "resultImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LookbookEdit_pkey" PRIMARY KEY ("id")
);
