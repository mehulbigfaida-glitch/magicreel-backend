-- Additive migration: preserve existing Zernio account IDs and connections.
ALTER TABLE "PublishAccount"
  ALTER COLUMN "zernioAccountId" DROP NOT NULL;

ALTER TABLE "PublishAccount"
  ADD COLUMN "metaInstagramUserId" TEXT,
  ADD COLUMN "metaAccessToken" TEXT;
