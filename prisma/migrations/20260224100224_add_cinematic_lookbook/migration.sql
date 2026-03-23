-- CreateTable
CREATE TABLE "CinematicLookbook" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "heroImageUrl" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "worldConfig" JSONB NOT NULL,
    "frames" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CinematicLookbook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CinematicLookbook_userId_idx" ON "CinematicLookbook"("userId");

-- AddForeignKey
ALTER TABLE "CinematicLookbook" ADD CONSTRAINT "CinematicLookbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
