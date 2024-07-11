/*
  Warnings:

  - You are about to drop the column `image` on the `MasterProduct` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `ProductMovement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "isdelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MasterProduct" DROP COLUMN "image",
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "isdelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductMovement" ADD COLUMN     "arrival_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "destination" TEXT,
ADD COLUMN     "iscondition_good" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "isdelete" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "ProductMovement" ADD CONSTRAINT "ProductMovement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
