/*
  Warnings:

  - Added the required column `slugify` to the `MasterProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MasterProduct" ADD COLUMN     "slugify" TEXT NOT NULL;
