-- Migration: simplify_token_pricing
-- Replaces inputTokenCost + outputTokenCost with a single costPer1MTokens field.
-- Existing rows: average of old input/output costs used as the initial costPer1MTokens value.

-- Step 1: Add the new column with a temporary default of 0
ALTER TABLE "ModelProviderMapping" ADD COLUMN "costPer1MTokens" INTEGER NOT NULL DEFAULT 0;

-- Step 2: Populate from existing data (average of input and output costs as a reasonable default)
UPDATE "ModelProviderMapping"
SET "costPer1MTokens" = ("inputTokenCost" + "outputTokenCost") / 2;

-- Step 3: Drop old columns
ALTER TABLE "ModelProviderMapping" DROP COLUMN "inputTokenCost";
ALTER TABLE "ModelProviderMapping" DROP COLUMN "outputTokenCost";
