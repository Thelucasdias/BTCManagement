/*
  Warnings:

  - You are about to drop the column `btc_sats` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `btcValue` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "btc_sats",
ADD COLUMN     "btcValue" DECIMAL(18,8) NOT NULL;
