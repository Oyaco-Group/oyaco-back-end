/*
  Warnings:

  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.
  - Added the required column `buyer_status` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "buyer_status" TEXT NOT NULL,
ADD COLUMN     "order_status" TEXT NOT NULL;
