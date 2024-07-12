/*
  Warnings:

  - You are about to drop the column `stock` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `complaint_id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `Complaint` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_id` to the `Complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_complaint_id_fkey";

-- DropIndex
DROP INDEX "Order_complaint_id_key";

-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "order_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "stock",
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "complaint_id";

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_order_id_key" ON "Complaint"("order_id");

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
