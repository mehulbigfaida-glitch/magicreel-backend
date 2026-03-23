/*
  Warnings:

  - You are about to drop the column `failureReason` on the `Render` table. All the data in the column will be lost.
  - You are about to drop the column `retries` on the `Render` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Render" DROP COLUMN "failureReason",
DROP COLUMN "retries";

-- AddForeignKey
ALTER TABLE "LookbookEdit" ADD CONSTRAINT "LookbookEdit_lookbookId_fkey" FOREIGN KEY ("lookbookId") REFERENCES "Lookbook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
