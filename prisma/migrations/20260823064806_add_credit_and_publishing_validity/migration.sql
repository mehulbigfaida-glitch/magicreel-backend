ALTER TABLE "users"
ADD COLUMN "credits_valid_until" TIMESTAMP(3),
ADD COLUMN "publishing_subscription_start" TIMESTAMP(3),
ADD COLUMN "publishing_subscription_end" TIMESTAMP(3);
