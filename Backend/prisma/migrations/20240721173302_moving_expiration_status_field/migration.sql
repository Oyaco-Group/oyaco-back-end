/*
  Warnings:

  - You are about to drop the column `expiration_status` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Complaint" ALTER COLUMN "iscomplaint" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "expiration_status";

-- AlterTable
ALTER TABLE "ProductMovement" ADD COLUMN     "expiration_status" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "destination" DROP NOT NULL,
ALTER COLUMN "origin" DROP NOT NULL;
