/*
  Warnings:

  - You are about to drop the column `image_url` on the `MasterProduct` table. All the data in the column will be lost.
  - You are about to drop the column `master_product_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_id` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_movement_id]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[warehouse_id]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[complaint_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `Complaint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `master_product_id` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_movement_id` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warehouse_id` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stock` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expiration_status` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `MasterProduct` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sku` on table `MasterProduct` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `MasterProduct` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category_id` on table `MasterProduct` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inventory_id` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `complaint_id` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `payment_type` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `movement_type` on table `ProductMovement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `ProductMovement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `destination` on table `ProductMovement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `origin` on table `ProductMovement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_role` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Warehouse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Warehouse` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_product_movement_id_fkey";

-- DropForeignKey
ALTER TABLE "MasterProduct" DROP CONSTRAINT "MasterProduct_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_master_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_warehouse_id_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Complaint" ALTER COLUMN "text" SET NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "master_product_id" SET NOT NULL,
ALTER COLUMN "product_movement_id" SET NOT NULL,
ALTER COLUMN "warehouse_id" SET NOT NULL,
ALTER COLUMN "stock" SET NOT NULL,
ALTER COLUMN "expiration_status" SET NOT NULL,
ALTER COLUMN "isdelete" DROP DEFAULT;

-- AlterTable
ALTER TABLE "MasterProduct" DROP COLUMN "image_url",
ADD COLUMN     "image" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "sku" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "category_id" SET NOT NULL,
ALTER COLUMN "isdelete" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "master_product_id",
DROP COLUMN "warehouse_id",
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "inventory_id" SET NOT NULL,
ALTER COLUMN "complaint_id" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "payment_type" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductMovement" ALTER COLUMN "movement_type" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "destination" SET NOT NULL,
ALTER COLUMN "iscondition_good" DROP DEFAULT,
ALTER COLUMN "origin" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "user_role" SET NOT NULL,
ALTER COLUMN "isdelete" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Warehouse" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "isdelete" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_product_movement_id_key" ON "Inventory"("product_movement_id");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_warehouse_id_key" ON "Inventory"("warehouse_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_complaint_id_key" ON "Order"("complaint_id");

-- AddForeignKey
ALTER TABLE "ProductMovement" ADD CONSTRAINT "ProductMovement_id_fkey" FOREIGN KEY ("id") REFERENCES "Inventory"("product_movement_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterProduct" ADD CONSTRAINT "MasterProduct_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
