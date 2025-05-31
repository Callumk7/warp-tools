-- First add the column as nullable
ALTER TABLE "expense" ADD COLUMN "name" text;

-- Update existing rows with a placeholder value
UPDATE "expense" SET "name" = 'PLACEHOLDER_NAME' WHERE "name" IS NULL;

-- Then make the column NOT NULL
ALTER TABLE "expense" ALTER COLUMN "name" SET NOT NULL;
