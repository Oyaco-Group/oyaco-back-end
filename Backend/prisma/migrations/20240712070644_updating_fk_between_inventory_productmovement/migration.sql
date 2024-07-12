/*
  Warnings:

  - You are about to drop the column `product_movement_id` on the `Inventory` table. All the data in the column will be lost.
  - Added the required column `inventory_id` to the `ProductMovement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductMovement" DROP CONSTRAINT "ProductMovement_id_fkey";

-- DropIndex
DROP INDEX "Inventory_product_movement_id_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "product_movement_id";

-- AlterTable
ALTER TABLE "ProductMovement" ADD COLUMN     "inventory_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductMovement" ADD CONSTRAINT "ProductMovement_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
