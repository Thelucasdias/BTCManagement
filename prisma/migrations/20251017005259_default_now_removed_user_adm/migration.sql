-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "occurredAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "createdAt" DROP DEFAULT;
