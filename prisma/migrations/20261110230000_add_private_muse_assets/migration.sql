-- CreateTable
CREATE TABLE "muses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Muse',
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "candidate_number" INTEGER NOT NULL,
    "candidate_image_url" TEXT NOT NULL,
    "candidate_public_id" TEXT NOT NULL,
    "master_portrait_url" TEXT NOT NULL,
    "master_portrait_public_id" TEXT NOT NULL,
    "placeholder_image_url" TEXT NOT NULL,
    "placeholder_public_id" TEXT NOT NULL,
    "processing_image_url" TEXT NOT NULL,
    "processing_public_id" TEXT NOT NULL,
    "processing_back_image_url" TEXT NOT NULL,
    "processing_back_public_id" TEXT NOT NULL,
    "prompt_version" TEXT NOT NULL DEFAULT 'distinctive-muse-v1',
    "status" TEXT NOT NULL DEFAULT 'READY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "muses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "muses_user_id_created_at_idx" ON "muses"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "muses" ADD CONSTRAINT "muses_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
