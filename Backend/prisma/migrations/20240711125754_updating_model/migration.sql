-- AlterTable
ALTER TABLE "Complaint" ALTER COLUMN "text" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "isdelete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "MasterProduct" ALTER COLUMN "isdelete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "ProductMovement" ALTER COLUMN "iscondition_good" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isdelete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Warehouse" ALTER COLUMN "isdelete" SET DEFAULT false;
